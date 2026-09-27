'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { Application, UploadedDocument } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AIFindingCard } from '@/components/ui/AIFindingCard';
import { RuleEvaluationTable } from '@/components/ui/RuleEvaluationTable';
import { DocumentViewerModal } from '@/components/ui/DocumentViewerModal';
import { ArrowLeft, FileSearch, AlertTriangle, Check } from 'lucide-react';

export default function OfficerApplicationWorkstation() {
  const params = useParams();
  const router = useRouter();
  const appId = params?.id as string;

  const [app, setApp] = useState<Application | undefined>(undefined);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);

  useEffect(() => {
    setApp(pragatiStore.getApplicationById(appId));
    const unsub = pragatiStore.subscribe(() => {
      setApp(pragatiStore.getApplicationById(appId));
    });
    return () => unsub();
  }, [appId]);

  if (!app) {
    return (
      <div className="institutional-section p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-[#17201F]">Application Record Not Found</h2>
        <Link href="/officer" className="text-xs text-[#075E54] font-semibold underline">&larr; Return to Review Desk</Link>
      </div>
    );
  }

  const handleApproveApplication = () => {
    const updatedApp: Application = {
      ...app,
      stage: 'SELECTION',
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: new Date().toISOString(),
          stage: 'SELECTION',
          actor: 'Rajesh Sharma (Officer)',
          actorRole: 'OFFICER',
          title: 'Officer Approved & Forwarded to Selection Pool',
          description: 'Document evidence verified. Deterministic rules evaluation cleared.',
        },
        ...app.timeline,
      ],
    };

    pragatiStore.updateApplication(
      updatedApp,
      'OFFICER_APPROVE',
      `Officer approved application ${app.id} for Selection Pool`
    );
    router.push('/officer');
  };

  const handleAIFindingAction = (action: 'CONFIRMED' | 'DISMISSED' | 'CLARIFICATION_REQUESTED', notes?: string) => {
    const updatedFindings = app.aiFindings.map((f) => ({
      ...f,
      status: action,
      reviewedBy: 'Rajesh Sharma (Officer)',
      reviewedAt: new Date().toISOString(),
      reviewNotes: notes,
    }));

    let newStage = app.stage;
    let newDeficiency = app.deficiency;

    if (action === 'CLARIFICATION_REQUESTED') {
      newStage = 'DEFICIENCY';
      newDeficiency = {
        id: `def_off_${Date.now()}`,
        applicationId: app.id,
        documentType: app.aiFindings[0]?.documentType || 'INCOME_CERTIFICATE',
        issueType: 'AI_VARIANCE_FLAGGED',
        problemDescription: app.aiFindings[0]?.whyFlagged || 'Document mismatch detected during AI verification.',
        requiredAction: 'Upload clear updated document issued by competent revenue authority.',
        deadline: '2026-10-15',
        status: 'ACTION_REQUIRED',
        createdAt: new Date().toISOString(),
        history: [
          {
            id: `dh_${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: 'Rajesh Sharma (Officer)',
            action: 'RAISED',
            comment: notes || 'Raised deficiency following AI finding review.',
          },
        ],
      };
    }

    const updatedApp: Application = {
      ...app,
      stage: newStage,
      deficiency: newDeficiency,
      aiFindings: updatedFindings,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: new Date().toISOString(),
          stage: newStage,
          actor: 'Rajesh Sharma (Officer)',
          actorRole: 'OFFICER',
          title: action === 'CLARIFICATION_REQUESTED' ? 'Deficiency Raised by Officer' : `AI Finding Resolved: ${action}`,
          description: notes || `Officer resolved AI variance status to ${action}`,
        },
        ...app.timeline,
      ],
    };

    pragatiStore.updateApplication(
      updatedApp,
      'AI_FINDING_REVIEW',
      `Officer resolved AI finding status to ${action}`
    );
  };

  return (
    <div className="space-y-5">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link href="/officer" className="inline-flex items-center space-x-1 text-xs text-[#5E6865] hover:text-[#17201F] font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Verification Queue</span>
        </Link>
        <span className="text-[11px] font-mono text-[#838E8A]">Officer Review Workstation</span>
      </div>

      {/* Page Header Workstation Banner */}
      <div className="institutional-section p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EBEFEF] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-[#17201F] text-sm">{app.id}</span>
              <StatusBadge status={app.stage} />
            </div>
            <h1 className="page-header-title mt-1">{app.applicantName}</h1>
            <p className="page-header-subtitle">
              Scheme: <strong className="text-[#17201F] font-semibold">{app.schemeCode} ({app.schemeName})</strong> • ST Certificate: {app.stCertificateNo}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleApproveApplication}
              className="btn-primary text-xs space-x-1.5 py-2 px-4"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Forward to Selection Board</span>
            </button>
          </div>
        </div>

        {/* Applicant Context Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="bg-[#F3F4F1] p-2.5 rounded border border-[#EBEFEF]">
            <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Institute</span>
            <p className="font-medium text-[#17201F] truncate mt-0.5">{app.instituteName}</p>
          </div>
          <div className="bg-[#F3F4F1] p-2.5 rounded border border-[#EBEFEF]">
            <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Marks (%)</span>
            <p className="font-mono font-bold text-[#17201F] mt-0.5">{app.marksPercentage}%</p>
          </div>
          <div className="bg-[#F3F4F1] p-2.5 rounded border border-[#EBEFEF]">
            <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Annual Income</span>
            <p className="font-mono font-bold text-[#17201F] mt-0.5">₹ {app.annualFamilyIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-[#F3F4F1] p-2.5 rounded border border-[#EBEFEF]">
            <span className="text-[10px] font-semibold text-[#838E8A] uppercase block">Composite Score</span>
            <p className="font-mono font-bold text-[#075E54] mt-0.5">{app.compositeScore || 91.4} / 100</p>
          </div>
        </div>
      </div>

      {/* AI Findings Evidence Inspector */}
      {app.aiFindings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#FDE68A] pb-2">
            <h3 className="font-serif font-bold text-sm text-[#78350F] flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#B45309]" />
              <span>AI Document Findings & Evidence Workstation</span>
            </h3>
            <span className="text-xs text-[#92400E] font-mono font-medium">
              Officer Review Required
            </span>
          </div>

          <div className="space-y-3">
            {app.aiFindings.map((finding) => (
              <AIFindingCard
                key={finding.id}
                finding={finding}
                onAction={handleAIFindingAction}
                onViewDocument={() => {
                  const doc = app.documents.find((d) => d.fileName === finding.sourceDocName) || app.documents[0];
                  setSelectedDoc(doc);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Deterministic Rule Evaluation Table */}
      <RuleEvaluationTable rules={app.ruleEvaluations} />

      {/* Attached Documents List & OCR Verification */}
      <div className="institutional-section p-5 space-y-4">
        <h3 className="font-serif font-bold text-sm text-[#17201F] border-b border-[#EBEFEF] pb-2">
          Document Proof Records & Extracted OCR Fields
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {app.documents.map((doc) => (
            <div key={doc.id} className="p-3.5 border border-[#D9DFDC] rounded bg-white text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#17201F] block">{doc.documentType}</span>
                  <span className="font-mono text-[#838E8A] text-[11px]">{doc.fileName}</span>
                </div>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center space-x-1"
                >
                  <FileSearch className="w-3.5 h-3.5 text-[#5E6865]" />
                  <span>Inspect OCR</span>
                </button>
              </div>

              {doc.extractions.length > 0 && (
                <div className="space-y-1 bg-[#F3F4F1] p-2 rounded border border-[#EBEFEF] text-[11px]">
                  {doc.extractions.map((ex, idx) => (
                    <div key={idx} className="flex justify-between font-mono">
                      <span className="text-[#5E6865] capitalize">{ex.fieldName}:</span>
                      <span className="text-[#17201F] font-semibold">{ex.extractedValue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Split OCR Document Viewer Modal */}
      <DocumentViewerModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}

