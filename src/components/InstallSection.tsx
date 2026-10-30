import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertCircle, ChevronDown, ChevronUp, RotateCcw, ArrowRight, ShieldCheck, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { INSTALL_STEPS, InstallStep } from '../data/fieldGuideData';
import { VoiceReader } from '../utils/speechUtils';

interface InstallSectionProps {
  ticks: Record<string, boolean>;
  onToggleTick: (key: string, checked: boolean) => void;
  onClearTicks: (prefix: string) => void;
  onNavigateToTab: (tabIndex: number) => void;
  fontSize?: 'normal' | 'large' | 'xlarge';
  onOpenPhoneModal?: () => void;
}

export const InstallSection: React.FC<InstallSectionProps> = ({
  ticks,
  onToggleTick,
  onClearTicks,
  onNavigateToTab,
  fontSize = 'normal',
  onOpenPhoneModal
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(VoiceReader.getIsSpeaking());
  const [speakingStepId, setSpeakingStepId] = useState<number | null>(null);

  const STEP_SVG_BG_COLORS: Record<number, string> = {
    1: '#171616',
    2: '#100f0f',
    3: '#171515',
    4: '#080808',
    5: '#100e0e'
  };

  useEffect(() => {
    return VoiceReader.subscribe((speaking) => {
      setIsSpeaking(speaking);
      if (!speaking) setSpeakingStepId(null);
    });
  }, []);

  const totalSteps = INSTALL_STEPS.length;
  const completedCount = INSTALL_STEPS.filter(s => ticks[`i${s.id - 1}`]).length;
  const percentComplete = Math.round((completedCount / totalSteps) * 100);

  const categories = ['All', 'Planning', 'Hardware', 'Electrical', 'Testing', 'Handover'];

  const filteredSteps = selectedCategory === 'All'
    ? INSTALL_STEPS
    : INSTALL_STEPS.filter(s => s.category === selectedCategory);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleReadSafetyAloud = () => {
    const textToRead = "Safety Culture Protocol: Always isolate electrical power before opening junction enclosures. Complete Step 2 inspection on Safety Culture before commencing hardware installation. Work completed, when left everything was good.";
    if (isSpeaking && speakingStepId === 0) {
      VoiceReader.stop();
      setSpeakingStepId(null);
    } else {
      setSpeakingStepId(0);
      VoiceReader.speak(textToRead, () => setSpeakingStepId(null));
    }
  };

  const handleReadStepAloud = (step: InstallStep, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToRead = `Step ${step.id}. ${step.title}. ${step.detail}. ${step.safetyNote ? `Safety note: ${step.safetyNote}` : ''}`;
    if (isSpeaking && speakingStepId === step.id) {
      VoiceReader.stop();
      setSpeakingStepId(null);
    } else {
      setSpeakingStepId(step.id);
      VoiceReader.speak(textToRead, () => setSpeakingStepId(null));
    }
  };

  // Font size classes
  const fontClass = fontSize === 'xlarge' ? 'text-lg md:text-xl' : fontSize === 'large' ? 'text-base md:text-lg' : 'text-sm md:text-base';
  const detailFontClass = fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs md:text-sm';

  return (
    <div className="space-y-6">
      {/* Top Banner Notice (CSS selector 1 target) */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className={detailFontClass}>
            <span className="font-bold">Safety Culture Protocol: </span>
            Always isolate electrical power before opening junction enclosures. Complete Step 2 inspection on Safety Culture before commencing hardware installation.
          </div>
        </div>

        {/* Phone Read Aloud & Mobile Assistant Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-8 sm:pl-0">
          <button
            onClick={handleReadSafetyAloud}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isSpeaking && speakingStepId === 0
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
            title="Listen to safety protocol with your phone"
            aria-label="Read safety protocol aloud"
          >
            {isSpeaking && speakingStepId === 0 ? (
              <>
                <VolumeX className="w-4 h-4" /> Stop Voice
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Read Aloud to Phone
              </>
            )}
          </button>

          {onOpenPhoneModal && (
            <button
              onClick={onOpenPhoneModal}
              className="p-1.5 rounded-xl border border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Open QR code & phone reader options"
              aria-label="Phone reader options"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Category Controls Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Installation Checklist
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {completedCount} of {totalSteps} done ({percentComplete}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Follow chronological sequence from pre-site assessment to client handover.
            </p>
          </div>

          {/* Reset Button */}
          {completedCount > 0 && (
            <div>
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:border-red-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Ticks
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-500 font-medium">Clear all?</span>
                  <button
                    onClick={() => {
                      onClearTicks('i');
                      setShowConfirmReset(false);
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded bg-red-600 text-white hover:bg-red-500 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visual Progress Bar */}
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {filteredSteps.map(step => {
          const key = `i${step.id - 1}`;
          const isChecked = !!ticks[key];
          const isExpanded = expandedId === step.id;

          return (
            <div
              key={step.id}
              className={`border rounded-2xl transition-all ${
                isChecked
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="p-4 flex items-start gap-3.5">
                {/* Checkbox Trigger */}
                <button
                  type="button"
                  onClick={() => onToggleTick(key, !isChecked)}
                  className="mt-0.5 shrink-0 focus:outline-none"
                  aria-label={`Mark step ${step.id} as ${isChecked ? 'incomplete' : 'complete'}`}
                >
                  {isChecked ? (
                    <CheckCircle2
                      style={STEP_SVG_BG_COLORS[step.id] ? { backgroundColor: STEP_SVG_BG_COLORS[step.id], borderRadius: '50%' } : undefined}
                      className="w-6 h-6 text-emerald-400 fill-emerald-950 p-0.5"
                    />
                  ) : (
                    <Circle
                      style={STEP_SVG_BG_COLORS[step.id] ? { backgroundColor: STEP_SVG_BG_COLORS[step.id], borderRadius: '50%' } : undefined}
                      className="w-6 h-6 text-slate-400 hover:text-slate-300 p-0.5"
                    />
                  )}
                </button>

                {/* Step Content */}
                <div className="flex-1 min-w-0" onClick={() => toggleExpand(step.id)}>
                  <div className="flex flex-wrap items-center gap-2 cursor-pointer">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {step.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {step.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <p
                      className={`${fontClass} font-semibold cursor-pointer ${
                        isChecked
                          ? 'text-slate-500 dark:text-slate-400 line-through'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {step.title}
                    </p>
                    <button
                      type="button"
                      onClick={e => handleReadStepAloud(step, e)}
                      className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                        isSpeaking && speakingStepId === step.id
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Read this step aloud to phone"
                      aria-label={`Read step ${step.id} aloud`}
                    >
                      {isSpeaking && speakingStepId === step.id ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Expandable Details Preview */}
                  {isExpanded && (
                    <div className={`mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 ${detailFontClass} text-slate-600 dark:text-slate-300 animate-in fade-in duration-150`}>
                      <p>{step.detail}</p>
                      {step.safetyNote && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                          <span>{step.safetyNote}</span>
                        </div>
                      )}

                      {/* Helpful Quick Navigation Links */}
                      {step.id === 8 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onNavigateToTab(1); // Wiring tab
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline pt-1"
                        >
                          Open Wiring &amp; Terminal Diagrams <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(step.id === 10 || step.id === 11) && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onNavigateToTab(3); // Calibration tab
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline pt-1"
                        >
                          Open Calibration Calculators &amp; Secret Menu <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Expand Toggle Chevron */}
                <button
                  type="button"
                  onClick={() => toggleExpand(step.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                  aria-label="Toggle details"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
