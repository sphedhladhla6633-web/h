import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InstallSection } from './components/InstallSection';
import { WiringSection } from './components/WiringSection';
import { TroubleshootSection } from './components/TroubleshootSection';
import { CalibrationSection } from './components/CalibrationSection';
import { PicturesSection } from './components/PicturesSection';
import { LightboxModal } from './components/LightboxModal';
import { SearchModal } from './components/SearchModal';
import { PhoneReaderModal } from './components/PhoneReaderModal';
import { VoiceReader } from './utils/speechUtils';
import { ShieldCheck, Fuel, AlertOctagon, PhoneCall } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [ticks, setTicks] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('ftg') || '{}');
    } catch {
      return {};
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ftg_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      return (localStorage.getItem('ftg_fontsize') as any) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return VoiceReader.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  const handleChangeFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    try {
      localStorage.setItem('ftg_fontsize', size);
    } catch (err) {
      console.error(err);
    }
  };

  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    src: string;
    title: string;
    tag?: string;
    details?: string;
  }>({
    isOpen: false,
    src: '',
    title: '',
    tag: 'DC'
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('ftg_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ftg_theme', 'light');
    }
  }, [darkMode]);

  // Keyboard shortcut listener (/ or Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && !isSearchOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      } else if (e.key === 'Escape') {
        if (lightboxState.isOpen) {
          setLightboxState(prev => ({ ...prev, isOpen: false }));
        } else if (isSearchOpen) {
          setIsSearchOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, lightboxState.isOpen]);

  const handleToggleTick = (key: string, checked: boolean) => {
    setTicks(prev => {
      const next = { ...prev, [key]: checked };
      try {
        localStorage.setItem('ftg', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleClearTicks = (prefix: string) => {
    setTicks(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (k.startsWith(prefix)) {
          delete next[k];
        }
      });
      try {
        localStorage.setItem('ftg', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleOpenLightbox = (src: string, title: string, tag: string = 'DC', details?: string) => {
    setLightboxState({
      isOpen: true,
      src,
      title,
      tag,
      details
    });
  };

  const handleSelectTabFromSearch = (tabIndex: number, itemId?: string) => {
    setActiveTab(tabIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (itemId) {
      setTimeout(() => {
        const el = document.getElementById(itemId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  };

  const getCurrentSectionSpeechText = () => {
    switch (activeTab) {
      case 0:
        return "Fuel Track Installation Checklist. Step 1: Inspect site and plan. Step 2: Start Safety Culture inspection. Step 3: Decide where power comes from. Step 4: Mount the orange Fuel Track box. Step 5: Mount junction box. Step 6: Install conjure pipe from tank to box. Step 7: Run power to junction board. Step 8: Connect pump, pulse, and power wiring. Step 9: Test pump activation. Step 10: Test pulse with 20 liter calibration drum. Step 11: Calibrate the tank probe. Step 12: Manager inspection and handover. Step 13: Take complete photos and upload to Safety Culture.";
      case 1:
        return "Fuel Track Wiring Guide. Terminal 1 is Live AC, 2 is Neutral, 3 is Earth, 4 is Normally Open, 5 is Common. In DC installations, bridge 12 or 24 volts to Common. Terminal 6 is DC power, 8 is Valve, 9 is Opto negative, 10 is Opto positive, 11 is Pulse negative, 12 is Pulse positive. Solenoid relay: Earth and Normally Open on top, Power positive on one side, Pump positive on the other.";
      case 2:
        return "Fuel Track Troubleshooting. If pulse doesn't count on a new board, the Zener diode has blown and needs replacement. If a 24 volt relay doesn't click, the 24 volt transistor is likely gone. If the unit is sluggish, the battery is dragging down power. For an old board that won't start, connect a battery, check if pulse is inverted, and check the display reset switch.";
      case 3:
        return "Fuel Track Calibration. On the phone, tap the gear icon, then tap ten times consecutively to reveal the secret menu. Select the tank and enter the height in centimeters. Capture voltage out of fuel and back in fuel, then enter installer code. Dipping variance must be below 0.20 percent, never over 1.00 percent.";
      case 4:
        return "Fuel Track Schematics. Viewing Solenoid Relay, 12 volt relay diagram, Bowser control junction board, and IQ Plant Hire wiring.";
      default:
        return "Fuel Track Technical Field Guide for fuel management installation and fault-finding.";
    }
  };

  const handleToggleVoice = () => {
    const text = getCurrentSectionSpeechText();
    VoiceReader.toggle(text);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Primary Header & Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={idx => {
          setActiveTab(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
        isSpeaking={isSpeaking}
        onToggleVoice={handleToggleVoice}
      />

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 pb-20">
        {activeTab === 0 && (
          <InstallSection
            ticks={ticks}
            onToggleTick={handleToggleTick}
            onClearTicks={handleClearTicks}
            onNavigateToTab={setActiveTab}
            fontSize={fontSize}
            onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
          />
        )}

        {activeTab === 1 && (
          <WiringSection onOpenLightbox={handleOpenLightbox} />
        )}

        {activeTab === 2 && (
          <TroubleshootSection onOpenLightbox={handleOpenLightbox} />
        )}

        {activeTab === 3 && <CalibrationSection />}

        {activeTab === 4 && (
          <PicturesSection onOpenLightbox={handleOpenLightbox} />
        )}

        {/* Standard Safety Footnote from technical notes */}
        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>Field Technician Site Safety Directive</span>
          </div>
          <p>
            Based on the Fuel Track installer technical notes. Isolate power before working on wiring, verify emergency stop circuits (both wires positive), and follow site safety rules and Safety Culture sign-off.
          </p>
        </footer>
      </main>

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
        imageSrc={lightboxState.src}
        imageTitle={lightboxState.title}
        tag={lightboxState.tag}
        details={lightboxState.details}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={handleSelectTabFromSearch}
      />

      {/* Phone Reader & QR Code Modal */}
      <PhoneReaderModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        currentSectionText={getCurrentSectionSpeechText()}
        fontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
      />
    </div>
  );
}
