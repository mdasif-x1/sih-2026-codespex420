import React from 'react';
import { AIFinding } from '@/types';
import { AlertCircle, FileSearch, ShieldAlert, Check, X, HelpCircle } from 'lucide-react';

interface AIFindingCardProps {
  finding: AIFinding;
  onAction?: (action: 'CONFIRMED' | 'DISMISSED' | 'CLARIFICATION_REQUESTED', notes?: string) => void;
  onViewDocument?: (docName: string) => void;
  readOnly?: boolean;
}

export const AIFindingCard: React.FC<AIFindingCardProps> = ({
  finding,
  onAction,
  onViewDocument,
  readOnly = false,
}) => {
  return (
    <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4 text-xs space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-100 rounded text-amber-800">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-900 text-sm">AI Finding (Assistive Scan)</span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-medium text-[11px]">
                {finding.confidence}% Confidence
              </span>
            </div>
            <p className="text-slate-600 font-medium">{finding.title}</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded uppercase tracking-wider">
          Human Review Required
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-3 bg-white border border-amber-200 rounded p-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Expected Value</span>
          <p className="font-mono text-slate-900 font-medium mt-0.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
            {finding.expected}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Observed (Extracted)</span>
          <p className="font-mono text-amber-900 font-medium mt-0.5 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            {finding.observed}
          </p>
        </div>
      </div>

      {/* Why Flagged & Recommended Action */}
      <div className="space-y-1.5">
        <p className="text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-medium">Why flagged: </strong>
          {finding.whyFlagged}
        </p>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-amber-200/60 text-slate-600">
          <span>
            Source: <strong className="text-slate-800">{finding.sourceDocName}</strong>
            {finding.sourcePage ? ` (Page ${finding.sourcePage})` : ''}
          </span>
          <span className="text-amber-900 font-medium">
            Recommended Action: Human Verification Required
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      {!readOnly && onAction && (
        <div className="flex items-center justify-between pt-2 border-t border-amber-200">
          {onViewDocument && (
            <button
              onClick={() => onViewDocument(finding.sourceDocName)}
              className="inline-flex items-center space-x-1 text-slate-700 hover:text-slate-900 font-medium bg-white border border-slate-300 px-2.5 py-1 rounded hover:bg-slate-50"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Inspect Document</span>
            </button>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAction('DISMISSED', 'Officer confirmed valid alias / acceptable document variance.')}
              className="inline-flex items-center space-x-1 text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded hover:bg-slate-50 font-medium"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
              <span>Dismiss Variance</span>
            </button>
            <button
              onClick={() => onAction('CLARIFICATION_REQUESTED', 'Requesting clarification from applicant.')}
              className="inline-flex items-center space-x-1 text-amber-800 hover:text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded hover:bg-amber-200 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Raise Deficiency</span>
            </button>
            <button
              onClick={() => onAction('CONFIRMED', 'Officer confirmed document mismatch finding.')}
              className="inline-flex items-center space-x-1 text-white bg-teal-700 hover:bg-teal-800 px-3 py-1 rounded font-medium shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm & Accept Evidence</span>
            </button>
          </div>
        </div>
      )}

      {readOnly && finding.status !== 'PENDING_REVIEW' && (
        <div className="pt-2 border-t border-amber-200 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Status: <strong>{finding.status}</strong></span>
          {finding.reviewedBy && <span>Reviewed by: {finding.reviewedBy}</span>}
        </div>
      )}
    </div>
  );
};
