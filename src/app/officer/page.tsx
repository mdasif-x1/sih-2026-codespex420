'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { pragatiStore } from '@/lib/data/storeService';
import { Application } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Search, AlertCircle, Award, ArrowRight } from 'lucide-react';

export default function OfficerDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [filterScheme, setFilterScheme] = useState<string>('ALL');

  useEffect(() => {
    setApplications(pragatiStore.getApplications());
    const unsub = pragatiStore.subscribe(() => {
      setApplications(pragatiStore.getApplications());
    });
    return () => unsub();
  }, []);

  const queue = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.instituteName.toLowerCase().includes(search.toLowerCase());

    const matchesScheme = filterScheme === 'ALL' || app.schemeCode === filterScheme;
    return matchesSearch && matchesScheme;
  });

  const aiFlaggedCount = applications.filter((a) => a.aiFindings.some((f) => f.status === 'PENDING_REVIEW')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DFDC] pb-3">
        <div>
          <h1 className="page-header-title">Officer Verification Workstation</h1>
          <p className="page-header-subtitle">
            Ministry evidence verification workstation & deterministic scheme rules evaluation.
          </p>
        </div>

        <Link
          href="/officer/selection"
          className="btn-secondary text-xs space-x-1.5 self-start sm:self-auto"
        >
          <Award className="w-4 h-4 text-[#075E54]" />
          <span>Open Selection & Merit Board</span>
        </Link>
      </div>

      {/* Operational Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Pending Officer Review</span>
          <span className="font-serif font-bold text-xl text-[#17201F]">
            {applications.filter((a) => a.stage === 'OFFICER_REVIEW').length}
          </span>
        </div>
        <div className="institutional-card p-4 space-y-1 bg-[#FFFBEB] border-[#FDE68A]">
          <span className="text-[10px] font-semibold text-[#B45309] uppercase block">AI Variances Flagged</span>
          <span className="font-serif font-bold text-xl text-[#92400E]">{aiFlaggedCount}</span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Ready for Selection</span>
          <span className="font-serif font-bold text-xl text-[#075E54]">
            {applications.filter((a) => a.stage === 'SELECTION').length}
          </span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Approved / Disbursed</span>
          <span className="font-serif font-bold text-xl text-[#17201F]">
            {applications.filter((a) => a.stage === 'DISBURSEMENT_PENDING' || a.stage === 'DISBURSED').length}
          </span>
        </div>
      </div>

      {/* Operational Filter Toolbar */}
      <div className="institutional-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 text-[#838E8A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by application number, applicant name, or institute..."
            className="w-full text-xs text-[#17201F] focus:outline-none placeholder-[#838E8A]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-[#5E6865] font-semibold text-[11px]">Filter Scheme:</span>
          <select
            value={filterScheme}
            onChange={(e) => setFilterScheme(e.target.value)}
            className="p-1.5 border border-[#D9DFDC] rounded bg-white text-[#17201F] font-medium text-xs"
          >
            <option value="ALL">All Schemes</option>
            <option value="NFST">NFST Fellowship</option>
            <option value="NOS">NOS Overseas</option>
            <option value="TOPCLASS">Top Class Education</option>
          </select>
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="institutional-section overflow-hidden">
        <div className="bg-[#F3F4F1] px-5 py-3 border-b border-[#D9DFDC] flex items-center justify-between">
          <h3 className="font-semibold text-xs text-[#17201F] uppercase tracking-wider">Officer Verification Queue</h3>
          <span className="text-xs font-mono text-[#5E6865]">Total Records: {queue.length}</span>
        </div>

        <table className="institutional-table">
          <thead>
            <tr>
              <th>App No</th>
              <th>Applicant Name</th>
              <th>Scheme</th>
              <th>AI Variances</th>
              <th>Stage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((app) => {
              const pendingFinding = app.aiFindings.find((f) => f.status === 'PENDING_REVIEW');
              return (
                <tr key={app.id}>
                  <td className="font-mono font-bold text-[#17201F]">{app.id}</td>
                  <td>
                    <span className="font-semibold text-[#17201F]">{app.applicantName}</span>
                    <span className="block text-[#5E6865] text-[11px]">{app.instituteName}</span>
                  </td>
                  <td>
                    <span className="bg-[#F3F4F1] text-[#17201F] px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                      {app.schemeCode}
                    </span>
                  </td>
                  <td>
                    {pendingFinding ? (
                      <span className="bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 text-[#B45309]" />
                        <span>{pendingFinding.confidence}% {pendingFinding.type}</span>
                      </span>
                    ) : (
                      <span className="text-[#838E8A] text-xs">No Flags</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={app.stage} size="sm" />
                  </td>
                  <td>
                    <Link
                      href={`/officer/applications/${app.id}`}
                      className="btn-primary text-xs py-1 px-3 space-x-1"
                    >
                      <span>Review Evidence</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

