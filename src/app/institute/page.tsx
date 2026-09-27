'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { pragatiStore } from '@/lib/data/storeService';
import { Application } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Building2, Search, CheckCircle2, AlertTriangle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InstituteDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setApplications(pragatiStore.getApplications());
    const unsub = pragatiStore.subscribe(() => {
      setApplications(pragatiStore.getApplications());
    });
    return () => unsub();
  }, []);

  const queue = applications.filter((a) =>
    a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase()) ||
    a.courseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-teal-800" />
            <h1 className="font-serif text-2xl font-bold text-slate-900">Institute Verification Queue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            IIT Kharagpur Nodal Desk • Bonafide Student Enrollment & Academic Status Verification
          </p>
        </div>
      </div>

      {/* Restrained Metric Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Pending Queue</span>
          <span className="font-serif font-bold text-xl text-slate-900">
            {applications.filter((a) => a.stage === 'INSTITUTE_VERIFICATION' || a.stage === 'SUBMITTED' || a.stage === 'DOCUMENT_CHECK').length}
          </span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Verified & Forwarded</span>
          <span className="font-serif font-bold text-xl text-emerald-800">
            {applications.filter((a) => a.stage === 'OFFICER_REVIEW' || a.stage === 'SELECTION' || a.stage === 'DISBURSED').length}
          </span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Action Required</span>
          <span className="font-serif font-bold text-xl text-amber-800">
            {applications.filter((a) => a.stage === 'DEFICIENCY').length}
          </span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Enrolled ST</span>
          <span className="font-serif font-bold text-xl text-slate-800">{applications.length}</span>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="institutional-card p-4 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by student name, application number, or course..."
          className="w-full text-xs text-slate-900 focus:outline-none"
        />
      </div>

      {/* Operational Queue Table */}
      <div className="institutional-card overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">Student Verification Records</h3>
          <span className="text-xs text-slate-500 font-mono">Total Records: {queue.length}</span>
        </div>

        <table className="institutional-table">
          <thead>
            <tr>
              <th>App ID</th>
              <th>Student Name</th>
              <th>Scheme</th>
              <th>Course / Year</th>
              <th>Stage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((app) => (
              <tr key={app.id}>
                <td className="font-mono font-bold text-slate-900">{app.id}</td>
                <td>
                  <span className="font-semibold text-slate-900">{app.applicantName}</span>
                  <span className="block text-[11px] text-slate-500 font-mono">{app.stCertificateNo}</span>
                </td>
                <td>
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold text-[11px]">
                    {app.schemeCode}
                  </span>
                </td>
                <td className="text-xs text-slate-700">
                  {app.courseName} ({app.academicYear})
                </td>
                <td>
                  <StatusBadge status={app.stage} size="sm" />
                </td>
                <td>
                  <Link
                    href={`/institute/applications/${app.id}`}
                    className="inline-flex items-center space-x-1 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-2xs"
                  >
                    <span>Verify Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
