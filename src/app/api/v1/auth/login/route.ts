import { NextRequest, NextResponse } from 'next/server';
import { signToken, AuthSession } from '@/lib/server/auth';
import { db } from '@/lib/server/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Lookup user in database
    const user = await db.users.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      // Reject unknown users (no auto-role generation from request payload)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify bcrypt password hash
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Role comes STRICTLY from persisted database record
    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      institution: user.institution || undefined,
      department: user.department || undefined,
    };

    const token = signToken(session);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        institution: session.institution,
        department: session.department,
      },
    });

    response.cookies.set('pragati_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
