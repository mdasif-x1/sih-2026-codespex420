'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, X, ShieldCheck } from 'lucide-react';
import { BrandMark } from './BrandMark';

interface PublicShellProps {
  children: React.ReactNode;
}

export const PublicShell: React.FC<PublicShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EC] font-sans text-[#202321]">
      {/* 1. Subtle Institutional Utility Bar */}
      <div className="bg-[#EBE8E1] border-b border-[#D8D5CE] text-[#626661] px-4 py-1.5 text-xs">
        <div className="app-container flex items-center justify-between">
          <span className="font-medium text-[#202321]">
            Ministry of Tribal Affairs • Government of India
          </span>
          <div className="flex items-center space-x-4 text-[#626661] text-[11px]">
            <span>National Scholarship & Fellowship Portal</span>
            <span className="hidden sm:inline">• Official Public Digital Service</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Public Header (Quiet, Mature, 68px) */}
      <header className="bg-white border-b border-[#D8D5CE] sticky top-0 z-30">
        <div className="app-container h-17 flex items-center justify-between">
          {/* Brand Lockup */}
          <Link href="/" className="flex items-center space-x-3 group">
            <BrandMark size="md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl text-[#202321] tracking-tight leading-none">
                  PRAGATI
                </span>
              </div>
              <p className="text-[11px] text-[#626661] font-medium leading-tight mt-0.5 hidden sm:block">
                Scholarship & Fellowship Management System
              </p>
            </div>
          </Link>

          {/* Desktop Public Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#383B38]">
            <Link
              href="/schemes"
              className={`hover:text-[#263746] transition-colors py-1 ${
                pathname.startsWith('/schemes') ? 'text-[#263746] border-b-2 border-[#A4773D]' : ''
              }`}
            >
              Schemes Catalog
            </Link>
            <Link
              href="/eligibility"
              className={`hover:text-[#263746] transition-colors py-1 ${
                pathname === '/eligibility' ? 'text-[#263746] border-b-2 border-[#A4773D]' : ''
              }`}
            >
              Check Eligibility
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-[#263746] transition-colors py-1"
            >
              How It Works
            </Link>
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden sm:flex items-center space-x-3 text-xs">
            <Link
              href="/login"
              className="px-3.5 py-2 rounded text-[#202321] hover:bg-[#EBE8E1] font-semibold border border-[#D8D5CE] transition-colors inline-flex items-center space-x-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#626661]" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/register"
              className="btn-primary"
            >
              <span>Register Profile</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center space-x-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#263746] px-2.5 py-1 rounded border border-[#C8C5BD] bg-[#E9EEF1]"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#202321] p-2 rounded hover:bg-[#EBE8E1]"
              aria-label="Toggle Public Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#D8D5CE] bg-white px-5 py-4 space-y-4 text-xs shadow-md">
            <nav className="space-y-2">
              <Link
                href="/schemes"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2.5 rounded text-[#202321] font-semibold hover:bg-[#EBE8E1]"
              >
                Schemes Catalog
              </Link>
              <Link
                href="/eligibility"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2.5 rounded text-[#202321] font-semibold hover:bg-[#EBE8E1]"
              >
                Check Eligibility
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2.5 rounded text-[#202321] font-semibold hover:bg-[#EBE8E1]"
              >
                How It Works
              </Link>
            </nav>

            <div className="pt-3 border-t border-[#D8D5CE] space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-[#D8D5CE] rounded font-semibold text-[#202321] block"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-[#263746] text-white rounded font-semibold block"
              >
                Register Profile
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. Main Public Page Container */}
      <main className="flex-1 w-full app-container py-8">
        {children}
      </main>

      {/* 4. Mature Institutional Public Footer */}
      <footer className="bg-[#202321] text-[#D8D5CE] mt-auto text-xs py-10 border-t border-[#383B38]">
        <div className="app-container space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Column 1: Brand & Ministry */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-[#263746] text-white font-serif font-bold text-sm flex items-center justify-center">
                  P
                </div>
                <span className="font-serif font-bold text-white text-base tracking-tight">PRAGATI</span>
              </div>
              <p className="text-[#A5A9A4] text-xs leading-relaxed max-w-sm">
                Scholarship & Fellowship Management System providing common workflow infrastructure, versioned scheme configuration, and evidence verification for Scheduled Tribes students across India.
              </p>
              <p className="text-[11px] text-[#787C77] font-mono pt-1">
                Ministry of Tribal Affairs • Government of India
              </p>
            </div>

            {/* Column 2: Programs */}
            <div className="md:col-span-3 space-y-2">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Scholarship Schemes</h4>
              <ul className="space-y-1.5 text-[#A5A9A4]">
                <li><Link href="/schemes/scheme_nfst" className="hover:text-white">National Fellowship for ST (NFST)</Link></li>
                <li><Link href="/schemes/scheme_nos" className="hover:text-white">National Overseas Scholarship (NOS)</Link></li>
                <li><Link href="/schemes/scheme_topclass" className="hover:text-white">Top Class Education for ST</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="md:col-span-2 space-y-2">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Portal Services</h4>
              <ul className="space-y-1.5 text-[#A5A9A4]">
                <li><Link href="/schemes" className="hover:text-white">Schemes Catalog</Link></li>
                <li><Link href="/eligibility" className="hover:text-white">Check Eligibility</Link></li>
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>

            {/* Column 4: Governance */}
            <div className="md:col-span-2 space-y-2">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Governance</h4>
              <ul className="space-y-1.5 text-[#A5A9A4]">
                <li className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A4773D]" />
                  <span>Human Oversight</span>
                </li>
                <li><span>Versioned Rules</span></li>
                <li><span>Auditable Logs</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#383B38] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#787C77]">
            <p>© 2026 Ministry of Tribal Affairs, Government of India. All rights reserved.</p>
            <p className="font-mono">PRAGATI Portal v2026.1</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

