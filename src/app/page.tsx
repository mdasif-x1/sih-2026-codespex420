import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, ArrowRight, CheckCircle2, FileText, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section (Editorial Layout with Real Scholarship Quick Panel) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 text-[#263746] text-xs font-semibold uppercase tracking-wider bg-[#E9EEF1] border border-[#C8C5BD] px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-[#A4773D]" />
            <span>Ministry of Tribal Affairs • Government of India</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#202321] tracking-tight leading-[1.18]">
            Scholarships and fellowships for Scheduled Tribes students.
          </h1>

          <p className="text-[#626661] text-base sm:text-lg leading-relaxed max-w-2xl">
            PRAGATI provides centralized scholarship application workflows, versioned scheme criteria, and evidence verification for Scheduled Tribes students pursuing higher education and research.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/schemes"
              className="btn-primary py-2.5 px-5 space-x-2"
            >
              <span>Explore Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/eligibility"
              className="btn-secondary py-2.5 px-5 space-x-2"
            >
              <span>Check Eligibility</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Useful Active Schemes Panel */}
        <div className="lg:col-span-5 bg-white border border-[#D8D5CE] rounded p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-3">
            <span className="text-xs font-bold text-[#202321] uppercase tracking-wider">Active Programmes</span>
            <span className="text-[11px] font-mono text-[#263746] bg-[#E9EEF1] px-2 py-0.5 rounded font-semibold border border-[#C8C5BD]">2026 Academic Year</span>
          </div>

          <div className="space-y-3 text-xs">
            <Link href="/schemes/scheme_nfst" className="p-3 bg-[#FAF9F6] border border-[#D8D5CE] rounded hover:border-[#A4773D] transition-colors block">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#202321] text-xs">National Fellowship for ST (NFST)</span>
                <span className="text-[#263746] font-semibold text-[11px]">View Details →</span>
              </div>
              <p className="text-[#626661] text-[11px] mt-1">Financial support for ST students pursuing M.Phil and Ph.D. degrees.</p>
            </Link>

            <Link href="/schemes/scheme_nos" className="p-3 bg-[#FAF9F6] border border-[#D8D5CE] rounded hover:border-[#A4773D] transition-colors block">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#202321] text-xs">National Overseas Scholarship (NOS)</span>
                <span className="text-[#263746] font-semibold text-[11px]">View Details →</span>
              </div>
              <p className="text-[#626661] text-[11px] mt-1">100 slots for Master's and Ph.D. studies at foreign universities.</p>
            </Link>

            <Link href="/schemes/scheme_topclass" className="p-3 bg-[#FAF9F6] border border-[#D8D5CE] rounded hover:border-[#A4773D] transition-colors block">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#202321] text-xs">Top Class Education for ST</span>
                <span className="text-[#263746] font-semibold text-[11px]">View Details →</span>
              </div>
              <p className="text-[#626661] text-[11px] mt-1">Full tuition waiver and living stipends at premier institutes (IIT/NIT/IIM).</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Institutional Context Bar */}
      <section className="bg-white border-y border-[#D8D5CE] py-5 px-6 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="app-container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#626661]">
          <div>
            <span className="font-bold text-[#202321] text-sm block">Centralized Ministry Platform</span>
            <p className="text-[#626661] mt-0.5 max-w-xl">
              Eliminating multi-portal fragmentation through shared workflow infrastructure and versioned scheme rules.
            </p>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="bg-[#EBE8E1] px-2.5 py-1 rounded border border-[#D8D5CE] text-[#202321]">NFST Fellowship</span>
            <span className="bg-[#EBE8E1] px-2.5 py-1 rounded border border-[#D8D5CE] text-[#202321]">NOS Overseas</span>
            <span className="bg-[#EBE8E1] px-2.5 py-1 rounded border border-[#D8D5CE] text-[#202321]">Top Class</span>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Application Step Process */}
      <section id="how-it-works" className="space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#263746] uppercase tracking-wider">Application Journey</span>
          <h2 className="font-serif font-bold text-2xl text-[#202321] mt-1">How PRAGATI Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#D8D5CE] rounded space-y-2">
            <span className="font-serif font-bold text-lg text-[#A4773D] block">01</span>
            <h3 className="font-semibold text-sm text-[#202321]">Find Scheme</h3>
            <p className="text-xs text-[#626661] leading-relaxed">
              Explore active schemes and check eligibility against published version rules.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#D8D5CE] rounded space-y-2">
            <span className="font-serif font-bold text-lg text-[#A4773D] block">02</span>
            <h3 className="font-semibold text-sm text-[#202321]">Submit Application</h3>
            <p className="text-xs text-[#626661] leading-relaxed">
              Fill dynamic application forms and upload bonafide and income certificates.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#D8D5CE] rounded space-y-2">
            <span className="font-serif font-bold text-lg text-[#A4773D] block">03</span>
            <h3 className="font-semibold text-sm text-[#202321]">Verification</h3>
            <p className="text-xs text-[#626661] leading-relaxed">
              Institute bonafide approval followed by officer evidence verification workstations.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#D8D5CE] rounded space-y-2">
            <span className="font-serif font-bold text-lg text-[#A4773D] block">04</span>
            <h3 className="font-semibold text-sm text-[#202321]">Selection & Disbursement</h3>
            <p className="text-xs text-[#626661] leading-relaxed">
              Merit score ranking, selection board approval, and direct benefit transfer.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Institutional Values */}
      <section className="bg-[#202321] text-white rounded p-6 sm:p-8 space-y-3">
        <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#A4773D]" />
          <span className="text-[#D8D5CE]">Governance & Governance Oversight</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold">Configurable Scheme Infrastructure + Human Authority</h3>
        <p className="text-[#D8D5CE] text-xs sm:text-sm max-w-3xl leading-relaxed">
          PRAGATI decouples core application workflows from scheme rule logic. Ministry administrators configure dynamic rules, forms, and selection criteria as immutable version snapshots without software changes.
        </p>
      </section>
    </div>
  );
}

