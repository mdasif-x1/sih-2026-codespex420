'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SchemeDetailPage() {
  const params = useParams();
  const schemeId = params?.id as string;
  const scheme = pragatiStore.getSchemes().find((s) => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="institutional-section p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-[#17201F]">Scheme Not Found</h2>
        <p className="text-xs text-[#5E6865]">The requested scholarship scheme could not be located in the system registry.</p>
        <Link href="/schemes" className="inline-block text-xs text-[#075E54] font-semibold underline">
          &larr; Return to Schemes Catalog
        </Link>
      </div>
    );
  }

  const activeVer = scheme.versions.find((v) => v.versionId === scheme.currentVersionId) || scheme.versions[0];

  return (
    <div className="space-y-6">
      {/* Navigation Top */}
      <Link href="/schemes" className="inline-flex items-center space-x-1 text-xs text-[#5E6865] hover:text-[#17201F]">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Schemes Catalog</span>
      </Link>

      {/* Scheme Banner */}
      <div className="institutional-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="bg-[#17201F] text-white px-2.5 py-0.5 rounded font-mono font-bold text-xs">
              {scheme.code}
            </span>
            <span className="text-xs text-[#5E6865] font-mono">
              Published Version: {activeVer.versionTag}
            </span>
          </div>

          <span className="bg-[#F0F6F5] text-[#075E54] border border-[#B5CECA] text-xs px-2.5 py-1 rounded font-medium">
            Applications Active
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17201F] leading-snug">
          {scheme.name}
        </h1>

        <p className="text-[#5E6865] text-xs sm:text-sm leading-relaxed max-w-3xl">
          {scheme.fullDescription}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#EBEFEF]">
          <Link
            href={`/applicant/apply/${scheme.id}`}
            className="btn-primary text-xs py-2 px-5 space-x-1.5"
          >
            <span>Start Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/eligibility"
            className="btn-secondary text-xs py-2 px-4 space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#075E54]" />
            <span>Check My Eligibility</span>
          </Link>
        </div>
      </div>

      {/* Structured Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-8 space-y-6">
          {/* Eligibility Criteria */}
          <div className="institutional-card p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#17201F] border-b border-[#EBEFEF] pb-2">
              Configured Eligibility Criteria (Version {activeVer.versionTag})
            </h3>
            <ul className="space-y-3 text-xs">
              {activeVer.eligibilityRules.map((rule) => (
                <li key={rule.id} className="flex items-start space-x-2 bg-[#F3F4F1] p-3 rounded border border-[#EBEFEF]">
                  <CheckCircle2 className="w-4 h-4 text-[#075E54] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#17201F] block">{rule.fieldLabel}</span>
                    <p className="text-[#5E6865] mt-0.5">{rule.errorMessage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Document Requirements */}
          <div className="institutional-card p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#17201F] border-b border-[#EBEFEF] pb-2">
              Mandatory Document Requirements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeVer.documentRequirements.map((doc) => (
                <div key={doc.id} className="p-3 border border-[#D9DFDC] rounded bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#17201F]">{doc.label}</span>
                    <span className="text-[10px] font-mono text-[#838E8A] uppercase">{doc.allowedFormats.join(', ')}</span>
                  </div>
                  <p className="text-[#5E6865] text-[11px]">{doc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Details */}
        <div className="md:col-span-4 space-y-6">
          <div className="institutional-card p-4 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-[10px] text-[#838E8A]">
              Scheme Overview
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-[#5E6865] block">Ministry:</span>
                <span className="font-medium text-[#17201F]">{scheme.ministry}</span>
              </div>
              <div>
                <span className="text-[#5E6865] block">Target Group:</span>
                <span className="font-medium text-[#17201F]">{scheme.targetCategory}</span>
              </div>
              <div>
                <span className="text-[#5E6865] block">Selection Engine:</span>
                <span className="font-mono text-[#17201F] bg-[#F3F4F1] px-1.5 py-0.5 rounded text-[11px]">
                  {activeVer.selectionMethod}
                </span>
              </div>
              {scheme.totalSeats && (
                <div>
                  <span className="text-[#5E6865] block">Total Allocated Seats:</span>
                  <span className="font-medium text-[#17201F]">{scheme.totalSeats} Seats</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

