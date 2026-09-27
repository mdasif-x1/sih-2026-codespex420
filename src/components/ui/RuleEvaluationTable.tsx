import React from 'react';
import { RuleEvaluationResult } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface RuleEvaluationTableProps {
  rules: RuleEvaluationResult[];
}

export const RuleEvaluationTable: React.FC<RuleEvaluationTableProps> = ({ rules }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <h4 className="font-semibold text-slate-900">Deterministic Eligibility Rules Engine Evaluation</h4>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
          Rules Engine v2026.1
        </span>
      </div>

      <table className="institutional-table">
        <thead>
          <tr>
            <th>Rule Name</th>
            <th>Category</th>
            <th>Expected Condition</th>
            <th>Observed Value</th>
            <th>Evaluation</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => {
            let badge = (
              <span className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>PASS</span>
              </span>
            );

            if (rule.result === 'FAIL') {
              badge = (
                <span className="inline-flex items-center space-x-1 text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-medium">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>FAIL</span>
                </span>
              );
            } else if (rule.result === 'REVIEW') {
              badge = (
                <span className="inline-flex items-center space-x-1 text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>REVIEW REQUIRED</span>
                </span>
              );
            }

            return (
              <tr key={rule.ruleId}>
                <td className="font-medium text-slate-900">{rule.ruleName}</td>
                <td>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                    {rule.category}
                  </span>
                </td>
                <td className="text-slate-600 font-mono">{rule.expectedCondition}</td>
                <td className="text-slate-900 font-mono">{rule.observedValue}</td>
                <td>{badge}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
