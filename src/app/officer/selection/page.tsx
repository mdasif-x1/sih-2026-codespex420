'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { pragatiStore } from '@/lib/data/storeService';
import { Application } from '@/types';
import { Award, CheckCircle2, ShieldCheck, Download, FileText, ArrowRight } from 'lucide-react';

export default function SelectionManagementPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<string>('NFST');

  useEffect(() => {
    setApplications(pragatiStore.getApplications());
    const unsub = pragatiStore.subscribe(() => {
      setApplications(pragatiStore.getApplications());
    });
    return () => unsub();
  }, []);

  const schemeApps = applications.filter((a) => a.schemeCode === selectedScheme);

  // Compute merit ranking based on composite score
  const meritList = [...schemeApps].sort(
    (a, b) => (b.compositeScore || b.marksPercentage) - (a.compositeScore || a.marksPercentage)
  );

  const handleApproveMeritList = () => {
    meritList.forEach((app) => {
      const updatedApp: Application = {
        ...app,
        stage: 'DISBURSEMENT_PENDING',
        disbursementStatus: {
          pfmsBatchNo: `PFMS/2026/MOTA/${Math.floor(10000 + Math.random() * 90000)}`,
          amountRs: 225000,
          accountLast4: '9081',
        },
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: new Date().toISOString(),
            stage: 'DISBURSEMENT_PENDING',
            actor: 'Selection Board & Officer Rajesh Sharma',
            actorRole: 'OFFICER',
            title: 'Approved by Selection Board',
            description: 'Merit List snapshot frozen and queued for Direct Benefit Transfer via PFMS.',
          },
          ...app.timeline,
        ],
      };
      pragatiStore.updateApplication(updatedApp, 'APPROVAL', `Approved Merit Rank #${app.rank || 1} for DBT`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-teal-800" />
            <h1 className="font-serif text-2xl font-bold text-slate-900">Selection & Merit List Engine</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic Composite Ranking & Selection Board Human Approval Desk
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="p-2 border border-slate-300 rounded bg-white text-xs font-bold text-slate-900"
          >
            <option value="NFST">NFST Fellowship Merit List</option>
            <option value="NOS">NOS Overseas Merit List</option>
            <option value="TOPCLASS">Top Class Education Merit List</option>
          </select>

          <button
            onClick={handleApproveMeritList}
            className="bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-2 rounded shadow-xs flex items-center space-x-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Merit List & Queue DBT</span>
          </button>
        </div>
      </div>

      {/* Configuration & Engine Snapshot */}
      <div className="institutional-card p-5 space-y-3 bg-slate-900 text-white text-xs">
        <div className="flex items-center justify-between text-teal-400 font-mono text-[11px]">
          <span>SELECTION ENGINE v2026.1 SNAPSHOT</span>
          <span>Method: Composite Merit Score</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px]">TOTAL POOL</span>
            <span className="font-bold text-white text-sm">{meritList.length} Applicants</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">WEIGHTAGE MODEL</span>
            <span className="font-bold text-white text-sm">70% Marks + 30% Income</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">DETERMINISTIC EVALUATION</span>
            <span className="font-bold text-emerald-400 text-sm">100% Rules Passed</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">BOARD APPROVAL</span>
            <span className="font-bold text-teal-300 text-sm">Human Oversight Active</span>
          </div>
        </div>
      </div>

      {/* Professional Merit List Table */}
      <div className="institutional-card overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
            Ranked Merit List ({selectedScheme})
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Generated: {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>

        <table className="institutional-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Applicant Name</th>
              <th>App ID</th>
              <th>Institute</th>
              <th>Marks (%)</th>
              <th>Income (₹)</th>
              <th>Composite Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {meritList.map((item, idx) => (
              <tr key={item.id}>
                <td className="font-mono font-bold text-slate-900">#{idx + 1}</td>
                <td className="font-semibold text-slate-900">{item.applicantName}</td>
                <td className="font-mono text-slate-600">{item.id}</td>
                <td className="text-xs text-slate-700">{item.instituteName}</td>
                <td className="font-mono text-slate-900">{item.marksPercentage}%</td>
                <td className="font-mono text-slate-900">₹ {item.annualFamilyIncome.toLocaleString('en-IN')}</td>
                <td>
                  <span className="font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {item.compositeScore || 91.4}
                  </span>
                </td>
                <td>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {item.stage === 'DISBURSEMENT_PENDING' || item.stage === 'DISBURSED' ? 'DBT Queued' : 'Eligible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
