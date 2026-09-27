'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { UserRole } from '@/types';
import { ShieldCheck, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('APPLICANT');
  const [email, setEmail] = useState('aarav.st.scholar@gmail.com');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    pragatiStore.setCurrentRole(role);

    switch (role) {
      case 'APPLICANT':
        router.push('/applicant/dashboard');
        break;
      case 'INSTITUTE':
        router.push('/institute');
        break;
      case 'OFFICER':
        router.push('/officer');
        break;
      case 'MONITORING':
        router.push('/monitoring');
        break;
      case 'ADMIN':
        router.push('/admin/schemes');
        break;
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-lg bg-teal-900 text-white font-serif font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
          P
        </div>
        <h1 className="font-serif font-bold text-2xl text-slate-900">Sign In to PRAGATI</h1>
        <p className="text-xs text-slate-500">
          Ministry of Tribal Affairs Single Sign-On Portal (Aadhaar / Institutional Login)
        </p>
      </div>

      <div className="institutional-card p-6 space-y-5">
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Persona / Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 font-medium"
            >
              <option value="APPLICANT">Applicant (Student)</option>
              <option value="INSTITUTE">Institute Nodal Officer</option>
              <option value="OFFICER">Ministry Review Officer</option>
              <option value="MONITORING">Directorate Analytics / Monitoring</option>
              <option value="ADMIN">Scheme Administrator / Joint Secretary</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Email / Username</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value="••••••••••••"
              readOnly
              className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-900 bg-slate-50"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2.5 px-4 rounded shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Portal</span>
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          New applicant?{' '}
          <Link href="/register" className="text-teal-800 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
