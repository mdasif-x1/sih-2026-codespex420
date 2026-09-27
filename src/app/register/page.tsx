'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('Aarav Kumar');
  const [email, setEmail] = useState('aarav.st.scholar@gmail.com');
  const [stCert, setStCert] = useState('ST/JH/2024/90821');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    pragatiStore.setCurrentRole('APPLICANT');
    router.push('/applicant/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif font-bold text-2xl text-slate-900">Applicant Registration</h1>
        <p className="text-xs text-slate-500">
          Create an applicant profile for Ministry of Tribal Affairs ST Scholarships
        </p>
      </div>

      <div className="institutional-card p-6 space-y-5">
        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name (as per ST Certificate)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">ST Caste Certificate Number</label>
            <input
              type="text"
              value={stCert}
              onChange={(e) => setStCert(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded font-mono font-medium text-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2.5 px-4 rounded shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Applicant Profile</span>
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-teal-800 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
