import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { BackendDomainService } from '@/lib/server/domainService';
import { MeritListItem } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const schemeCode = searchParams.get('schemeCode') || 'NFST';

    const allApps = await db.applications.findMany();
    const applications = allApps.filter(
      (a) => (a.schemeCode === schemeCode || !schemeCode) && (a.stage === 'SELECTION' || a.stage === 'OFFICER_REVIEW' || a.stage === 'SELECTED')
    );

    // Calculate dynamic merit score and sort descending
    const meritItems: MeritListItem[] = applications.map((app) => {
      const compositeScore =
        app.compositeScore || BackendDomainService.calculateCompositeMeritScore(app.marksPercentage, app.annualFamilyIncome);

      return {
        rank: 0, // Assigned after sorting
        applicationId: app.id,
        applicantName: app.applicantName,
        schemeCode: app.schemeCode,
        instituteName: app.instituteName,
        compositeScore,
        marksPercentage: app.marksPercentage,
        annualIncome: app.annualFamilyIncome,
        stCategoryDetails: `Cert #${app.stCertificateNo}`,
        verificationStatus: 'VERIFIED',
        approvalStatus: app.stage === 'SELECTED' ? 'APPROVED' : 'ELIGIBLE',
      };
    });

    meritItems.sort((a, b) => b.compositeScore - a.compositeScore);
    meritItems.forEach((item, index) => {
      item.rank = index + 1;
    });

    return NextResponse.json({
      success: true,
      schemeCode,
      totalCandidates: meritItems.length,
      meritList: meritItems,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate merit list' }, { status: 500 });
  }
}

