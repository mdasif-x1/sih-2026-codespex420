'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { pragatiStore } from '@/lib/data/storeService';
import { Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SchemesPage() {
  const schemes = pragatiStore.getSchemes();
  const [search, setSearch] = useState('');

  const filteredSchemes = schemes.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DFDC] pb-4">
        <div>
          <h1 className="page-header-title">Scholarship Schemes Catalog</h1>
          <p className="page-header-subtitle">
            Official Ministry schemes for Scheduled Tribes higher education, foreign studies, and premier institutes.
          </p>
        </div>

        <Link
          href="/eligibility"
          className="btn-secondary text-xs space-x-1.5 self-start md:self-auto"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#075E54]" />
          <span>Check My Eligibility</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="institutional-card p-3 flex items-center space-x-3">
        <Search className="w-4 h-4 text-[#838E8A]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schemes by name, keyword, or code (e.g. NFST, NOS, Top Class)..."
          className="w-full text-xs text-[#17201F] focus:outline-none placeholder-[#838E8A]"
        />
      </div>

      {/* Scheme Listings */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const activeVer = scheme.versions.find((v) => v.versionId === scheme.currentVersionId) || scheme.versions[0];
          return (
            <div key={scheme.id} className="institutional-card p-5 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#17201F] text-white px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                    {scheme.code}
                  </span>
                  <span className="text-[11px] text-[#5E6865] font-mono">
                    Version {activeVer?.versionTag || '2026.1'}
                  </span>
                  <span className="bg-[#F0F6F5] text-[#075E54] border border-[#B5CECA] text-[11px] px-2 py-0.5 rounded font-medium">
                    Applications Open
                  </span>
                </div>

                <h2 className="font-serif text-lg font-bold text-[#17201F] leading-snug">
                  {scheme.name}
                </h2>

                <p className="text-xs text-[#5E6865] leading-relaxed">
                  {scheme.shortDescription}
                </p>

                {/* Scannable Criteria Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="bg-[#F3F4F1] p-2.5 rounded border border-[#EBEFEF]">
                    <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">INCOME CEILING</span>
                    <span className="text-[#17201F] font-medium text-xs">
                      &le; ₹{(activeVer?.maxFamilyIncome || 600000).toLocaleString('en-IN')} / yr
                    </span>
                  </div>
                  <div className="bg-[#F3F4F1] p-2.5 rounded border border-[#EBEFEF]">
                    <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">APPLICATION WINDOW</span>
                    <span className="text-[#17201F] font-medium text-xs">
                      {scheme.applicationPeriod.startDate} to {scheme.applicationPeriod.endDate}
                    </span>
                  </div>
                  <div className="bg-[#F3F4F1] p-2.5 rounded border border-[#EBEFEF]">
                    <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">REQUIRED DOCUMENTS</span>
                    <span className="text-[#17201F] font-medium text-xs">
                      {activeVer?.documentRequirements.length || 4} Verification Files
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="md:w-52 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#D9DFDC] pt-4 md:pt-0 md:pl-5 space-y-3">
                <div className="text-xs space-y-1">
                  <span className="text-[#838E8A] block text-[11px]">Ministry Division:</span>
                  <span className="font-medium text-[#17201F]">{scheme.ministry}</span>
                  <span className="text-[#838E8A] block text-[11px] mt-2">Target Group:</span>
                  <span className="font-medium text-[#17201F]">{scheme.targetCategory}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={`/applicant/apply/${scheme.id}`}
                    className="btn-primary w-full text-xs space-x-1 py-2"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/schemes/${scheme.id}`}
                    className="btn-secondary w-full text-xs py-1.5 text-center block"
                  >
                    <span>View Scheme Details</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

