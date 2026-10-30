import React, { useState } from 'react';
import { Smartphone, Volume2, VolumeX, QrCode, Copy, Check, X, ExternalLink, Type, Sparkles } from 'lucide-react';
import { VoiceReader } from '../utils/speechUtils';

interface PhoneReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSectionText: string;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const PhoneReaderModal: React.FC<PhoneReaderModalProps> = ({
  isOpen,
  onClose,
  currentSectionText,
  fontSize,
  onChangeFontSize
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(VoiceReader.getIsSpeaking());

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleVoice = () => {
    if (VoiceReader.getIsSpeaking()) {
      VoiceReader.stop();
      setIsSpeaking(false);
    } else {
      VoiceReader.speak(currentSectionText, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Phone Reader &amp; Mobile Access
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Voice read-aloud &amp; mobile scan options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Voice Read-Aloud (Text-to-Speech) */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Read Aloud to Phone (Voice TTS)
              </span>
            </div>
            {isSpeaking && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                Speaking
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Let your phone speak the field installation guide and safety directions aloud while your hands are busy on site wiring.
          </p>
          <button
            onClick={handleToggleVoice}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
              isSpeaking
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" /> Stop Reading Aloud
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Read Current Section Aloud
              </>
            )}
          </button>
        </div>

        {/* 2. Text Size & Readability Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Outdoor Phone Font Size
            </span>
            <span className="text-xs text-slate-400 capitalize">{fontSize}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Standard' },
              { id: 'large', label: 'Large (18px)' },
              { id: 'xlarge', label: 'Huge (20px)' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => onChangeFontSize(opt.id as any)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                  fontSize === opt.id
                    ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-transparent shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Scan with Phone (QR Code) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Scan to Open on Your Mobile Phone
          </span>
          <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto shadow-sm flex items-center justify-center border border-slate-200">
            <img
              src={qrCodeUrl}
              alt="Scan to open on phone"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Point your phone camera at this QR code to read the guide on your mobile device.
          </p>
          <button
            onClick={handleCopyLink}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Mobile App Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
