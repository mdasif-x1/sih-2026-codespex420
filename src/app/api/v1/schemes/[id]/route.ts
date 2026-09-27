import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { enforceRole } from '@/lib/server/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scheme = await db.schemes.findUnique({ where: { id } });

  if (!scheme) {
    return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, scheme });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = enforceRole(req, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const body = await req.json();
    const existing = await db.schemes.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    const updated = await db.schemes.update({
      where: { id },
      data: { ...body },
    });

    await db.auditLogs.create({
      data: {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${auth.session.name} (${auth.session.email})`,
        actorRole: auth.session.role,
        action: 'UPDATE_SCHEME',
        resource: 'Scheme',
        resourceId: id,
        reason: `Updated scheme configuration for ${updated.code}`,
        ipAddress: '127.0.0.1',
        requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    });

    return NextResponse.json({ success: true, scheme: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update scheme' }, { status: 400 });
  }
}

