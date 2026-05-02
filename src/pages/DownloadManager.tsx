import React, { useState } from 'react';
import { Menu, ChevronLeft, Search, MoreVertical, CheckCircle2, Youtube, Download, Clock, X, Trash2, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';
import { motion, AnimatePresence } from 'motion/react';

export const DownloadManager: React.FC<{ onOpenSidebar?: () => void }> = ({ onOpenSidebar }) => {
  const { language, downloadQueue, removeFromQueue, resumeDownload, setPage } = useAppContext();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed' | 'interrupted'>('completed');

  const filteredQueue = downloadQueue.filter(task => {
    if (activeTab === 'ongoing') return task.status === 'downloading' || task.status === 'queued';
    if (activeTab === 'completed') return task.status === 'completed';
    if (activeTab === 'interrupted') return task.status === 'error' || task.status === 'paused';
    return true;
  });

  return (
    <div className={`min-h-screen atmosphere-bg pb-32 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-4 pt-4 pb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenSidebar}
              className="text-white p-1 hover:bg-white/10 rounded-full transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Download className="text-violet-accent" size={24} />
              <h1 className="text-xl font-black uppercase tracking-tight text-white">
                {language === 'ar' ? 'التحميلات' : 'TÉLÉCHARGEMENTS'}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Tabs with Icons and Violet Accents */}
        <div className="flex border-b border-white/5 px-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'completed', label: 'Téléchargé', icon: CheckCircle2 },
            { id: 'ongoing', label: 'En cours', icon: Clock },
            { id: 'interrupted', label: 'Interrompu', icon: X }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-4 flex flex-col items-center gap-1.5 min-w-[110px] transition-all relative ${
                  isActive ? 'text-violet-accent' : 'text-white/40'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-violet-accent' : 'text-white/20'} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="dl-tabs" 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-violet-accent shadow-[0_0_15px_rgba(139,92,246,0.8)]" 
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <div className="p-4 space-y-4">
        {filteredQueue.length === 0 ? (
          <div className="text-center py-32 opacity-20 flex flex-col items-center">
            <Download size={48} className="mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Aucun téléchargement</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredQueue.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 group"
              >
                {/* Thumbnail like in Image 4 */}
                <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                  <img src={task.item.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] font-bold text-white">02:41</div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="text-[13px] font-bold text-white/90 truncate leading-tight">{task.title}.m4a</h3>
                    <p className="text-[11px] text-gray-500 italic mt-0.5">by {task.item.author || 'Inconnu'}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="bg-[#f57c00] text-black text-[9px] font-black px-2 py-0.5 rounded-lg uppercase">M4A</span>
                        <span className="text-[10px] text-gray-500 font-bold">{task.quality || '128 KBPS'}</span>
                      </div>
                      <p className="text-[10px] font-black mt-1 text-white/40 uppercase tracking-tighter">
                        {task.status === 'completed' ? 'TÉLÉCHARGEMENT TERMINÉ' : 
                         task.status === 'downloading' ? `TÉLÉCHARGEMENT ${task.progress}%` : 
                         task.status === 'queued' ? 'EN ATTENTE...' : 'ÉCHEC'}
                      </p>
                      {task.status === 'completed' && <p className="text-[10px] text-gray-600 font-bold">4,1 MB</p>}
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <div className="bg-red-600/20 p-1 rounded">
                         <Youtube size={14} className="text-red-600" />
                       </div>
                       {task.status === 'completed' ? (
                         <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                           <CheckCircle2 size={14} className="text-white" />
                         </div>
                       ) : task.status === 'error' ? (
                         <div className="flex items-center gap-1">
                           <button 
                             onClick={() => resumeDownload(task.id)}
                             className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-red-500/20"
                             title={t.retry}
                           >
                             <RotateCcw size={12} className="text-white" />
                           </button>
                           <button onClick={() => removeFromQueue(task.id)} className="text-gray-600 hover:text-white">
                             <Trash2 size={16} />
                           </button>
                         </div>
                       ) : (
                         <button onClick={() => removeFromQueue(task.id)} className="text-gray-600 hover:text-white">
                           <Trash2 size={16} />
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
