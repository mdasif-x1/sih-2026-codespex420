'use client';

import React, { useState, useEffect } from 'react';
import { pragatiStore } from '@/lib/data/storeService';
import { Scheme, SchemeVersion, EligibilityRule } from '@/types';
import { Plus, CheckCircle2, Lock } from 'lucide-react';

export default function AdminSchemeBuilderPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme_nfst');
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'fields' | 'versioning'>('overview');

  const [newRule, setNewRule] = useState({
    fieldLabel: 'Minimum Qualifying Marks',
    operator: 'GREATER_THAN_OR_EQUAL' as const,
    value: '60',
    errorMessage: 'Minimum qualifying percentage requirement.',
    category: 'ACADEMIC' as const,
  });

  const [publishedNotification, setPublishedNotification] = useState<string | null>(null);

  useEffect(() => {
    setSchemes(pragatiStore.getSchemes());
    const unsub = pragatiStore.subscribe(() => {
      setSchemes(pragatiStore.getSchemes());
    });
    return () => unsub();
  }, []);

  const currentScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];
  const activeVer = currentScheme?.versions.find((v) => v.versionId === currentScheme.currentVersionId) || currentScheme?.versions[0];

  const handleCreateNewVersion = () => {
    if (!currentScheme || !activeVer) return;

    const newTag = `2026.${currentScheme.versions.length + 1}`;
    const newVerId = `ver_${currentScheme.code.toLowerCase()}_${newTag.replace('.', '_')}`;

    const clonedVer: SchemeVersion = {
      ...activeVer,
      versionId: newVerId,
      versionTag: newTag,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      publishedBy: 'Dr. V. K. Meena (Joint Secretary)',
    };

    const updatedSchemes = schemes.map((s) => {
      if (s.id === currentScheme.id) {
        return {
          ...s,
          currentVersionId: newVerId,
          versions: [clonedVer, ...s.versions],
        };
      }
      return s;
    });

    pragatiStore.saveSchemes(updatedSchemes);
    pragatiStore.addAuditLog({
      action: 'SCHEME_PUBLISH',
      resource: 'SchemeVersion',
      resourceId: newVerId,
      reason: `Created and published immutable scheme version ${newTag} for ${currentScheme.code}`,
    });

    setPublishedNotification(`Published immutable Scheme Version ${newTag} successfully!`);
    setTimeout(() => setPublishedNotification(null), 4000);
  };

  const handleAddRule = () => {
    if (!currentScheme || !activeVer) return;
    const ruleItem: EligibilityRule = {
      id: `rule_ui_${Date.now()}`,
      field: newRule.fieldLabel.toLowerCase().replace(/\s+/g, '_'),
      fieldLabel: newRule.fieldLabel,
      operator: newRule.operator,
      value: newRule.value,
      errorMessage: newRule.errorMessage,
      category: newRule.category,
    };

    const updatedVer: SchemeVersion = {
      ...activeVer,
      eligibilityRules: [...activeVer.eligibilityRules, ruleItem],
    };

    const updatedSchemes = schemes.map((s) => {
      if (s.id === currentScheme.id) {
        return {
          ...s,
          versions: s.versions.map((v) => (v.versionId === activeVer.versionId ? updatedVer : v)),
        };
      }
      return s;
    });

    pragatiStore.saveSchemes(updatedSchemes);
    pragatiStore.addAuditLog({
      action: 'RULE_CHANGE',
      resource: 'EligibilityRule',
      resourceId: ruleItem.id,
      reason: `Added new rule [${ruleItem.fieldLabel}] to scheme ${currentScheme.code}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DFDC] pb-3">
        <div>
          <h1 className="page-header-title">Scheme Rule & Version Configurator</h1>
          <p className="page-header-subtitle">
            Configure dynamic rules, form definitions, and document requirements across schemes.
          </p>
        </div>

        {/* Scheme Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-[#5E6865]">Active Scheme:</span>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="p-1.5 border border-[#D9DFDC] rounded bg-white text-xs font-bold text-[#17201F]"
          >
            {schemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} ({s.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {publishedNotification && (
        <div className="p-3 bg-[#E6F4F1] text-[#075E54] border border-[#B5CECA] rounded text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#075E54]" />
          <span>{publishedNotification}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-[#D9DFDC] text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-[#075E54] text-[#075E54] font-semibold' : 'border-transparent text-[#5E6865] hover:text-[#17201F]'
          }`}
        >
          Scheme Parameters
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-2 border-b-2 transition-colors ${
            activeTab === 'rules' ? 'border-[#075E54] text-[#075E54] font-semibold' : 'border-transparent text-[#5E6865] hover:text-[#17201F]'
          }`}
        >
          Eligibility Rules ({activeVer?.eligibilityRules.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('fields')}
          className={`px-3 py-2 border-b-2 transition-colors ${
            activeTab === 'fields' ? 'border-[#075E54] text-[#075E54] font-semibold' : 'border-transparent text-[#5E6865] hover:text-[#17201F]'
          }`}
        >
          Dynamic Form Fields
        </button>
        <button
          onClick={() => setActiveTab('versioning')}
          className={`px-3 py-2 border-b-2 transition-colors ${
            activeTab === 'versioning' ? 'border-[#075E54] text-[#075E54] font-semibold' : 'border-transparent text-[#5E6865] hover:text-[#17201F]'
          }`}
        >
          Immutable Versions ({currentScheme?.versions.length || 1})
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && activeVer && (
        <div className="institutional-card p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#EBEFEF] pb-3">
            <div>
              <span className="bg-[#17201F] text-white font-mono font-bold px-2 py-0.5 rounded">
                {currentScheme.code}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#17201F] mt-1">{currentScheme.name}</h3>
            </div>
            <span className="bg-[#F0F6F5] text-[#075E54] border border-[#B5CECA] px-2.5 py-1 rounded font-mono font-medium">
              Version {activeVer.versionTag} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#17201F] mb-1">Target Group</label>
              <input type="text" readOnly value={currentScheme.targetCategory} className="w-full p-2 border border-[#D9DFDC] rounded bg-[#F3F4F1] text-[#17201F]" />
            </div>
            <div>
              <label className="block font-semibold text-[#17201F] mb-1">Ministry Division</label>
              <input type="text" readOnly value={currentScheme.ministry} className="w-full p-2 border border-[#D9DFDC] rounded bg-[#F3F4F1] text-[#17201F]" />
            </div>
            <div>
              <label className="block font-semibold text-[#17201F] mb-1">Selection Method</label>
              <input type="text" readOnly value={activeVer.selectionMethod} className="w-full p-2 border border-[#D9DFDC] rounded bg-[#F3F4F1] text-[#17201F] font-mono" />
            </div>
            <div>
              <label className="block font-semibold text-[#17201F] mb-1">Max Family Income Limit</label>
              <input type="text" readOnly value={`₹ ${(activeVer.maxFamilyIncome || 600000).toLocaleString('en-IN')}`} className="w-full p-2 border border-[#D9DFDC] rounded bg-[#F3F4F1] text-[#17201F] font-mono" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Rules Builder */}
      {activeTab === 'rules' && activeVer && (
        <div className="space-y-6">
          <div className="institutional-section overflow-hidden">
            <div className="bg-[#F3F4F1] px-5 py-3 border-b border-[#D9DFDC] flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[#17201F] uppercase tracking-wider">
                Active Eligibility Rules ({currentScheme.code} v{activeVer.versionTag})
              </h3>
            </div>

            <table className="institutional-table">
              <thead>
                <tr>
                  <th>Rule ID</th>
                  <th>Field Label</th>
                  <th>Operator</th>
                  <th>Value</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {activeVer.eligibilityRules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="font-mono text-[#838E8A]">{rule.id}</td>
                    <td className="font-semibold text-[#17201F]">{rule.fieldLabel}</td>
                    <td className="font-mono text-[#075E54] bg-[#F0F6F5] px-2 py-0.5 rounded">{rule.operator}</td>
                    <td className="font-mono text-[#17201F]">{String(rule.value)}</td>
                    <td><span className="bg-[#F3F4F1] text-[#5E6865] px-2 py-0.5 rounded font-mono text-[11px]">{rule.category}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Append New Rule */}
          <div className="institutional-card p-5 space-y-4 text-xs">
            <h4 className="font-serif font-bold text-sm text-[#17201F] border-b border-[#EBEFEF] pb-2 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-[#075E54]" />
              <span>Append New Eligibility Rule</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#17201F] mb-1">Field Label</label>
                <input
                  type="text"
                  value={newRule.fieldLabel}
                  onChange={(e) => setNewRule({ ...newRule, fieldLabel: e.target.value })}
                  className="w-full p-2 border border-[#D9DFDC] rounded font-medium text-[#17201F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17201F] mb-1">Operator</label>
                <select
                  value={newRule.operator}
                  onChange={(e) => setNewRule({ ...newRule, operator: e.target.value as any })}
                  className="w-full p-2 border border-[#D9DFDC] rounded bg-white font-mono text-[#17201F]"
                >
                  <option value="EQUALS">EQUALS</option>
                  <option value="GREATER_THAN_OR_EQUAL">GREATER_THAN_OR_EQUAL (&ge;)</option>
                  <option value="LESS_THAN_OR_EQUAL">LESS_THAN_OR_EQUAL (&le;)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17201F] mb-1">Threshold Value</label>
                <input
                  type="text"
                  value={newRule.value}
                  onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                  className="w-full p-2 border border-[#D9DFDC] rounded font-mono text-[#17201F]"
                />
              </div>
            </div>

            <button
              onClick={handleAddRule}
              className="btn-primary text-xs py-2 px-4"
            >
              Add Rule to Draft
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Versioning */}
      {activeTab === 'versioning' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9DFDC] pb-2">
            <h3 className="font-serif font-bold text-base text-[#17201F]">Immutable Version Registry</h3>
            <button
              onClick={handleCreateNewVersion}
              className="btn-primary text-xs py-2 px-4 space-x-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Clone & Publish New Version</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentScheme?.versions.map((ver) => (
              <div key={ver.versionId} className="institutional-card p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#17201F] text-sm">Version {ver.versionTag}</span>
                    <span className="bg-[#F0F6F5] text-[#075E54] border border-[#B5CECA] px-2 py-0.5 rounded font-mono">
                      {ver.status}
                    </span>
                  </div>
                  <p className="text-[#5E6865] text-[11px] mt-1">
                    Published: {ver.publishedAt ? new Date(ver.publishedAt).toLocaleDateString() : 'N/A'} by {ver.publishedBy}
                  </p>
                </div>
                <span className="font-mono text-[#838E8A] text-[11px]">Rules: {ver.eligibilityRules.length}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

