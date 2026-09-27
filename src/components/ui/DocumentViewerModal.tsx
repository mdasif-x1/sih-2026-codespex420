'use client';

import React from 'react';
import { UploadedDocument } from '@/types';
import { X, ZoomIn, ZoomOut, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface DocumentViewerModalProps {
  document: UploadedDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-semibold text-sm">{document.fileName}</h3>
              <p className="text-xs text-slate-400">
                Document Type: <span className="text-slate-200 font-mono">{document.documentType}</span> • Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Document Preview Workstation */}
          <div className="md:col-span-7 bg-slate-100 p-4 border-r border-slate-200 flex flex-col justify-between overflow-y-auto">
            <div className="bg-white border border-slate-300 rounded shadow-sm p-6 min-h-[450px] flex flex-col items-center justify-between text-center relative">
              <div className="w-full text-left border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">Government Document Sample Record</span>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {document.id}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-2 py-0.5 rounded font-medium">
                  Verified Digital Seal
                </span>
              </div>

              {/* Mock PDF Document Display */}
              <div className="my-auto space-y-4 max-w-md">
                <div className="p-4 border border-dashed border-slate-300 rounded bg-slate-50">
                  <h4 className="font-serif font-bold text-slate-800 text-lg">REVENUE DEPARTMENT & FELLOWSHIP RECORD</h4>
                  <p className="text-xs text-slate-600 mt-1">Ref: MOTA/ST/{document.documentType}/2026</p>
                  <div className="my-4 text-xs font-mono text-left bg-white p-3 border border-slate-200 rounded space-y-1">
                    <p><strong>DOCUMENT TYPE:</strong> {document.documentType}</p>
                    <p><strong>FILE:</strong> {document.fileName}</p>
                    <p><strong>SECURITY WATERMARK:</strong> ST-OFFICIAL-VALIDATED</p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    [ OCR Extraction Pipeline Version 2.4 - Clean Document Scan Verified ]
                  </p>
                </div>
              </div>

              <div className="w-full text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
                <span>Page 1 of 1</span>
                <span>File size: {document.fileSizeMb} MB</span>
              </div>
            </div>
          </div>

          {/* Right Column: OCR Extractions & Findings */}
          <div className="md:col-span-5 p-5 overflow-y-auto bg-white space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Extracted OCR Field Data
              </h4>
              {document.extractions.length > 0 ? (
                <div className="space-y-2">
                  {document.extractions.map((field, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded border text-xs ${
                        field.isMatched
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-amber-50/70 border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-700 capitalize">{field.fieldName}</span>
                        {field.isMatched ? (
                          <span className="text-emerald-700 font-medium flex items-center space-x-1 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Match ({field.matchScore}%)</span>
                          </span>
                        ) : (
                          <span className="text-amber-800 font-medium flex items-center space-x-1 text-[11px]">
                            <AlertCircle className="w-3 h-3" />
                            <span>Variance ({field.matchScore}%)</span>
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Extracted:</span>
                          <span className="text-slate-900 font-medium">{field.extractedValue}</span>
                        </div>
                        {field.expectedValue && (
                          <div>
                            <span className="text-slate-400 block text-[10px]">Expected:</span>
                            <span className="text-slate-900 font-medium">{field.expectedValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No field extractions recorded for this file.</p>
              )}
            </div>

            {document.findings.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-2">
                  AI Flagged Variances ({document.findings.length})
                </h4>
                {document.findings.map((f) => (
                  <div key={f.id} className="p-3 bg-amber-50 border border-amber-200 rounded text-xs space-y-1">
                    <p className="font-semibold text-amber-900">{f.title}</p>
                    <p className="text-slate-700">{f.whyFlagged}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
