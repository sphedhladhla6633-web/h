import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Zap, Wrench, CheckSquare, Sliders, ChevronRight } from 'lucide-react';
import { TERMINAL_LIST, WIRING_GUIDES, TROUBLESHOOT_GUIDES, INSTALL_STEPS } from '../data/fieldGuideData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabIndex: number, itemId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global search filtering
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list: {
      type: 'Terminal' | 'Wiring' | 'Troubleshoot' | 'Install';
      title: string;
      snippet: string;
      tabIndex: number;
      id?: string;
    }[] = [];

    // Terminals
    TERMINAL_LIST.forEach(t => {
      if (
        t.label.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.dcUsage.toLowerCase().includes(q) ||
        t.acUsage.toLowerCase().includes(q)
      ) {
        list.push({
          type: 'Terminal',
          title: `Terminal ${t.pin}: ${t.label} (${t.name})`,
          snippet: `${t.description} — DC: ${t.dcUsage} | AC: ${t.acUsage}`,
          tabIndex: 1,
          id: `terminal-${t.pin}`
        });
      }
    });

    // Wiring guides
    WIRING_GUIDES.forEach(w => {
      if (
        w.title.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.bullets.some(b => b.toLowerCase().includes(q)) ||
        (w.notes && w.notes.toLowerCase().includes(q))
      ) {
        list.push({
          type: 'Wiring',
          title: w.title,
          snippet: w.summary,
          tabIndex: 1,
          id: w.id
        });
      }
    });

    // Troubleshoot
    TROUBLESHOOT_GUIDES.forEach(g => {
      if (
        g.symptom.toLowerCase().includes(q) ||
        g.component.toLowerCase().includes(q) ||
        g.likelyCause.toLowerCase().includes(q) ||
        g.solution.toLowerCase().includes(q) ||
        g.steps.some(s => s.toLowerCase().includes(q))
      ) {
        list.push({
          type: 'Troubleshoot',
          title: g.symptom,
          snippet: `${g.component}: ${g.solution}`,
          tabIndex: 2,
          id: g.id
        });
      }
    });

    // Install steps
    INSTALL_STEPS.forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)) {
        list.push({
          type: 'Install',
          title: `Step ${s.id}: ${s.title}`,
          snippet: s.detail,
          tabIndex: 0,
          id: `step-${s.id}`
        });
      }
    });

    return list.slice(0, 15);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 px-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search wiring, Zener diode, relay, OPTO, pump, dipping..."
            className="w-full bg-transparent text-sm md:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-700 dark:text-slate-300">Quick Field Technical Search</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for: <span className="font-mono text-amber-600 dark:text-amber-400">Zener</span>,{' '}
                <span className="font-mono text-amber-600 dark:text-amber-400">12V relay</span>,{' '}
                <span className="font-mono text-amber-600 dark:text-amber-400">Eltomatic</span>,{' '}
                <span className="font-mono text-amber-600 dark:text-amber-400">OPTO</span>,{' '}
                <span className="font-mono text-amber-600 dark:text-amber-400">Perr</span>, or{' '}
                <span className="font-mono text-amber-600 dark:text-amber-400">0.20%</span>
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No matching field technical notes found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectTab(item.tabIndex, item.id);
                  onClose();
                }}
                className="w-full text-left p-3 hover:bg-amber-50 dark:hover:bg-slate-800/80 rounded-xl transition-colors flex items-start justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.type}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.snippet}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
