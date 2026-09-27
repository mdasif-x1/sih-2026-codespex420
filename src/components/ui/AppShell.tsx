'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { UserRole, User } from '@/types';
import { PublicShell } from './PublicShell';
import { BrandMark } from './BrandMark';
import {
  BookOpen,
  LayoutDashboard,
  Building2,
  ShieldCheck,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  FilePlus,
  History,
  Award,
  ChevronDown,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>('APPLICANT');
  const [currentUser, setCurrentUser] = useState<User>(pragatiStore.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  useEffect(() => {
    setCurrentRole(pragatiStore.getCurrentRole());
    setCurrentUser(pragatiStore.getCurrentUser());

    const unsubscribe = pragatiStore.subscribe(() => {
      setCurrentRole(pragatiStore.getCurrentRole());
      setCurrentUser(pragatiStore.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const isPublicRoute =
    pathname === '/' ||
    pathname === '/schemes' ||
    pathname.startsWith('/schemes/') ||
    pathname === '/eligibility' ||
    pathname === '/login' ||
    pathname === '/register';

  if (isPublicRoute) {
    return <PublicShell>{children}</PublicShell>;
  }

  const handleRoleChange = (role: UserRole) => {
    pragatiStore.setCurrentRole(role);
    setMobileMenuOpen(false);
    setShowPersonaMenu(false);

    switch (role) {
      case 'APPLICANT':
        router.push('/applicant/dashboard');
        break;
      case 'INSTITUTE':
        router.push('/institute');
        break;
      case 'OFFICER':
        router.push('/officer');
        break;
      case 'MONITORING':
        router.push('/monitoring');
        break;
      case 'ADMIN':
        router.push('/admin/schemes');
        break;
    }
  };

  const getNavLinks = () => {
    switch (currentRole) {
      case 'APPLICANT':
        return [
          { href: '/applicant/dashboard', label: 'Applications', icon: LayoutDashboard },
          { href: '/applicant/notifications', label: 'Notifications', icon: Bell },
          { href: '/schemes', label: 'Schemes', icon: BookOpen },
          { href: '/eligibility', label: 'Check Eligibility', icon: ShieldCheck },
        ];
      case 'INSTITUTE':
        return [
          { href: '/institute', label: 'Verification Queue', icon: Building2 },
          { href: '/schemes', label: 'Schemes', icon: BookOpen },
        ];
      case 'OFFICER':
        return [
          { href: '/officer', label: 'Review Workstation', icon: ShieldCheck },
          { href: '/officer/selection', label: 'Selection Board', icon: Award },
          { href: '/monitoring', label: 'Analytics', icon: BarChart3 },
        ];
      case 'MONITORING':
        return [
          { href: '/monitoring', label: 'Ministry Analytics', icon: BarChart3 },
          { href: '/officer/selection', label: 'Merit Lists', icon: Award },
          { href: '/schemes', label: 'Schemes Catalog', icon: BookOpen },
        ];
      case 'ADMIN':
        return [
          { href: '/admin/schemes', label: 'Scheme Configurator', icon: Settings },
          { href: '/admin/audit', label: 'Audit Log', icon: History },
          { href: '/monitoring', label: 'Analytics', icon: BarChart3 },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] font-sans text-[#17201F]">
      {/* 1. Primary Internal Operational Header */}
      <header className="bg-white border-b border-[#D9DFDC] sticky top-0 z-20">
        <div className="workspace-container h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#17201F] p-1.5 rounded hover:bg-[#F3F4F1]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center space-x-2.5 group">
              <BrandMark size="sm" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-base text-[#202321] tracking-tight">PRAGATI</span>
                  <span className="text-[10px] font-bold bg-[#E9EEF1] text-[#263746] border border-[#C8C5BD] px-1.5 py-0.5 rounded uppercase">
                    {currentRole}
                  </span>
                </div>
                <p className="text-[10px] text-[#626661] hidden sm:block leading-none mt-0.5">
                  Ministry of Tribal Affairs Operations
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link
              href="/applicant/notifications"
              className="relative text-[#626661] hover:text-[#202321] p-1.5 rounded hover:bg-[#EBE8E1] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#A4773D]" />
            </Link>

            {/* Discreet Demo Role Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center space-x-2 border border-[#D8D5CE] rounded px-2.5 py-1 text-xs hover:bg-[#EBE8E1] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#263746] text-white flex items-center justify-center text-[10px] font-bold font-mono">
                  {currentUser.avatar || 'U'}
                </div>
                <span className="font-medium text-[#202321] hidden sm:inline">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#626661]" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#D8D5CE] rounded shadow-md z-30 py-2 text-xs space-y-1">
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#858983] uppercase tracking-wider">
                    Switch Workspace Persona
                  </div>
                  {(['APPLICANT', 'INSTITUTE', 'OFFICER', 'MONITORING', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs font-medium hover:bg-[#EBE8E1] ${
                        currentRole === r ? 'text-[#263746] font-bold bg-[#E9EEF1]' : 'text-[#202321]'
                      }`}
                    >
                      <span>{r === 'APPLICANT' ? 'Applicant (Aarav)' : r === 'INSTITUTE' ? 'Institute Admin' : r === 'OFFICER' ? 'Verification Officer' : r === 'MONITORING' ? 'Ministry Monitoring' : 'System Admin'}</span>
                      {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-[#A4773D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Internal Workspace Body (Expansive Layout) */}
      <div className="flex-1 workspace-container py-6 flex flex-col md:flex-row gap-6">
        {/* Workspace Sidebar */}
        <aside
          className={`md:w-56 flex-shrink-0 ${
            mobileMenuOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="institutional-section p-3 sticky top-20 space-y-4">
            <div>
              <div className="text-[10px] font-semibold text-[#858983] uppercase tracking-wider mb-2 px-2">
                Navigation
              </div>
              <nav className="space-y-0.5">
                {navLinks?.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#263746] text-white font-semibold'
                          : 'text-[#383B38] hover:bg-[#EBE8E1] hover:text-[#202321]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#626661]'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {currentRole === 'APPLICANT' && (
              <div className="pt-2 border-t border-[#D9DFDC]">
                <Link
                  href="/schemes"
                  className="w-full flex items-center justify-center space-x-1.5 btn-primary text-xs py-2 w-full"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Start Application</span>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Workspace Content Area (Expansive Width) */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Internal Footer */}
      <footer className="bg-white border-t border-[#D9DFDC] mt-auto text-xs text-[#5E6865] py-4">
        <div className="workspace-container flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-[#17201F]">
            PRAGATI — Ministry of Tribal Affairs Operational Portal
          </p>
          <div className="flex items-center space-x-4 text-[11px] text-[#5E6865]">
            <Link href="/schemes" className="hover:underline">Schemes Catalog</Link>
            <Link href="/eligibility" className="hover:underline">Check Eligibility</Link>
            <Link href="/admin/audit" className="hover:underline">Audit Records</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

