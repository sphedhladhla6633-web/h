import React, { useState } from 'react';
import { Camera, Image as ImageIcon, ZoomIn, Plus, Trash2, Shield } from 'lucide-react';
import { FIELD_GUIDE_IMAGES } from '../data/fieldGuideImages';

interface PicturesSectionProps {
  onOpenLightbox: (src: string, title: string, tag?: string) => void;
}

interface CustomPhoto {
  id: string;
  src: string;
  caption: string;
  date: string;
}

export const PicturesSection: React.FC<PicturesSectionProps> = ({ onOpenLightbox }) => {
  const [customAcPhotos, setCustomAcPhotos] = useState<CustomPhoto[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ftg_ac_photos') || '[]');
    } catch {
      return [];
    }
  });

  const handleAddAcPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newPhoto: CustomPhoto = {
        id: String(Date.now()),
        src: reader.result as string,
        caption: `Site AC Installation Photo (${new Date().toLocaleDateString()})`,
        date: new Date().toLocaleString()
      };
      const updated = [newPhoto, ...customAcPhotos];
      setCustomAcPhotos(updated);
      try {
        localStorage.setItem('ftg_ac_photos', JSON.stringify(updated));
      } catch (err) {
        console.error('Storage quota exceeded', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAcPhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customAcPhotos.filter(p => p.id !== id);
    setCustomAcPhotos(updated);
    try {
      localStorage.setItem('ftg_ac_photos', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const dcItems = [
    {
      key: 'sol',
      tag: 'DC',
      title: 'Solenoid Relay (DC Install)',
      desc: 'Earth / Pump (−), N/O on top, Power (+) on one side, Pump (+) on other.'
    },
    {
      key: 'relay',
      tag: 'DC',
      title: '12V Relay Wiring Diagram',
      desc: 'Pin 30: 12V+, Pin 87: Pump (+), Pin 86: N/O, Pin 85: Earth (−).'
    },
    {
      key: 'board',
      tag: 'DC',
      title: 'Junction Board with Wires in Place (Bowser Control)',
      desc: '24V In to terminals, Coil 1 to N/O, Coil 2 to Valve −, Bridge 24V+ to COM.'
    },
    {
      key: 'iqphoto',
      tag: 'DC',
      title: 'IQ Plant Hire Junction Board',
      desc: 'Legacy unit setup with Valve (+) and external relay grounding.'
    },
    {
      key: 'iqrelay',
      tag: 'DC',
      title: 'Relay Diagram for IQ Plant Hire',
      desc: 'Pin 30: 12V+, Pin 87: Pump (+), Pin 86: COM, Pin 85: Valve (−).'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-500" />
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
            Technical Schematic &amp; Photo Gallery
          </h2>
        </div>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          High-resolution schematics from technician installer notes. Tap any image to open full-screen zoom, pan and rotate.
        </p>
      </div>

      {/* DC Schematics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            DC Systems
          </span>
          <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
            Direct Current Wiring &amp; Relay Schematics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dcItems.map(item => {
            const src = FIELD_GUIDE_IMAGES[item.key];
            if (!src) return null;

            return (
              <div
                key={item.key}
                onClick={() => onOpenLightbox(src, item.title, item.tag)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-zoom-in flex flex-col justify-between"
              >
                <div className="relative bg-slate-50 dark:bg-slate-950 p-3 flex items-center justify-center min-h-[200px]">
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white shadow-sm z-10">
                    {item.tag}
                  </span>
                  <img
                    src={src}
                    alt={item.title}
                    className="max-h-56 w-auto object-contain group-hover:scale-102 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-3.5 h-3.5" /> Tap to Enlarge
                    </span>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AC Schematics & Site Capture Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
              AC Systems
            </span>
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
              Alternating Current (230V) Site Installations
            </h3>
          </div>

          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-sm transition-colors shrink-0">
            <Camera className="w-4 h-4" />
            <span>Add AC Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleAddAcPhoto}
              className="hidden"
            />
          </label>
        </div>

        {/* Note from original technical manual */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-600 dark:text-slate-400">
          <p>
            <strong>Note from Technical Notes:</strong> “No AC pictures in your notes yet. Send a photo of an AC install and it can go here.”
          </p>
          <p className="text-xs text-slate-500 mt-1">
            You can capture or upload AC pump installation photos directly above. Photos are saved in your device’s local storage.
          </p>
        </div>

        {/* User uploaded AC photos grid */}
        {customAcPhotos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {customAcPhotos.map(photo => (
              <div
                key={photo.id}
                onClick={() => onOpenLightbox(photo.src, photo.caption, 'AC')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm group cursor-zoom-in relative"
              >
                <div className="relative bg-slate-100 dark:bg-slate-950 p-2 min-h-[220px] flex items-center justify-center">
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-bold bg-red-600 text-white z-10">
                    AC SITE
                  </span>
                  <button
                    onClick={e => handleDeleteAcPhoto(photo.id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white z-20 transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="max-h-60 w-auto object-contain rounded-lg"
                  />
                </div>
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {photo.caption}
                  </span>
                  <span className="text-slate-400 shrink-0">{photo.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
