import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, Download } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageTitle: string;
  tag?: string;
  details?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageTitle,
  tag = 'DC',
  details
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.3, 0.7));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${imageTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 p-3 md:p-6 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Top Header Controls */}
      <div
        className="w-full max-w-4xl flex items-center justify-between gap-3 text-white z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`px-2.5 py-1 text-xs font-bold rounded ${tag === 'AC' ? 'bg-red-600' : 'bg-blue-600'}`}>
            {tag} SYSTEM
          </span>
          <h3 className="text-sm md:text-base font-semibold truncate text-slate-100">
            {imageTitle}
          </h3>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Rotate"
            aria-label="Rotate image"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Reset Zoom"
            aria-label="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Download Image"
            aria-label="Download schematic"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors ml-1"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div
        className="relative flex-1 w-full max-w-4xl flex items-center justify-center overflow-hidden my-2 cursor-grab active:cursor-grabbing"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={imageTitle}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="max-h-[75vh] max-w-full w-auto object-contain rounded-md shadow-2xl select-none"
        />
      </div>

      {/* Bottom Caption and Tips */}
      <div
        className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center text-xs md:text-sm text-slate-300 z-10"
        onClick={e => e.stopPropagation()}
      >
        <p className="font-medium text-white">{imageTitle}</p>
        {details && <p className="text-slate-400 mt-1 text-xs">{details}</p>}
        <p className="text-slate-500 text-[11px] mt-1">Tap backdrop or press close to return</p>
      </div>
    </div>
  );
};
