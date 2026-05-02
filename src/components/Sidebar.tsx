import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Music, Library as LibraryIcon, Rewind, Download, Settings, Heart, Facebook, MessageSquare, X, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { language, setPage } = useAppContext();
  const t = translations[language];

  const MenuItem = ({ icon: Icon, label, onClick, badge }: { icon: any, label: string, onClick: () => void, badge?: string }) => (
    <button 
      onClick={() => {
        onClick();
        onClose();
      }}
      className="w-full flex items-center gap-5 py-4 px-8 hover:bg-white/5 active:bg-white/10 transition-all group relative overflow-hidden"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-accent/10 group-hover:bg-violet-accent/20 transition-all">
        <Icon size={20} className="text-violet-accent" />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-widest text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all">{label}</span>
        {badge && (
          <span className="bg-violet-accent text-white text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            {badge}
          </span>
        )}
      </div>
      
      {/* Selection indicator */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-violet-accent rounded-r-full transition-all duration-300" />
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ x: language === 'ar' ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? "100%" : "-100%" }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed top-0 bottom-0 w-[85%] max-w-[320px] bg-[#080808] z-[201] border-r border-white/5 shadow-[25px_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col ${language === 'ar' ? 'right-0' : 'left-0'}`}
          >
            {/* Header with Hamza branding */}
            <div className="pt-12 pb-8 px-6 bg-[#0a0a0a] relative overflow-hidden">
               <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-[#4c1d95] px-6 py-3 rounded-[1.5rem] flex items-center gap-3 shadow-[0_0_40px_rgba(76,29,149,0.4)] border border-white/10">
                      <span className="text-3xl font-serif italic font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Hamza</span>
                      <div className="flex items-center justify-center translate-y-0.5">
                        <Play size={20} className="text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] text-white/40 font-black tracking-[0.2em] uppercase">Version 1.0.0 • Edition Officielle</p>
                    <button className="text-[9px] font-black text-violet-accent uppercase tracking-widest px-3 py-1.5 rounded-full bg-violet-accent/5 border border-violet-accent/20 hover:bg-violet-accent/10 transition-all">Vérifier les mises à jour</button>
                  </div>
               </div>
               
               {/* Decorative background glow */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-violet-accent/20 blur-[80px] rounded-full pointer-events-none" />
            </div>

            <div className="flex-1 overflow-y-auto pt-6 pb-20 scrollbar-hide">
              <div className="px-6 mb-2">
                <div className="space-y-1">
                  <MenuItem icon={Play} label={t.home} onClick={() => setPage('home')} />
                  <MenuItem icon={LibraryIcon} label={t.library} onClick={() => setPage('library')} />
                  <MenuItem icon={Music} label={t.liveStations} onClick={() => setPage('live')} badge="Live" />
                </div>
              </div>
              
              <div className="px-6">
                <div className="space-y-1">
                  <MenuItem icon={Download} label="Téléchargements" onClick={() => setPage('downloads')} />
                  <MenuItem icon={Settings} label={t.settings} onClick={() => setPage('settings')} />
                </div>
              </div>
            </div>
            
            <div className="mt-auto p-6 bg-black/40">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[9px] text-white/20 font-black tracking-[0.4em] uppercase">Hamza Engine v1.0</p>
                <p className="text-[8px] text-violet-accent/40 font-black tracking-widest uppercase">Propulsé par YMusic</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
