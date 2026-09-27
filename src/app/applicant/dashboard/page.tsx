'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { pragatiStore } from '@/lib/data/storeService';
import { Application } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { WorkflowTimeline } from '@/components/ui/WorkflowTimeline';
import { AlertTriangle, ArrowRight, FilePlus } from 'lucide-react';

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications(pragatiStore.getApplications());
    const unsub = pragatiStore.subscribe(() => {
      setApplications(pragatiStore.getApplications());
    });
    return () => unsub();
  }, []);

  const activeApp = applications.find((a) => a.applicantId === 'usr_app_aarav') || applications[0];
  const hasDeficiency = activeApp?.stage === 'DEFICIENCY' || activeApp?.deficiency?.status === 'ACTION_REQUIRED';

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Primary Action Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DFDC] pb-4">
        <div>
          <h1 className="page-header-title">Good morning, Aarav Kumar</h1>
          <p className="page-header-subtitle">
            Track your active scholarship status, resubmit requested evidence, and view verification progress.
          </p>
        </div>

        {hasDeficiency && (
          <span className="bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] text-xs px-3.5 py-1.5 rounded font-semibold flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-[#B45309]" />
            <span>Action Required on Application</span>
          </span>
        )}
      </div>

      {/* 2. Action Required Alert Box */}
      {hasDeficiency && activeApp?.deficiency && (
        <div className="border border-[#F59E0B] bg-[#FFFBEB] rounded p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#78350F] text-sm">Deficiency Notice: {activeApp.deficiency.documentType}</h3>
              <p className="text-xs text-[#92400E] mt-0.5">
                Resubmission Deadline: <span className="font-mono font-bold">{activeApp.deficiency.deadline}</span>
              </p>
            </div>
            <Link
              href={`/applicant/applications/${activeApp.id}`}
              className="btn-destructive text-xs py-2 px-4 inline-flex items-center space-x-1"
            >
              <span>Resubmit Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#FDE68A] rounded p-3 text-xs text-[#17201F] space-y-1">
            <p><strong>Requirement: </strong>{activeApp.deficiency.problemDescription}</p>
            <p><strong>Required Action: </strong>{activeApp.deficiency.requiredAction}</p>
          </div>
        </div>
      )}

      {/* 3. Primary Application Workspace & Lifecycle */}
      {activeApp && (
        <div className="institutional-section p-5 space-y-5">
          {/* Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBEFEF] pb-4">
            <div>
              <span className="text-[11px] font-mono text-[#5E6865] uppercase tracking-wider block">Active Application</span>
              <h2 className="font-serif font-bold text-lg text-[#17201F] mt-0.5">{activeApp.schemeName}</h2>
              <p className="text-xs text-[#5E6865] font-mono mt-0.5">Application No: {activeApp.id} • {activeApp.instituteName}</p>
            </div>
            <div className="flex items-center space-x-3">
              <StatusBadge status={activeApp.stage} size="md" />
              <Link
                href={`/applicant/applications/${activeApp.id}`}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                <span>View Full Record</span>
              </Link>
            </div>
          </div>

          {/* Integrated Workflow Lifecycle Timeline */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#17201F] uppercase tracking-wider block">Verification Progress</span>
            <WorkflowTimeline currentStage={activeApp.stage} timeline={activeApp.timeline} />
          </div>
        </div>
      )}

      {/* 4. Submitted Applications Table */}
      <div className="institutional-section overflow-hidden">
        <div className="bg-[#F3F4F1] px-5 py-3 border-b border-[#D9DFDC] flex items-center justify-between">
          <h3 className="font-semibold text-xs text-[#17201F] uppercase tracking-wider">Submitted Applications History</h3>
          <Link href="/schemes" className="text-xs font-semibold text-[#075E54] hover:underline flex items-center space-x-1">
            <FilePlus className="w-3.5 h-3.5" />
            <span>Apply to New Scheme</span>
          </Link>
        </div>

        <table className="institutional-table">
          <thead>
            <tr>
              <th>Application No</th>
              <th>Scheme</th>
              <th>Stage</th>
              <th>Submitted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="font-mono font-bold text-[#17201F]">{app.id}</td>
                <td>
                  <span className="font-semibold text-[#17201F]">{app.schemeCode}</span>
                  <span className="block text-[#5E6865] text-[11px]">{app.schemeName}</span>
                </td>
                <td>
                  <StatusBadge status={app.stage} size="sm" />
                </td>
                <td className="text-[#5E6865] text-xs font-mono">
                  {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
                </td>
                <td>
                  <Link
                    href={`/applicant/applications/${app.id}`}
                    className="text-xs font-semibold text-[#075E54] hover:underline"
                  >
                    View Details &rarr;
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

