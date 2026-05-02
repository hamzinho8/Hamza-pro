import React, { useState, useEffect } from 'react';
import { Menu, Radio, Play, Activity, Globe, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';
import { motion, AnimatePresence } from 'motion/react';
import { PLACEHOLDERS } from '../constants/placeholders';

interface Station {
  id: string;
  name: string;
  nameAr: string;
  desc: string;
  color: string;
  url: string;
  isCustom?: boolean;
}

const DEFAULT_STATIONS: Station[] = [];

export const Live: React.FC<{ onOpenSidebar?: () => void }> = ({ onOpenSidebar }) => {
  const { language, setCurrentMedia, setIsPlaying } = useAppContext();
  const t = translations[language];

  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem('hp_custom_stations');
    if (saved) {
      try {
        const custom = JSON.parse(saved);
        return [...DEFAULT_STATIONS, ...custom];
      } catch (e) {
        return DEFAULT_STATIONS;
      }
    }
    return DEFAULT_STATIONS;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handlePlayStation = (station: Station) => {
    setCurrentMedia({
      id: station.id,
      title: language === 'ar' ? station.nameAr : station.name,
      author: 'Live Streaming',
      thumbnail: PLACEHOLDERS.VIDEO.RETRO,
      url: station.url,
      category: 'audio',
      duration: 0,
      timestamp: 0,
      downloadedAt: Date.now(),
    });
    setIsPlaying(true);
  };

  const handleAddStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newStation: Station = {
      id: `custom-${Date.now()}`,
      name: newName,
      nameAr: newName,
      desc: 'Custom User Stream',
      color: '#BB86FC',
      url: newUrl,
      isCustom: true,
    };

    const updatedStations = [...stations, newStation];
    setStations(updatedStations);
    
    // Save only custom ones to localStorage
    const customOnly = updatedStations.filter(s => s.isCustom);
    localStorage.setItem('hp_custom_stations', JSON.stringify(customOnly));

    setNewName('');
    setNewUrl('');
    setShowAddForm(false);
  };

  const handleDeleteStation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = stations.filter(s => s.id !== id);
    setStations(updated);
    const customOnly = updated.filter(s => s.isCustom);
    localStorage.setItem('hp_custom_stations', JSON.stringify(customOnly));
  };

  return (
    <div className={`min-h-screen atmosphere-bg pb-32 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md pt-4 px-4 pb-4 border-b border-white/5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenSidebar}
              className="text-white p-1 hover:bg-white/10 rounded-full transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Radio className="text-violet-accent" size={20} />
              <h1 className="text-xl font-black uppercase tracking-tight text-white">
                {language === 'ar' ? 'مباشر' : 'LIVE'}
              </h1>
            </div>
          </div>
          <button className="text-violet-accent p-2 hover:bg-white/10 rounded-full transition-all">
            <Globe size={22} />
          </button>
        </div>
      </header>

      <div className="mb-6">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet-accent/10 border border-violet-accent/20 text-violet-accent font-bold text-sm tracking-widest active:scale-[0.98] transition-all"
        >
          {showAddForm ? <Trash2 size={18} /> : <Plus size={18} />}
          {showAddForm ? (language === 'ar' ? 'إغلاق' : 'Fermer') : (language === 'ar' ? 'إضافة محطة مخصصة' : 'Ajouter un flux')}
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddStation}
              className="mt-4 glass p-4 rounded-2xl space-y-3 overflow-hidden"
            >
              <div className="relative">
                <Radio className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder={language === 'ar' ? 'اسم القناة' : 'Nom du flux'}
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:border-violet-accent/50 focus:outline-none"
                  required
                />
              </div>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                  type="url" 
                  placeholder="URL M3U8"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-mono focus:border-violet-accent/50 focus:outline-none"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-violet-accent text-black font-black uppercase text-xs tracking-widest rounded-xl shadow-lg shadow-violet-accent/20"
              >
                {language === 'ar' ? 'تأكيد الإضافة' : 'Confirmer'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-4">
        {stations.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block bg-surface/50 hover:bg-surface border border-white/5 p-4 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
            onClick={() => handlePlayStation(station)}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: station.color }}
              >
                <Activity size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{language === 'ar' ? station.nameAr : station.name}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate">{station.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {station.isCustom && (
                  <button 
                    onClick={(e) => handleDeleteStation(station.id, e)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <div className="w-10 h-10 rounded-full bg-violet-accent/10 flex items-center justify-center text-violet-accent group-hover:bg-violet-accent group-hover:text-black transition-all">
                  <Play size={18} fill="currentColor" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-violet-accent/5 p-4 rounded-2xl border border-violet-accent/10">
        <div className="flex items-center gap-2 text-violet-accent mb-2">
          <div className="w-2 h-2 rounded-full bg-violet-accent animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Lecture en arrière-plan activée</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed font-bold">
          {language === 'ar' 
            ? 'سيستمر تشغيل الصوت حتى لو غادرت التطبيق أو أغلقت الشاشة. تأكد من تفعيل الخيار في الإعدادات.' 
            : "Le flux audio continuera d'être diffusé même si vous quittez l'application ou éteignez l'écran."}
        </p>
      </div>
    </div>
  );
};
