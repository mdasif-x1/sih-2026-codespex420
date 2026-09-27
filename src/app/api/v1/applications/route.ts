import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { getSessionFromRequest } from '@/lib/server/auth';
import { BackendDomainService } from '@/lib/server/domainService';
import { Application } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const role = session?.role || 'APPLICANT';
    const applications = await db.applications.findMany();

    let filtered = applications;

    // RBAC Queue Filtering:
    if (role === 'APPLICANT') {
      // Applicant only sees own applications
      const email = session?.email || 'aarav.st.scholar@gmail.com';
      filtered = applications.filter((a) => a.applicantEmail.toLowerCase() === email.toLowerCase() || a.applicantId === session?.userId);
    } else if (role === 'INSTITUTE') {
      // Institute node officer sees applications assigned to their institute
      filtered = applications.filter(
        (a) => a.stage === 'SUBMITTED' || a.stage === 'INSTITUTE_VERIFICATION' || a.stage === 'DEFICIENCY'
      );
    } else if (role === 'OFFICER') {
      // Government officer sees verified applications in review/selection queue
      filtered = applications.filter(
        (a) =>
          a.stage === 'INSTITUTE_VERIFICATION' ||
          a.stage === 'OFFICER_REVIEW' ||
          a.stage === 'SELECTION' ||
          a.stage === 'DEFICIENCY'
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      applications: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const body = await req.json();

    const marks = body.marksPercentage || 75;
    const income = body.annualFamilyIncome || 240000;
    const compositeScore = BackendDomainService.calculateCompositeMeritScore(marks, income);
    const rules = BackendDomainService.evaluateRules({
      stCertificateNo: body.stCertificateNo || 'ST-2024-88912',
      marksPercentage: marks,
      annualFamilyIncome: income,
      instituteCode: body.instituteCode || 'AISHE-S-1102',
    });

    const newAppId = body.id || `PRG-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp: Application = {
      id: newAppId,
      schemeId: body.schemeId || 'sch_nfst_01',
      schemeCode: body.schemeCode || 'NFST',
      schemeName: body.schemeName || 'National Fellowship for ST Students',
      schemeVersionId: body.schemeVersionId || 'ver_nfst_2026_1',
      applicantId: session?.userId || 'usr_app_aarav',
      applicantName: body.applicantName || session?.name || 'Aarav Kumar',
      applicantEmail: body.applicantEmail || session?.email || 'aarav.st.scholar@gmail.com',
      applicantPhone: body.applicantPhone || '+91 98765 43210',
      stCertificateNo: body.stCertificateNo || 'ST-2024-88912',
      instituteName: body.instituteName || 'IIT Kharagpur',
      instituteCode: body.instituteCode || 'AISHE-S-1102',
      courseName: body.courseName || 'Ph.D. Computer Science & Engineering',
      academicYear: body.academicYear || '2026-2027',
      marksPercentage: marks,
      annualFamilyIncome: income,
      stage: 'SUBMITTED',
      dynamicData: body.dynamicData || {},
      documents: body.documents || [],
      aiFindings: body.aiFindings || [],
      ruleEvaluations: rules,
      compositeScore,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: new Date().toISOString(),
          stage: 'SUBMITTED',
          actor: session?.name || 'Aarav Kumar',
          actorRole: 'APPLICANT',
          title: 'Application Submitted',
          description: 'Application successfully created and submitted for verification',
        },
      ],
    };

    const createdApp = await db.applications.create({ data: newApp });

    await db.auditLogs.create({
      data: {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: session?.name ? `${session.name} (${session.email})` : 'Aarav Kumar (aarav.st.scholar@gmail.com)',
        actorRole: session?.role || 'APPLICANT',
        action: 'CREATE_APPLICATION',
        resource: 'Application',
        resourceId: createdApp.id,
        reason: `Created application ${createdApp.id}`,
        ipAddress: '127.0.0.1',
        requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    });

    return NextResponse.json({ success: true, application: createdApp }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit application' }, { status: 400 });
  }
}

