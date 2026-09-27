'use client';

import React, { useState, useEffect } from 'react';
import { pragatiStore } from '@/lib/data/storeService';
import { AuditLog } from '@/types';
import { History, Search, ShieldCheck, Download, Filter } from 'lucide-react';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLogs(pragatiStore.getAuditLogs());
    const unsub = pragatiStore.subscribe(() => {
      setLogs(pragatiStore.getAuditLogs());
    });
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resourceId.toLowerCase().includes(search.toLowerCase()) ||
      l.requestId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-teal-900" />
            <h1 className="font-serif text-2xl font-bold text-slate-900">Institutional System Audit Log</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable Request Traceability & Governance Log for Ministry Security Audit
          </p>
        </div>

        <button
          onClick={() => alert('Exporting signed audit logs JSON...')}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold px-3.5 py-1.5 rounded flex items-center space-x-1"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="institutional-card p-4 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit entries by action, actor, resource ID, or request trace ID..."
          className="w-full text-xs text-slate-900 focus:outline-none"
        />
      </div>

      {/* Audit Log Table */}
      <div className="institutional-card overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
            Audit Activity Trail ({filteredLogs.length} Events)
          </h3>
          <span className="text-xs font-mono text-slate-400">Security Standard: ISO 27001 compliant</span>
        </div>

        <table className="institutional-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor & Role</th>
              <th>Action</th>
              <th>Resource ID</th>
              <th>Reason / Details</th>
              <th>Request ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="font-mono text-slate-500 text-[11px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td>
                  <span className="font-semibold text-slate-900 block">{log.actor}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{log.actorRole}</span>
                </td>
                <td>
                  <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-mono font-semibold text-[11px]">
                    {log.action}
                  </span>
                </td>
                <td className="font-mono text-slate-800">{log.resourceId}</td>
                <td className="text-slate-600 max-w-xs leading-tight text-[11px]">{log.reason || '-'}</td>
                <td className="font-mono text-slate-400 text-[11px]">{log.requestId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
