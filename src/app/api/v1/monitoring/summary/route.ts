import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { AnalyticsSummary } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const apps = await db.applications.findMany();

    const pendingInstitute = apps.filter((a) => a.stage === 'SUBMITTED' || a.stage === 'INSTITUTE_VERIFICATION').length;
    const pendingOfficer = apps.filter((a) => a.stage === 'OFFICER_REVIEW').length;
    const aiFlagged = apps.filter((a) => a.aiFindings.some((f) => f.status === 'PENDING_REVIEW')).length;
    const deficiencies = apps.filter((a) => a.stage === 'DEFICIENCY').length;
    const selected = apps.filter((a) => a.stage === 'SELECTED' || a.stage === 'DISBURSED').length;

    const summary: AnalyticsSummary = {
      totalApplications: apps.length,
      pendingInstituteVerification: pendingInstitute,
      pendingOfficerReview: pendingOfficer,
      aiFlaggedCount: aiFlagged,
      deficiencyCount: deficiencies,
      selectedCount: selected,
      totalDisbursedAmountCr: 14.85,
      averageProcessingTimeDays: 4.2,
      stageFunnel: [
        { stage: 'Submitted', count: apps.length },
        { stage: 'Institute Verified', count: apps.length - pendingInstitute },
        { stage: 'Officer Approved', count: apps.length - pendingInstitute - pendingOfficer },
        { stage: 'Selected', count: selected },
        { stage: 'Disbursed', count: apps.filter((a) => a.stage === 'DISBURSED').length },
      ],
      deficiencyCategories: [
        { category: 'Income Certificate Variance', count: 142 },
        { category: 'Aadhaar Name Mismatch', count: 86 },
        { category: 'Academic Percentage Discrepancy', count: 54 },
        { category: 'Illegible ST Certificate Scan', count: 39 },
      ],
      instituteThroughput: [
        { institute: 'IIT Kharagpur', verified: 342, pending: 18 },
        { institute: 'NIT Rourkela', verified: 289, pending: 24 },
        { institute: 'Delhi University', verified: 412, pending: 31 },
        { institute: 'BHU Varanasi', verified: 198, pending: 12 },
      ],
    };

    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch analytics summary' }, { status: 500 });
  }
}

