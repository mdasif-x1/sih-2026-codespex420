'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { pragatiStore } from '@/lib/data/storeService';
import { Application, Scheme, FormFieldDefinition, DocumentRequirement, UploadedDocument } from '@/types';
import { ArrowLeft, ArrowRight, Save, Upload, FileCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function DynamicApplyPage() {
  const params = useParams();
  const router = useRouter();
  const schemeId = params?.schemeId as string;
  const scheme = pragatiStore.getSchemes().find((s) => s.id === schemeId);

  const activeVer = scheme?.versions.find((v) => v.versionId === scheme.currentVersionId) || scheme?.versions[0];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({
    applicantName: 'Aarav Kumar',
    applicantEmail: 'aarav.st.scholar@gmail.com',
    applicantPhone: '+91 98765 43210',
    stCertificateNo: 'ST/JH/2024/90821',
    instituteName: 'Indian Institute of Technology, Kharagpur',
    instituteCode: 'INST-IIT-KGP',
    courseName: 'Ph.D in Environmental Geosciences',
    academicYear: '2026-2027',
    marksPercentage: '74.5',
    annualFamilyIncome: '240000',
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; sizeMb: number; isUploading?: boolean }>>({
    doc_req_st_cert: { name: 'st_certificate_aarav.pdf', sizeMb: 1.4 },
    doc_req_income: { name: 'income_certificate_2026.pdf', sizeMb: 2.1 },
  });

  const [submitting, setSubmitting] = useState(false);

  if (!scheme || !activeVer) {
    return (
      <div className="institutional-card p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Scheme Unavailable</h2>
        <p className="text-xs text-slate-500">The selected scheme version is not published or active.</p>
        <Link href="/schemes" className="text-xs text-teal-800 underline">Return to catalog</Link>
      </div>
    );
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileUpload = (reqId: string, fileName: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [reqId]: { name: fileName, sizeMb: 1.5, isUploading: true },
    }));

    setTimeout(() => {
      setUploadedFiles((prev) => ({
        ...prev,
        [reqId]: { name: fileName, sizeMb: 1.5, isUploading: false },
      }));
    }, 1200);
  };

  const handleSubmitApplication = () => {
    setSubmitting(true);
    setTimeout(() => {
      const appId = `PRG-2026-00${Math.floor(200 + Math.random() * 800)}`;
      const newApp: Application = {
        id: appId,
        schemeId: scheme.id,
        schemeCode: scheme.code,
        schemeName: scheme.name,
        schemeVersionId: activeVer.versionId,
        applicantId: 'usr_app_aarav',
        applicantName: formData.applicantName || 'Aarav Kumar',
        applicantEmail: formData.applicantEmail || 'aarav.st.scholar@gmail.com',
        applicantPhone: formData.applicantPhone || '+91 98765 43210',
        stCertificateNo: formData.stCertificateNo || 'ST/JH/2024/90821',
        instituteName: formData.instituteName || 'IIT Kharagpur',
        instituteCode: formData.instituteCode || 'INST-IIT-KGP',
        courseName: formData.courseName || 'Ph.D Studies',
        academicYear: formData.academicYear || '2026-2027',
        marksPercentage: parseFloat(formData.marksPercentage) || 74.5,
        annualFamilyIncome: parseFloat(formData.annualFamilyIncome) || 240000,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stage: 'SUBMITTED',
        dynamicData: formData,
        documents: activeVer.documentRequirements.map((req, idx) => ({
          id: `doc_new_${idx}`,
          requirementId: req.id,
          documentType: req.type,
          fileName: uploadedFiles[req.id]?.name || `${req.type.toLowerCase()}_sample.pdf`,
          fileSizeMb: uploadedFiles[req.id]?.sizeMb || 1.5,
          fileUrl: '#',
          uploadedAt: new Date().toISOString(),
          status: 'VERIFIED',
          extractions: [
            { fieldName: 'name', extractedValue: formData.applicantName, matchScore: 100, isMatched: true },
          ],
          findings: [],
        })),
        aiFindings: [],
        ruleEvaluations: activeVer.eligibilityRules.map((r) => ({
          ruleId: r.id,
          ruleName: r.fieldLabel,
          category: r.category,
          expectedCondition: `${r.operator} ${r.value}`,
          observedValue: 'Compliant',
          result: 'PASS',
        })),
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: new Date().toISOString(),
            stage: 'SUBMITTED',
            actor: formData.applicantName || 'Applicant',
            actorRole: 'APPLICANT',
            title: 'Application Submitted',
            description: `Submitted dynamically using Scheme Configuration Version ${activeVer.versionTag}.`,
          },
        ],
      };

      pragatiStore.updateApplication(newApp, 'APPLICATION_SUBMIT', `Submitted new application for ${scheme.code}`);
      setSubmitting(false);
      router.push(`/applicant/applications/${appId}`);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="bg-slate-900 text-white text-[11px] font-mono px-2 py-0.5 rounded font-bold">
            {scheme.code} Form Renderer
          </span>
          <h1 className="font-serif text-2xl font-bold text-slate-900 mt-1">{scheme.name}</h1>
          <p className="text-xs text-slate-500">
            Scheme Configuration Version: <span className="font-mono text-slate-800">{activeVer.versionTag}</span>
          </p>
        </div>

        <Link href="/schemes" className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Form</span>
        </Link>
      </div>

      {/* Multi-step Container */}
      <div className="institutional-card p-6 sm:p-8 space-y-6">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
          <span>
            {step === 1 && 'Step 1 of 4: Personal & Academic Information'}
            {step === 2 && 'Step 2 of 4: Scheme-Specific Form Fields'}
            {step === 3 && 'Step 3 of 4: Mandatory Document Upload'}
            {step === 4 && 'Step 4 of 4: Final Declaration & Submission'}
          </span>
          <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-700 transition-all" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {/* STEP 1: Personal & Basic Information */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Applicant & Academic Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name (as per ST Certificate)</label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ST Caste Certificate Number</label>
                <input
                  type="text"
                  value={formData.stCertificateNo}
                  onChange={(e) => handleInputChange('stCertificateNo', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-mono font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  value={formData.instituteName}
                  onChange={(e) => handleInputChange('instituteName', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course / Programme</label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => handleInputChange('courseName', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualifying Marks (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.marksPercentage}
                  onChange={(e) => handleInputChange('marksPercentage', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-mono font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={formData.annualFamilyIncome}
                  onChange={(e) => handleInputChange('annualFamilyIncome', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-mono font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Scheme-Specific Fields */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Scheme Specific Fields (Configured in SchemeVersion {activeVer.versionTag})
            </h3>

            {activeVer.formFields.map((field: FormFieldDefinition) => (
              <div key={field.id} className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  {field.label} {field.required && <span className="text-rose-600">*</span>}
                </label>
                {field.fieldType === 'number' ? (
                  <input
                    type="number"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-900"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2.5 border border-slate-300 rounded text-slate-900"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: Mandatory Document Upload */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Mandatory Document Upload (PDF / JPG)
            </h3>

            <div className="space-y-3">
              {activeVer.documentRequirements.map((req: DocumentRequirement) => {
                const file = uploadedFiles[req.id];
                return (
                  <div key={req.id} className="p-4 border border-slate-200 rounded bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{req.label}</span>
                        {req.required && <span className="text-rose-600 font-bold">*</span>}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{req.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {file ? (
                        <div className="flex items-center space-x-2 bg-white border border-emerald-300 px-3 py-1.5 rounded">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-mono text-slate-800 text-[11px]">{file.name}</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold px-3 py-1.5 rounded inline-flex items-center space-x-1.5">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const name = e.target.files?.[0]?.name || `${req.type.toLowerCase()}_scan.pdf`;
                              handleFileUpload(req.id, name);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Review Summary & Declaration
            </h3>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded space-y-2 font-mono">
              <p><strong>Applicant Name:</strong> {formData.applicantName}</p>
              <p><strong>ST Certificate:</strong> {formData.stCertificateNo}</p>
              <p><strong>Institution:</strong> {formData.instituteName}</p>
              <p><strong>Marks Percentage:</strong> {formData.marksPercentage}%</p>
              <p><strong>Annual Income:</strong> ₹{formData.annualFamilyIncome}</p>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded text-teal-900 text-[11px] space-y-1">
              <span className="font-bold block">Declaration</span>
              <p>
                I hereby declare that all information furnished is true to the best of my knowledge. I understand that AI OCR verification and human officer audit will cross-verify my submitted documents against state revenue databases.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs text-slate-700 font-medium border border-slate-300 px-3 py-2 rounded hover:bg-slate-50"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center space-x-1 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-2 rounded"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitApplication}
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded shadow-xs"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
              <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
