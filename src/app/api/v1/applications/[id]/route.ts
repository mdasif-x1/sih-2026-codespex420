import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { getSessionFromRequest } from '@/lib/server/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }

  const { id } = await params;
  const app = await db.applications.findUnique({ where: { id } });

  if (!app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  // Ownership & Role-Based Access Control
  if (session.role === 'APPLICANT') {
    if (app.applicantEmail.toLowerCase() !== session.email.toLowerCase() && app.applicantId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this application' }, { status: 403 });
    }
  } else if (session.role === 'INSTITUTE') {
    if (session.institution && !app.instituteName.toLowerCase().includes(session.institution.toLowerCase())) {
      return NextResponse.json(
        { error: 'Forbidden: Application is assigned to a different institution' },
        { status: 403 }
      );
    }
  }

  return NextResponse.json({ success: true, application: app });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }

  const { id } = await params;
  const app = await db.applications.findUnique({ where: { id } });

  if (!app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  // Ownership & Mutation Permission Checks
  if (session.role === 'APPLICANT') {
    if (app.applicantEmail.toLowerCase() !== session.email.toLowerCase() && app.applicantId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this application' }, { status: 403 });
    }
    // Applicants can only modify applications in DRAFT or DEFICIENCY status
    if (app.stage !== 'DRAFT' && app.stage !== 'DEFICIENCY') {
      return NextResponse.json(
        { error: `Forbidden: Application in stage ${app.stage} cannot be modified by applicant` },
        { status: 403 }
      );
    }
  }

  try {
    const body = await req.json();
    const updatedApp = await db.applications.update({
      where: { id },
      data: { ...body, updatedAt: new Date().toISOString() },
    });

    await db.auditLogs.create({
      data: {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${session.name} (${session.email})`,
        actorRole: session.role,
        action: 'UPDATE_APPLICATION',
        resource: 'Application',
        resourceId: id,
        reason: `Updated application details for ${id}`,
        ipAddress: '127.0.0.1',
        requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    });

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update application' }, { status: 400 });
  }
}
