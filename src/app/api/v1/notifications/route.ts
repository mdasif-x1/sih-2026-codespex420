import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/auth';
import { db } from '@/lib/server/db';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apps = await db.applications.findMany();

  // Extract application notifications relevant to current user
  const userApps = apps.filter((a) => a.applicantEmail.toLowerCase() === session.email.toLowerCase());

  const notifications = userApps.flatMap((app) => {
    const items = [];
    if (app.stage === 'DEFICIENCY' && app.deficiency) {
      items.push({
        id: `notif_${app.id}_def`,
        title: 'Action Required: Deficiency Tagged',
        message: app.deficiency.problemDescription,
        type: 'WARNING',
        timestamp: app.deficiency.createdAt,
        link: `/applicant/applications/${app.id}`,
      });
    }
    if (app.stage === 'SELECTED') {
      items.push({
        id: `notif_${app.id}_sel`,
        title: 'Congratulations! Selected for Scholarship',
        message: `Your application ${app.id} has been selected under ${app.schemeName}`,
        type: 'SUCCESS',
        timestamp: app.updatedAt,
        link: `/applicant/applications/${app.id}`,
      });
    }
    return items;
  });

  return NextResponse.json({ success: true, count: notifications.length, notifications });
}
