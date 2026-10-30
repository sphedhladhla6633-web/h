import React, { useState } from 'react';
import { Wrench, AlertCircle, CheckCircle, ChevronDown, ChevronUp, ZoomIn, Search, Activity, HelpCircle } from 'lucide-react';
import { TROUBLESHOOT_GUIDES, TroubleshootItem } from '../data/fieldGuideData';
import { FIELD_GUIDE_IMAGES } from '../data/fieldGuideImages';

interface TroubleshootSectionProps {
  onOpenLightbox: (src: string, title: string, tag?: string) => void;
}

export const TroubleshootSection: React.FC<TroubleshootSectionProps> = ({ onOpenLightbox }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('pulse-not-counting');
  const [wizardSymptom, setWizardSymptom] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredGuides = TROUBLESHOOT_GUIDES.filter(g => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      g.symptom.toLowerCase().includes(q) ||
      g.component.toLowerCase().includes(q) ||
      g.likelyCause.toLowerCase().includes(q) ||
      g.solution.toLowerCase().includes(q) ||
      g.steps.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Quick Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-500" />
              <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                Fault-Finding &amp; Technical Fixes
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified solutions from installer field notes for boards, pulse counters, relays, and power.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter symptoms (e.g. Zener)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Quick Diagnostic Triage Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Instant Fault Triage:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Pulse doesn’t count', targetId: 'pulse-not-counting' },
              { label: 'Relay doesn’t click (24V)', targetId: 'relay-no-click-24v' },
              { label: 'Pump won’t activate', targetId: 'pump-wont-activate' },
              { label: 'Eltomatic no pulses', targetId: 'eltomatic-not-counting' },
              { label: 'Sluggish / Rebooting', targetId: 'unit-not-working' },
              { label: 'Oscilloscope check', targetId: 'oscilloscope-testing' }
            ].map(pill => (
              <button
                key={pill.targetId}
                onClick={() => {
                  setExpandedId(pill.targetId);
                  const el = document.getElementById(pill.targetId);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-slate-700 transition-colors"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Oscilloscope Mini-Guide Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 md:p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white">
              Oscilloscope Diagnostics Quick Rules
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Connect <strong>Black (Negative)</strong> to an earth ground. Place <strong>Positive probe</strong> on test node. Set timebase to <strong>500ms cycle</strong>, voltage scale to <strong>1V/div</strong>. Look for baseline stability and watch for transient inductive spikes when relays de-energize.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setExpandedId('oscilloscope-testing');
            document.getElementById('oscilloscope-testing')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 whitespace-nowrap shrink-0 transition-colors"
        >
          View Scope Setup
        </button>
      </div>

      {/* Troubleshooting Guides List */}
      <div className="space-y-3.5">
        {filteredGuides.map(guide => {
          const isExpanded = expandedId === guide.id;
          const imageSrc = guide.imageKey ? FIELD_GUIDE_IMAGES[guide.imageKey] : null;

          return (
            <div
              key={guide.id}
              id={guide.id}
              className={`border rounded-2xl overflow-hidden transition-all shadow-sm ${
                isExpanded
                  ? 'bg-white dark:bg-slate-900 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <button
                type="button"
                onClick={() => toggleExpand(guide.id)}
                className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                      {guide.symptom}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Component: <strong className="text-slate-700 dark:text-slate-300">{guide.component}</strong>
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Card Body */}
              {isExpanded && (
                <div className="px-4 pb-5 md:px-5 pt-1 space-y-3.5 border-t border-slate-100 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 animate-in fade-in duration-150">
                  {/* Likely Cause */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block mb-1">
                      Root Cause:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{guide.likelyCause}</p>
                  </div>

                  {/* Resolution Steps */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Recommended Fix Steps:
                    </span>
                    <ol className="space-y-1.5 pl-4 list-decimal marker:text-amber-500 marker:font-bold">
                      {guide.steps.map((st, idx) => (
                        <li key={idx} className="pl-1">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Diagram Thumbnail if available */}
                  {imageSrc && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Related Board Schematic
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <ZoomIn className="w-3.5 h-3.5" /> Tap to view
                        </span>
                      </div>
                      <div
                        onClick={() => onOpenLightbox(imageSrc, guide.symptom, 'DIAGNOSTIC')}
                        className="cursor-zoom-in rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-52 bg-white"
                      >
                        <img
                          src={imageSrc}
                          alt={guide.symptom}
                          className="w-full h-auto object-contain max-h-52 mx-auto hover:scale-102 transition-transform"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
