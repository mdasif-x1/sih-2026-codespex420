'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { Application } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { WorkflowTimeline } from '@/components/ui/WorkflowTimeline';
import { ArrowLeft, AlertTriangle, Upload, CheckCircle2, FileText, History, RefreshCw } from 'lucide-react';

export default function ApplicationDetailPage() {
  const params = useParams();
  const appId = params?.id as string;
  const [app, setApp] = useState<Application | undefined>(undefined);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitFile, setResubmitFile] = useState<string>('');

  useEffect(() => {
    setApp(pragatiStore.getApplicationById(appId));
    const unsub = pragatiStore.subscribe(() => {
      setApp(pragatiStore.getApplicationById(appId));
    });
    return () => unsub();
  }, [appId]);

  if (!app) {
    return (
      <div className="institutional-card p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Application Record Not Found</h2>
        <p className="text-xs text-slate-500">Requested application ID [{appId}] does not exist in the active store.</p>
        <Link href="/applicant/dashboard" className="text-xs text-teal-800 font-semibold underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const hasDeficiency = app.stage === 'DEFICIENCY' || app.deficiency?.status === 'ACTION_REQUIRED';

  const handleResubmitDocument = () => {
    if (!app.deficiency) return;
    const currentDef = app.deficiency;
    setResubmitting(true);

    setTimeout(() => {
      const updatedApp: Application = {
        ...app,
        stage: 'DOCUMENT_CHECK',
        deficiency: {
          ...currentDef,
          status: 'RESUBMITTED',
          history: [
            ...currentDef.history,
            {
              id: `dh_${Date.now()}`,
              timestamp: new Date().toISOString(),
              actor: `${app.applicantName} (Applicant)`,
              action: 'RESUBMITTED',
              comment: 'Uploaded corrected revenue certificate copy.',
              documentName: resubmitFile || 'income_certificate_corrected.pdf',
            },
          ],
        },
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: new Date().toISOString(),
            stage: 'DOCUMENT_CHECK',
            actor: app.applicantName,
            actorRole: 'APPLICANT',
            title: 'Deficiency Resubmitted',
            description: 'Corrected document uploaded. Sent back to AI verification pipeline.',
          },
          ...app.timeline,
        ],
      };

      pragatiStore.updateApplication(
        updatedApp,
        'DEFICIENCY_RESOLVE_ATTEMPT',
        `Applicant resubmitted document for ${currentDef.documentType}`
      );
      setResubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <Link href="/applicant/dashboard" className="inline-flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Applications</span>
      </Link>

      {/* Header Banner */}
      <div className="institutional-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-slate-900 text-base">{app.id}</span>
              <StatusBadge status={app.stage} />
            </div>
            <h1 className="font-serif font-bold text-xl text-slate-900 mt-1">{app.schemeName}</h1>
            <p className="text-xs text-slate-500">
              Institute: <span className="text-slate-800 font-medium">{app.instituteName}</span> • Course: {app.courseName}
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        {/* Timeline */}
        <WorkflowTimeline currentStage={app.stage} timeline={app.timeline} />
      </div>

      {/* Deficiency Resolution Workstation Panel */}
      {hasDeficiency && app.deficiency && (
        <div className="border border-amber-300 bg-amber-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-amber-900 text-sm">Action Required: Resolve Deficiency</h3>
          </div>

          <div className="bg-white border border-amber-200 rounded p-4 text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Flagged Document</span>
                <span className="font-mono font-bold text-slate-900">{app.deficiency.documentType}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Action Deadline</span>
                <span className="font-mono text-amber-900 font-bold">{app.deficiency.deadline}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900">Problem Description:</span>
              <p className="text-slate-700 mt-0.5">{app.deficiency.problemDescription}</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900">What You Need To Do:</span>
              <p className="text-amber-900 font-medium mt-0.5">{app.deficiency.requiredAction}</p>
            </div>
          </div>

          {/* Upload Resubmission Controls */}
          <div className="bg-white border border-amber-300 rounded p-4 space-y-3">
            <label className="block text-xs font-semibold text-slate-800">
              Upload Corrected Document (PDF / JPG)
            </label>

            <div className="flex items-center space-x-3">
              <input
                type="file"
                onChange={(e) => setResubmitFile(e.target.files?.[0]?.name || 'income_cert_resubmitted.pdf')}
                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
              />

              <button
                onClick={handleResubmitDocument}
                disabled={resubmitting}
                className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-4 py-2 rounded shadow-xs inline-flex items-center space-x-1"
              >
                {resubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{resubmitting ? 'Processing AI Recheck...' : 'Submit Corrected Document'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Documents Status Grid */}
      <div className="institutional-card p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Attached Application Documents & AI Verification Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {app.documents.map((doc) => (
            <div key={doc.id} className="p-4 border border-slate-200 rounded bg-white text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{doc.documentType}</span>
                <span className="font-mono text-slate-400 text-[10px]">{doc.fileName}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Status:</span>
                <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>AI Extracted & Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
