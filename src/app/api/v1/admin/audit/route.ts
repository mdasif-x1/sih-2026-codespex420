import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { enforceRole } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  const auth = enforceRole(req, ['ADMIN', 'MONITORING', 'OFFICER']);
  if (auth instanceof NextResponse) return auth;

  try {
    const logs = await db.auditLogs.findMany();
    return NextResponse.json({ success: true, count: logs.length, auditLogs: logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
}

