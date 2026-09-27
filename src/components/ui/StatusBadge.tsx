import React from 'react';
import { ApplicationStage } from '@/types';
import { CheckCircle2, AlertTriangle, Clock, ShieldAlert, CheckCheck, FileText, ArrowRightLeft, CreditCard } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStage | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  let label = status;
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = <Clock className="w-3.5 h-3.5" />;

  switch (status) {
    case 'DRAFT':
      label = 'Draft';
      bgClass = 'bg-slate-100 text-slate-700 border-slate-300';
      icon = <FileText className="w-3.5 h-3.5 text-slate-500" />;
      break;
    case 'SUBMITTED':
      label = 'Submitted';
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
      icon = <Clock className="w-3.5 h-3.5 text-blue-600" />;
      break;
    case 'DOCUMENT_CHECK':
      label = 'AI Document Check';
      bgClass = 'bg-cyan-50 text-cyan-800 border-cyan-200';
      icon = <FileText className="w-3.5 h-3.5 text-cyan-700" />;
      break;
    case 'DEFICIENCY':
      label = 'Action Required (Deficiency)';
      bgClass = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      break;
    case 'INSTITUTE_VERIFICATION':
      label = 'Institute Verification';
      bgClass = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      icon = <Clock className="w-3.5 h-3.5 text-indigo-600" />;
      break;
    case 'OFFICER_REVIEW':
      label = 'Officer Review';
      bgClass = 'bg-purple-50 text-purple-800 border-purple-200';
      icon = <Clock className="w-3.5 h-3.5 text-purple-600" />;
      break;
    case 'SELECTION':
    case 'HUMAN_APPROVAL':
      label = 'Selection Board Review';
      bgClass = 'bg-sky-50 text-sky-800 border-sky-200';
      icon = <Clock className="w-3.5 h-3.5 text-sky-600" />;
      break;
    case 'SELECTED':
    case 'VERIFIED':
      label = 'Verified & Selected';
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      break;
    case 'NOT_SELECTED':
      label = 'Not Selected';
      bgClass = 'bg-rose-50 text-rose-800 border-rose-200';
      icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      break;
    case 'DISBURSEMENT_PENDING':
      label = 'Disbursement Pending';
      bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
      icon = <CreditCard className="w-3.5 h-3.5 text-amber-600" />;
      break;
    case 'DISBURSED':
      label = 'Disbursed (PFMS DBT)';
      bgClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
      icon = <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />;
      break;
    case 'RESUBMITTED':
      label = 'Resubmitted for Recheck';
      bgClass = 'bg-blue-50 text-blue-800 border-blue-300';
      icon = <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />;
      break;
    default:
      label = status;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-sm px-3 py-1.5 space-x-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-sans ${bgClass} ${sizeClasses}`}
      aria-label={`Status: ${label}`}
    >
      {showIcon && <span>{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
