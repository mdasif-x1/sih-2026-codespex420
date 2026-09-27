import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { enforceRole } from '@/lib/server/auth';
import { Scheme } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const schemes = await db.schemes.findMany();
    return NextResponse.json({ success: true, count: schemes.length, schemes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = enforceRole(req, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const newScheme = body as Scheme;

    const created = await db.schemes.create({ data: newScheme });

    await db.auditLogs.create({
      data: {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${auth.session.name} (${auth.session.email})`,
        actorRole: auth.session.role,
        action: 'CREATE_SCHEME',
        resource: 'Scheme',
        resourceId: created.id,
        reason: `Admin created scheme ${created.code} - ${created.name}`,
        ipAddress: '127.0.0.1',
        requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    });

    return NextResponse.json({ success: true, scheme: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create scheme' }, { status: 400 });
  }
}

