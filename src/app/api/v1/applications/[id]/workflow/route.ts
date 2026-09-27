import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { enforceRole } from '@/lib/server/auth';
import { BackendDomainService } from '@/lib/server/domainService';
import { ApplicationStage, ApplicationTimelineEvent } from '@/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await db.applications.findUnique({ where: { id } });

  if (!app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { action, targetStage, notes, deficiencyDetails, aiFindingId, aiFindingStatus } = body as {
      action: 'INSTITUTE_VERIFY' | 'OFFICER_APPROVE' | 'RAISE_DEFICIENCY' | 'RESOLVE_DEFICIENCY' | 'REVIEW_AI_FINDING';
      targetStage?: ApplicationStage;
      notes?: string;
      deficiencyDetails?: {
        documentType: string;
        issueType: string;
        problemDescription: string;
        requiredAction: string;
      };
      aiFindingId?: string;
      aiFindingStatus?: 'CONFIRMED' | 'DISMISSED';
    };

    let newStage = app.stage;
    const timeline = [...app.timeline];

    if (action === 'INSTITUTE_VERIFY') {
      const auth = enforceRole(req, ['INSTITUTE', 'ADMIN']);
      if (auth instanceof NextResponse) return auth;

      newStage = targetStage || 'INSTITUTE_VERIFICATION';
      if (!BackendDomainService.validateStageTransition(app.stage, newStage)) {
        return NextResponse.json(
          { error: `Invalid transition from ${app.stage} to ${newStage}` },
          { status: 422 }
        );
      }

      timeline.unshift({
        id: `tl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        stage: newStage,
        actor: auth.session.name,
        actorRole: auth.session.role,
        title: 'Institute Verification Completed',
        description: 'Institute Nodal Officer verified student credentials and documents',
        notes: notes || 'Verified with institute physical records',
      });
    } else if (action === 'OFFICER_APPROVE') {
      const auth = enforceRole(req, ['OFFICER', 'ADMIN']);
      if (auth instanceof NextResponse) return auth;

      newStage = targetStage || 'SELECTION';
      if (!BackendDomainService.validateStageTransition(app.stage, newStage)) {
        return NextResponse.json(
          { error: `Invalid transition from ${app.stage} to ${newStage}` },
          { status: 422 }
        );
      }

      timeline.unshift({
        id: `tl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        stage: newStage,
        actor: auth.session.name,
        actorRole: auth.session.role,
        title: 'State/Ministry Officer Review Passed',
        description: 'Application approved by verifying officer for Merit Selection',
        notes: notes || 'All rules and AI findings validated',
      });
    } else if (action === 'RAISE_DEFICIENCY') {
      const auth = enforceRole(req, ['INSTITUTE', 'OFFICER', 'ADMIN']);
      if (auth instanceof NextResponse) return auth;

      newStage = 'DEFICIENCY';
      timeline.unshift({
        id: `tl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        stage: 'DEFICIENCY',
        actor: auth.session.name,
        actorRole: auth.session.role,
        title: 'Deficiency Tagged',
        description: deficiencyDetails?.problemDescription || 'Document re-upload required',
        notes: deficiencyDetails?.requiredAction || 'Please upload updated document',
      });
    } else if (action === 'RESOLVE_DEFICIENCY') {
      const auth = enforceRole(req, ['APPLICANT', 'INSTITUTE', 'OFFICER', 'ADMIN']);
      if (auth instanceof NextResponse) return auth;

      newStage = 'SUBMITTED';
      timeline.unshift({
        id: `tl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        stage: 'SUBMITTED',
        actor: auth.session.name,
        actorRole: auth.session.role,
        title: 'Deficiency Resubmitted',
        description: 'Applicant uploaded revised document for verification',
      });
    } else if (action === 'REVIEW_AI_FINDING') {
      const auth = enforceRole(req, ['OFFICER', 'ADMIN']);
      if (auth instanceof NextResponse) return auth;

      if (aiFindingId && aiFindingStatus) {
        const findings = app.aiFindings.map((f) =>
          f.id === aiFindingId
            ? {
                ...f,
                status: aiFindingStatus,
                reviewedBy: auth.session.name,
                reviewedAt: new Date().toISOString(),
                reviewNotes: notes,
              }
            : f
        );
        app.aiFindings = findings;
      }
    }

    const updatedApp = await db.applications.update({
      where: { id },
      data: {
        stage: newStage,
        timeline,
        aiFindings: app.aiFindings,
        updatedAt: new Date().toISOString(),
      },
    });

    await db.auditLogs.create({
      data: {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'System/User',
        actorRole: 'OFFICER',
        action: `WORKFLOW_${action}`,
        resource: 'Application',
        resourceId: id,
        reason: `Executed workflow action ${action} on application ${id}`,
        ipAddress: '127.0.0.1',
        requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    });

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Workflow execution failed' }, { status: 400 });
  }
}

