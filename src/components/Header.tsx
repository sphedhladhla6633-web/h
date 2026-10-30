import React from 'react';
import { Fuel, Search, Sun, Moon, AlertTriangle, ShieldCheck, Smartphone, Volume2 } from 'lucide-react';

interface HeaderProps {
  activeTab: number;
  onSelectTab: (index: number) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenPhoneModal?: () => void;
  isSpeaking?: boolean;
  onToggleVoice?: () => void;
}

export const TABS = [
  'Install Checklist',
  'Wiring & Terminals',
  'Troubleshooting',
  'Calibration',
  'Schematics'
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  darkMode,
  onToggleTheme,
  onOpenSearch,
  onOpenPhoneModal,
  isSpeaking = false,
  onToggleVoice
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b-4 border-amber-500 shadow-md">
      {/* Top Banner Row */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Zone (CSS selector 2 target inside) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenPhoneModal}
            className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0 transition-transform active:scale-95 cursor-pointer"
            title="Open Phone Reader & QR code"
            aria-label="Open Phone Reader and QR Code"
          >
            <Fuel className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                Fuel Track
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                v1.2
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Installation, Wiring &amp; Fault-Finding Technical Field Guide
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Phone Voice Read-Aloud Button */}
          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-sm ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              }`}
              title={isSpeaking ? 'Stop voice reading' : 'Read guide aloud to phone'}
              aria-label="Read aloud to phone"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
            </button>
          )}

          {/* Open on Phone / QR button */}
          {onOpenPhoneModal && (
            <button
              onClick={onOpenPhoneModal}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Open or read on your phone"
              aria-label="Phone reader"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Phone Reader</span>
            </button>
          )}

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Search field guide (/ or Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Quick Search</span>
            <kbd className="hidden md:inline text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
              /
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav
        className="flex overflow-x-auto bg-slate-950/80 backdrop-blur-md border-t border-slate-800 scrollbar-none px-2 max-w-6xl mx-auto"
        role="tablist"
      >
        {TABS.map((tabLabel, idx) => {
          const isActive = activeTab === idx;
          const TAB_BACKGROUNDS = ['#28c8c0', '#dc5757', '#3265ad', '#cd16cd', '#70d027'];
          const bgColor = TAB_BACKGROUNDS[idx];

          return (
            <button
              key={idx}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectTab(idx)}
              style={{ backgroundColor: bgColor }}
              className={`flex-1 min-w-fit px-4 py-3 text-xs md:text-sm font-extrabold tracking-tight whitespace-nowrap transition-all border-b-4 text-white shadow-sm ${
                isActive
                  ? 'border-white brightness-110 ring-2 ring-white/40'
                  : 'border-transparent opacity-90 hover:opacity-100 hover:brightness-105'
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
