'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { Application } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, Building2, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

export default function InstituteVerifyWorkstation() {
  const params = useParams();
  const router = useRouter();
  const appId = params?.id as string;

  const [app, setApp] = useState<Application | undefined>(undefined);
  const [deficiencyReason, setDeficiencyReason] = useState('');
  const [showDeficiencyInput, setShowDeficiencyInput] = useState(false);

  useEffect(() => {
    setApp(pragatiStore.getApplicationById(appId));
    const unsub = pragatiStore.subscribe(() => {
      setApp(pragatiStore.getApplicationById(appId));
    });
    return () => unsub();
  }, [appId]);

  if (!app) {
    return (
      <div className="institutional-card p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Record Not Found</h2>
        <Link href="/institute" className="text-xs text-teal-800 underline">Return to Queue</Link>
      </div>
    );
  }

  const handleInstituteVerify = () => {
    const updatedApp: Application = {
      ...app,
      stage: 'OFFICER_REVIEW',
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: new Date().toISOString(),
          stage: 'OFFICER_REVIEW',
          actor: 'Dr. S. P. Hansda (Institute Nodal Officer)',
          actorRole: 'INSTITUTE',
          title: 'Verified & Forwarded by Institute',
          description: 'Institute confirmed bonafide enrollment, attendance, and fee structure.',
        },
        ...app.timeline,
      ],
    };

    pragatiStore.updateApplication(
      updatedApp,
      'INSTITUTE_VERIFY',
      `Institute verified bonafide student status for ${app.applicantName}`
    );
    router.push('/institute');
  };

  const handleRaiseDeficiency = () => {
    if (!deficiencyReason) return;
    const updatedApp: Application = {
      ...app,
      stage: 'DEFICIENCY',
      deficiency: {
        id: `def_inst_${Date.now()}`,
        applicationId: app.id,
        documentType: 'INCOME_CERTIFICATE',
        issueType: 'INSTITUTE_DOCUMENT_FLAG',
        problemDescription: deficiencyReason,
        requiredAction: 'Upload clear official revenue copy.',
        deadline: '2026-10-15',
        status: 'ACTION_REQUIRED',
        createdAt: new Date().toISOString(),
        history: [
          {
            id: `dh_${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: 'Dr. S. P. Hansda (Institute Nodal Officer)',
            action: 'RAISED',
            comment: deficiencyReason,
          },
        ],
      },
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: new Date().toISOString(),
          stage: 'DEFICIENCY',
          actor: 'Dr. S. P. Hansda',
          actorRole: 'INSTITUTE',
          title: 'Deficiency Raised by Institute',
          description: deficiencyReason,
        },
        ...app.timeline,
      ],
    };

    pragatiStore.updateApplication(
      updatedApp,
      'DEFICIENCY_CREATE',
      `Institute raised deficiency: ${deficiencyReason}`
    );
    router.push('/institute');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <Link href="/institute" className="inline-flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Verification Queue</span>
      </Link>

      {/* Header Banner */}
      <div className="institutional-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-slate-900 text-base">{app.id}</span>
              <StatusBadge status={app.stage} />
            </div>
            <h1 className="font-serif font-bold text-xl text-slate-900 mt-1">{app.applicantName}</h1>
            <p className="text-xs text-slate-500">
              Institute: <span className="font-semibold text-slate-800">{app.instituteName}</span> • ST Certificate: {app.stCertificateNo}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDeficiencyInput(!showDeficiencyInput)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold px-3.5 py-2 rounded border border-amber-300"
            >
              Raise Deficiency
            </button>
            <button
              onClick={handleInstituteVerify}
              className="bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-2 rounded shadow-xs flex items-center space-x-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Forward to Officer</span>
            </button>
          </div>
        </div>

        {/* Deficiency Input Box */}
        {showDeficiencyInput && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded space-y-3 text-xs">
            <h4 className="font-bold text-amber-900">Specify Deficiency Reason</h4>
            <textarea
              value={deficiencyReason}
              onChange={(e) => setDeficiencyReason(e.target.value)}
              placeholder="e.g. Scanned Income Certificate is illegible. Please upload a clear revenue copy."
              className="w-full p-2.5 border border-amber-300 rounded bg-white text-slate-900"
              rows={3}
            />
            <button
              onClick={handleRaiseDeficiency}
              className="bg-amber-800 text-white font-semibold px-3.5 py-1.5 rounded"
            >
              Confirm & Return to Student
            </button>
          </div>
        )}

        {/* Applicant Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Course</span>
            <p className="font-medium text-slate-900 mt-0.5">{app.courseName}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Qualifying Percentage</span>
            <p className="font-mono font-bold text-slate-900 mt-0.5">{app.marksPercentage}%</p>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Annual Family Income</span>
            <p className="font-mono font-bold text-slate-900 mt-0.5">₹ {app.annualFamilyIncome.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
