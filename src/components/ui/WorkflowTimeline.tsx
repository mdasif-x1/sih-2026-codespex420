import React from 'react';
import { ApplicationStage, ApplicationTimelineEvent } from '@/types';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface WorkflowTimelineProps {
  currentStage: ApplicationStage;
  timeline?: ApplicationTimelineEvent[];
}

const ALL_STAGES: { id: ApplicationStage; label: string }[] = [
  { id: 'SUBMITTED', label: 'Submitted' },
  { id: 'DOCUMENT_CHECK', label: 'Document Check' },
  { id: 'INSTITUTE_VERIFICATION', label: 'Institute Check' },
  { id: 'OFFICER_REVIEW', label: 'Officer Review' },
  { id: 'SELECTION', label: 'Selection Board' },
  { id: 'DISBURSEMENT_PENDING', label: 'DBT Disbursement' },
];

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ currentStage, timeline = [] }) => {
  const getStageIndex = (stage: ApplicationStage): number => {
    switch (stage) {
      case 'SUBMITTED': return 0;
      case 'DOCUMENT_CHECK':
      case 'DEFICIENCY': return 1;
      case 'INSTITUTE_VERIFICATION': return 2;
      case 'OFFICER_REVIEW': return 3;
      case 'SELECTION':
      case 'HUMAN_APPROVAL':
      case 'SELECTED': return 4;
      case 'DISBURSEMENT_PENDING':
      case 'DISBURSED': return 5;
      default: return 0;
    }
  };

  const currentIdx = getStageIndex(currentStage);
  const isDeficiency = currentStage === 'DEFICIENCY';

  return (
    <div className="w-full py-2 space-y-5">
      {/* Horizontal Stage Tracker for Desktop */}
      <div className="hidden md:flex items-center justify-between relative px-2">
        <div className="absolute top-3.5 left-8 right-8 h-0.5 bg-slate-200 -z-0" />
        {ALL_STAGES.map((s, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          let circleStyle = 'bg-white border-2 border-slate-300 text-slate-400';
          let labelStyle = 'text-slate-500 font-normal';

          if (isCompleted) {
            circleStyle = 'bg-emerald-700 border-2 border-emerald-700 text-white';
            labelStyle = 'text-emerald-950 font-semibold';
          } else if (isCurrent) {
            if (isDeficiency) {
              circleStyle = 'bg-amber-600 border-2 border-amber-700 text-white';
              labelStyle = 'text-amber-950 font-bold';
            } else {
              circleStyle = 'bg-teal-800 border-2 border-teal-900 text-white shadow-xs';
              labelStyle = 'text-teal-950 font-bold';
            }
          }

          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center text-center max-w-[110px]">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${circleStyle}`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent && isDeficiency ? (
                  <AlertCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <Circle className="w-3 h-3 fill-current" />
                ) : (
                  <span className="text-[11px] font-semibold">{idx + 1}</span>
                )}
              </div>
              <span className={`text-[11px] mt-1.5 leading-tight ${labelStyle}`}>
                {isCurrent && isDeficiency ? 'Action Required' : s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Log Timeline */}
      {timeline.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Audit Activity Trail
          </h4>
          <div className="space-y-2 border-l-2 border-slate-200 ml-1.5 pl-3.5">
            {timeline.map((event) => (
              <div key={event.id} className="relative text-xs space-y-0.5 pb-2">
                <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-teal-800" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{event.title}</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{event.description}</p>
                <div className="text-[10px] text-slate-500 font-mono pt-0.5">
                  Actor: {event.actor} ({event.actorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
