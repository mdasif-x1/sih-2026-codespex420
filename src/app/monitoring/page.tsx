'use client';

import React from 'react';
import { MOCK_ANALYTICS } from '@/lib/data/mockStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#075E54', '#5E6865', '#B58A3A', '#A33A3A', '#434D4A'];

export default function MonitoringDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DFDC] pb-3">
        <div>
          <h1 className="page-header-title">Ministry Monitoring & Analytics</h1>
          <p className="page-header-subtitle">
            Operational processing funnel, verification throughput & deficiency root-cause distribution.
          </p>
        </div>

        <span className="text-xs font-mono bg-[#F3F4F1] text-[#17201F] px-2.5 py-1 rounded border border-[#D9DFDC]">
          FY 2026-27 Active Cycle
        </span>
      </div>

      {/* Top Level Metric Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Total Received</span>
          <span className="font-serif font-bold text-xl text-[#17201F]">{MOCK_ANALYTICS.totalApplications}</span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Inst Verification</span>
          <span className="font-serif font-bold text-xl text-[#17201F]">{MOCK_ANALYTICS.pendingInstituteVerification}</span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Officer Desk</span>
          <span className="font-serif font-bold text-xl text-[#17201F]">{MOCK_ANALYTICS.pendingOfficerReview}</span>
        </div>
        <div className="institutional-card p-4 space-y-1 bg-[#FFFBEB] border-[#FDE68A]">
          <span className="text-[10px] font-semibold text-[#B45309] uppercase block">Deficient</span>
          <span className="font-serif font-bold text-xl text-[#92400E]">{MOCK_ANALYTICS.deficiencyCount}</span>
        </div>
        <div className="institutional-card p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Selected</span>
          <span className="font-serif font-bold text-xl text-[#075E54]">{MOCK_ANALYTICS.selectedCount}</span>
        </div>
        <div className="institutional-card p-4 space-y-1 bg-[#17201F] text-white">
          <span className="text-[10px] font-semibold text-[#B5CECA] uppercase block">DBT Disbursed</span>
          <span className="font-serif font-bold text-xl text-white">₹{MOCK_ANALYTICS.totalDisbursedAmountCr} Cr</span>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Application Funnel */}
        <div className="lg:col-span-7 institutional-card p-5 space-y-3">
          <h3 className="font-serif font-bold text-sm text-[#17201F] border-b border-[#EBEFEF] pb-2">
            Application Lifecycle Throughput Funnel
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS.stageFunnel} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEFEF" />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#5E6865' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#5E6865' }} />
                <Tooltip contentStyle={{ backgroundColor: '#17201F', borderColor: '#2D3937', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#075E54" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Deficiency Breakdown */}
        <div className="lg:col-span-5 institutional-card p-5 space-y-3">
          <h3 className="font-serif font-bold text-sm text-[#17201F] border-b border-[#EBEFEF] pb-2">
            Deficiency Root-Cause Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_ANALYTICS.deficiencyCategories}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {MOCK_ANALYTICS.deficiencyCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#17201F', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Institute Verification Performance Table */}
      <div className="institutional-section overflow-hidden">
        <div className="bg-[#F3F4F1] px-5 py-3 border-b border-[#D9DFDC]">
          <h3 className="font-semibold text-xs text-[#17201F] uppercase tracking-wider">
            Institute Verification SLA & Processing Throughput
          </h3>
        </div>

        <table className="institutional-table">
          <thead>
            <tr>
              <th>Institution Name</th>
              <th>Verified Applications</th>
              <th>Pending Queue</th>
              <th>Compliance SLA</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ANALYTICS.instituteThroughput.map((inst, idx) => (
              <tr key={idx}>
                <td className="font-semibold text-[#17201F]">{inst.institute}</td>
                <td className="font-mono text-[#075E54] font-bold">{inst.verified}</td>
                <td className="font-mono text-[#92400E]">{inst.pending}</td>
                <td>
                  <span className="bg-[#F0F6F5] text-[#075E54] border border-[#B5CECA] px-2 py-0.5 rounded text-[11px] font-mono font-medium">
                    98.4% On-Time
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

