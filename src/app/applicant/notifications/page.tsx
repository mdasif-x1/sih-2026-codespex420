'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { pragatiStore } from '@/lib/data/storeService';
import { Application } from '@/types';
import { Bell, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function NotificationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications(pragatiStore.getApplications());
    const unsub = pragatiStore.subscribe(() => {
      setApplications(pragatiStore.getApplications());
    });
    return () => unsub();
  }, []);

  const applicantApps = applications.filter((a) => a.applicantId === 'usr_app_aarav');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <Bell className="w-5 h-5 text-teal-900" />
        <h1 className="font-serif text-2xl font-bold text-slate-900">Applicant Notifications</h1>
      </div>

      <div className="space-y-3">
        {applicantApps.map((app) => {
          const hasDeficiency = app.stage === 'DEFICIENCY';
          return (
            <div
              key={app.id}
              className={`institutional-card p-5 space-y-2 text-xs ${
                hasDeficiency ? 'bg-amber-50/70 border-amber-300' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-mono">{app.id}</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {new Date(app.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">{app.schemeName}</h3>

              {hasDeficiency ? (
                <div className="space-y-2 pt-1">
                  <p className="text-amber-900 font-medium">
                    <strong className="font-semibold text-amber-950">Action Required: </strong>
                    {app.deficiency?.problemDescription || 'Document deficiency raised.'}
                  </p>
                  <Link
                    href={`/applicant/applications/${app.id}`}
                    className="inline-flex items-center space-x-1 bg-amber-800 hover:bg-amber-900 text-white font-semibold px-3 py-1.5 rounded"
                  >
                    <span>Resubmit Document</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <p className="text-slate-600">
                  Application stage updated to: <strong className="font-semibold">{app.stage}</strong>.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
