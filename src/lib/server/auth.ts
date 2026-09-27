import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'pragati_production_secret_key_2026_change_in_prod';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  department?: string;
}

export function signToken(session: AuthSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSession;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getSessionFromRequest(req: NextRequest): AuthSession | null {
  // Check Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = verifyToken(token);
    if (session) return session;
  }

  // Check Cookie
  const cookieToken = req.cookies.get('pragati_token')?.value;
  if (cookieToken) {
    const session = verifyToken(cookieToken);
    if (session) return session;
  }

  // Fallback for development header mapped to seeded database user
  const devRole = req.headers.get('x-pragati-role') as UserRole;
  if (devRole) {
    switch (devRole) {
      case 'APPLICANT':
        return {
          userId: 'usr_app_aarav',
          email: 'aarav.st.scholar@gmail.com',
          name: 'Aarav Kumar',
          role: 'APPLICANT',
        };
      case 'INSTITUTE':
        return {
          userId: 'usr_inst_iitkgp',
          email: 'nodal.scholarship@iitkgp.ac.in',
          name: 'Dr. S. P. Hansda',
          role: 'INSTITUTE',
          institution: 'IIT Kharagpur',
        };
      case 'OFFICER':
        return {
          userId: 'usr_off_rajesh',
          email: 'officer.review@tribal.gov.in',
          name: 'Dr. Rajesh Sharma',
          role: 'OFFICER',
          department: 'Ministry of Tribal Affairs',
        };
      case 'MONITORING':
        return {
          userId: 'usr_mon_dir',
          email: 'monitoring.dir@tribal.gov.in',
          name: 'Sunil M. Oraon',
          role: 'MONITORING',
        };
      case 'ADMIN':
        return {
          userId: 'usr_admin_js',
          email: 'js.scholarship@tribal.gov.in',
          name: 'Dr. V. K. Meena',
          role: 'ADMIN',
        };
    }
  }

  return null;
}

export function enforceRole(req: NextRequest, allowedRoles: UserRole[]): { session: AuthSession } | NextResponse {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }

  if (!allowedRoles.includes(session.role)) {
    return NextResponse.json(
      { error: `Forbidden: Role ${session.role} is not authorized for this operation` },
      { status: 403 }
    );
  }

  return { session };
}
