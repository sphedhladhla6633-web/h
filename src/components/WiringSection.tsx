import React, { useState } from 'react';
import { Zap, AlertTriangle, Info, ChevronDown, ChevronUp, Layers, ZoomIn } from 'lucide-react';
import { TERMINAL_LIST, WIRING_GUIDES, TerminalItem, WiringGuideItem } from '../data/fieldGuideData';
import { FIELD_GUIDE_IMAGES } from '../data/fieldGuideImages';

interface WiringSectionProps {
  onOpenLightbox: (src: string, title: string, tag?: string) => void;
}

export const WiringSection: React.FC<WiringSectionProps> = ({ onOpenLightbox }) => {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [terminalFilter, setTerminalFilter] = useState<'ALL' | 'DC' | 'AC' | 'PULSE'>('ALL');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>('dc-install');

  const selectedTerminal = TERMINAL_LIST.find(t => t.pin === selectedPin);

  const isPinActiveInFilter = (pin: number) => {
    if (terminalFilter === 'ALL') return true;
    if (terminalFilter === 'DC') return [3, 4, 5, 6, 8, 9, 10, 12].includes(pin);
    if (terminalFilter === 'AC') return [1, 2, 3, 4, 5, 11, 12].includes(pin);
    if (terminalFilter === 'PULSE') return [9, 10, 11, 12].includes(pin);
    return true;
  };

  const toggleGuide = (id: string) => {
    setExpandedGuideId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      {/* Safety Warning */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-900 dark:text-red-200">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm">
          <span className="font-bold">Electrical Hazard Warning: </span>
          Always isolate electrical power before touching terminal strips or junction board components. Emergency stopper wires are <strong>both positive</strong>.
        </div>
      </div>

      {/* Interactive 12-Pin Terminal Strip Explorer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                Interactive 12-Pin Terminal Strip
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tap any terminal pin to inspect electrical assignment, wire destination, and AC vs DC usage.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            {(['ALL', 'DC', 'AC', 'PULSE'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setTerminalFilter(mode)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  terminalFilter === mode
                    ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* 12-Pin Terminal Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {TERMINAL_LIST.map(t => {
            const isMatch = isPinActiveInFilter(t.pin);
            const isSelected = selectedPin === t.pin;

            let badgeColor = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
            if (t.category === 'power') badgeColor = 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300';
            if (t.category === 'control') badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
            if (t.category === 'sensor') badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';

            return (
              <button
                key={t.pin}
                onClick={() => setSelectedPin(t.pin)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/10 shadow-md scale-105 z-10'
                    : isMatch
                    ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                    : 'opacity-35 border-dashed border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400">PIN {t.pin}</span>
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
                  {t.label}
                </span>
                <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded mt-1.5 ${badgeColor}`}>
                  {t.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Terminal Details Card */}
        {selectedTerminal ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 animate-in fade-in duration-150 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 text-sm font-extrabold flex items-center justify-center">
                  {selectedTerminal.pin}
                </span>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                  Terminal {selectedTerminal.pin}: {selectedTerminal.label} — {selectedTerminal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close details
              </button>
            </div>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
              {selectedTerminal.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                <span className="font-bold text-blue-700 dark:text-blue-300 block mb-0.5">DC Configuration:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedTerminal.dcUsage}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50/80 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40">
                <span className="font-bold text-red-700 dark:text-red-300 block mb-0.5">AC Configuration:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedTerminal.acUsage}</span>
              </div>
            </div>

            {selectedTerminal.notes && (
              <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 pt-1">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>Field Tip:</strong> {selectedTerminal.notes}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center italic">
            Select a terminal pin above to view wiring specifications.
          </p>
        )}
      </div>

      {/* Terminal List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
            Quick Reference Terminal Table
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3 w-16">Pin #</th>
                <th className="py-2.5 px-3 w-28">Label</th>
                <th className="py-2.5 px-3">Designation &amp; Field Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TERMINAL_LIST.map(t => (
                <tr
                  key={t.pin}
                  onClick={() => setSelectedPin(t.pin)}
                  className={`cursor-pointer transition-colors ${
                    selectedPin === t.pin
                      ? 'bg-amber-50/70 dark:bg-amber-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {t.pin}
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{t.label}</span>
                  </td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">{t.name}</span> — {t.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9 Technical Wiring Procedures Accordions */}
      <div className="space-y-4">
        <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
          Wiring &amp; Interface Procedures
        </h2>

        {WIRING_GUIDES.map(guide => {
          const isExpanded = expandedGuideId === guide.id;
          const imageSrc = guide.imageKey ? FIELD_GUIDE_IMAGES[guide.imageKey] : null;

          return (
            <div
              key={guide.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleGuide(guide.id)}
                className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded shrink-0 ${
                      guide.system === 'AC'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : guide.system === 'DC'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {guide.system}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                    {guide.title}
                  </h3>
                </div>
                <div className="shrink-0 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="px-4 pb-5 md:px-5 pt-1 space-y-4 border-t border-slate-100 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 animate-in fade-in duration-150">
                  <p className="text-slate-600 dark:text-slate-400">{guide.summary}</p>

                  {/* Bullet Points */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-700/50">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      Wiring Connections:
                    </span>
                    <ul className="space-y-1.5">
                      {guide.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes & Critical Warnings */}
                  {guide.notes && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-900 dark:text-amber-300 text-xs">
                      <span className="font-bold">Important Field Note: </span>
                      {guide.notes}
                    </div>
                  )}

                  {/* Schematic Diagram Preview (Click to Zoom) */}
                  {imageSrc && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {guide.imageCaption || 'Schematic Diagram'}
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <ZoomIn className="w-3.5 h-3.5" /> Tap image to enlarge
                        </span>
                      </div>
                      <div
                        onClick={() =>
                          onOpenLightbox(imageSrc, guide.imageCaption || guide.title, guide.system)
                        }
                        className="relative group cursor-zoom-in rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white"
                      >
                        <img
                          src={imageSrc}
                          alt={guide.imageCaption || guide.title}
                          className="w-full h-auto max-h-80 object-contain mx-auto group-hover:scale-101 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-lg bg-black/75 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            View Fullscreen
                          </span>
                        </div>
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
