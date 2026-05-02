import React, { useState } from 'react';
import { Menu, Download, Music, Video, Search, AlertCircle, CheckCircle2, Activity, ChevronRight, X, Play, Pause, PlayCircle, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';
import { motion, AnimatePresence } from 'motion/react';

export const Home: React.FC<{ onOpenSidebar?: () => void }> = ({ onOpenSidebar }) => {
  const { language, settings, addToLibrary, library, downloadQueue, addToQueue, pauseDownload, resumeDownload, removeFromQueue, addToPlayNext } = useAppContext();
  const t = translations[language];
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'error' | 'success'; message?: string }>({ type: 'idle' });
  const [lastAttempt, setLastAttempt] = useState<{ item: any; type: 'audio' | 'video' } | null>(null);
  const [sharedContent, setSharedContent] = useState<string | null>(null);
  const [showQualityMenu, setShowQualityMenu] = useState<{ item: any; type: 'audio' | 'video' } | null>(null);

  const hasProcessedShare = React.useRef(false);

  // Detect incoming shared content
  React.useEffect(() => {
    if (hasProcessedShare.current) return;

    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url') || params.get('text');
    const shareType = params.get('share_type'); // 'audio' or 'video'

    if (sharedUrl && (sharedUrl.includes('youtube.com') || sharedUrl.includes('youtu.be') || sharedUrl.includes('dailymotion.com') || sharedUrl.includes('dai.ly'))) {
      const urlMatch = sharedUrl.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        hasProcessedShare.current = true;
        setQuery(urlMatch[0]);

        // Clear query params from URL to prevent re-processing on reload/navigation
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Auto-trigger download if specifically shared for audio or video
        const typeArg = shareType === 'video' ? 'video' : 'audio';
        
        if (settings.wifiOnly && !navigator.onLine) {
          setSharedContent(urlMatch[0]);
          setStatus({ type: 'error', message: t.wifiAlerte });
        } else {
          // Use default quality from settings for auto-queue
          const defaultQuality = typeArg === 'audio' 
            ? `${settings.audioQuality}kbps` 
            : `${settings.videoQuality}p`;

          addToQueue({ 
            title: 'Auto-Shared Content', 
            author: 'Lien externe', 
            thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' 
          }, typeArg, defaultQuality);
          setStatus({ type: 'success', message: language === 'ar' ? 'بدأ التحميل في الخلفية' : 'Téléchargement lancé en arrière-plan' });
          setTimeout(() => setStatus({ type: 'idle' }), 3000);
        }
      }
    }
  }, [language, settings.wifiOnly, t.wifiAlerte, addToQueue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearchResults([]);
    setStatus({ type: 'loading', message: 'Recherche en cours...' });
    setTimeout(() => {
      setSearchResults([
        { id: `search-1-${Date.now()}`, title: 'Hamza - Life is Music', author: 'Artist', thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
        { id: `search-2-${Date.now()}`, title: 'Midnight City Beats', author: 'Lofi King', thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
        { id: `search-3-${Date.now()}`, title: 'Infinite Arabic Oud', author: 'Heritage', thumbnail: 'https://images.unsplash.com/photo-1514525253361-b83f85f5e43a?w=400&h=400&fit=crop' },
      ]);
      setStatus({ type: 'idle' });
    }, 1000);
  };

  const isWifi = navigator.onLine;

  const handleDownloadClick = (item: any, type: 'audio' | 'video') => {
    setShowQualityMenu({ item, type });
  };

  const startDownload = (quality: string) => {
    if (!showQualityMenu) return;

    if (settings.wifiOnly && !isWifi) {
      setStatus({ type: 'error', message: t.wifiAlerte });
      setShowQualityMenu(null);
      return;
    }

    addToQueue(showQualityMenu.item, showQualityMenu.type, quality);
    setShowQualityMenu(null);
    setStatus({ type: 'success', message: 'Ajouté à la file' });
    setTimeout(() => setStatus({ type: 'idle' }), 2000);
  };

  const handleRetry = () => {
    if (lastAttempt) {
      handleDownloadClick(lastAttempt.item, lastAttempt.type);
    }
  };

  return (
    <div className={`min-h-screen atmosphere-bg pb-40 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
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
               <div className="flex items-center gap-2">
                 <Play className="text-violet-accent rotate-12" size={20} />
                 <h1 className="text-xl font-black uppercase tracking-tight text-white leading-none">
                   {language === 'ar' ? 'الرئيسية' : 'ACCUEIL'}
                 </h1>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-violet-accent active:scale-95 transition-all">
              <Activity size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Widgets Simulation */}
      <section className="mb-8">
        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Widgets Hamza</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface/40 p-4 rounded-3xl border border-white/10 aspect-square flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer">
            <PlayCircle size={28} className="text-violet-accent group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase">Lecteur</p>
              <p className="text-xs font-bold leading-tight line-clamp-2">Reprendre la lecture rapide</p>
            </div>
          </div>
          <div className="bg-surface/40 p-4 rounded-3xl border border-white/10 aspect-square flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer">
            <Download size={28} className="text-white group-hover:bounce transition-transform" />
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase">Derniers</p>
              <p className="text-xs font-bold leading-tight line-clamp-2">{library[0]?.title || 'Aucun téléchargement'}</p>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-accent to-fuchsia-500 rounded-2xl opacity-20 group-focus-within:opacity-40 transition-all blur"></div>
          <div className="relative bg-black rounded-2xl flex items-center overflow-hidden border border-white/10">
            <Search className="ml-4 text-gray-500" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent py-4 px-3 focus:outline-none placeholder:text-gray-600 text-sm font-medium"
            />
            <button type="submit" className="px-5 text-violet-accent">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {downloadQueue.length > 0 && downloadQueue.some(q => q.status !== 'completed') && (
          <div className="mb-8 space-y-3">
             <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
               Téléchargements ({downloadQueue.filter(q => q.status !== 'completed').length})
             </h2>
             {downloadQueue.filter(task => task.status !== 'completed').map(task => (
               <motion.div key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass p-3 rounded-2xl flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-violet-accent">
                   {task.type === 'audio' ? <Music size={16} /> : <Video size={16} />}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold truncate">{task.title}</p>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <motion.div className="h-full bg-violet-accent shadow-[0_0_8px_rgba(187,134,252,0.5)]" animate={{ width: `${task.progress}%` }} />
                    </div>
                 </div>
                 <div className="flex items-center gap-1">
                   {task.status === 'downloading' ? (
                     <button onClick={() => pauseDownload(task.id)} className="p-2 text-gray-400 active:scale-90"><Pause size={14} /></button>
                   ) : task.status === 'paused' || task.status === 'queued' ? (
                     <button onClick={() => resumeDownload(task.id)} className="p-2 text-violet-accent active:scale-90"><Play size={14} /></button>
                   ) : task.status === 'error' ? (
                     <button onClick={() => resumeDownload(task.id)} className="p-2 text-red-400 active:scale-90" title={t.retry}><RotateCcw size={14} /></button>
                   ) : null}
                   <button onClick={() => removeFromQueue(task.id)} className="p-2 text-gray-600 active:scale-90"><X size={14} /></button>
                 </div>
               </motion.div>
             ))}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sharedContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-8 glass p-6 rounded-3xl border-violet-accent/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setSharedContent(null)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-violet-accent/20 rounded-2xl flex items-center justify-center text-violet-accent shadow-inner">
                <Download size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">Contenu Partagé</h3>
                <p className="text-[10px] text-gray-500 font-bold truncate max-w-[200px]">{sharedContent}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  handleDownloadClick({ title: 'Shared Audio', author: 'YouTube', thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400' }, 'audio');
                  setSharedContent(null);
                }}
                className="flex flex-col items-center gap-2 bg-violet-accent text-black py-4 rounded-2xl font-black text-[10px] tracking-tighter shadow-lg shadow-violet-accent/20 active:scale-95 transition-transform"
              >
                <Music size={24} />
                {t.downloadMP3.toUpperCase()}
              </button>
              <button 
                onClick={() => {
                  handleDownloadClick({ title: 'Shared Video', author: 'YouTube', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400' }, 'video');
                  setSharedContent(null);
                }}
                className="flex flex-col items-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-[10px] tracking-tighter active:scale-95 transition-transform"
              >
                <Video size={24} />
                {t.downloadMP4.toUpperCase()}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQualityMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQualityMenu(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              className="fixed inset-x-0 bottom-0 glass p-8 rounded-t-[3rem] z-[70] border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              <h3 className="font-black text-xs uppercase tracking-[0.3em] mb-6 text-violet-accent text-center">
                Qualité {showQualityMenu.type === 'audio' ? 'MP3' : 'MP4'}
              </h3>
              <div className="space-y-3">
                {showQualityMenu.type === 'audio' ? (
                  ['320kbps (HD)', '192kbps (Standard)', '128kbps (Eco)'].map(q => (
                    <button key={q} onClick={() => startDownload(q)} className="w-full py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-accent hover:text-black transition-all active:scale-95">
                      {q}
                    </button>
                  ))
                ) : (
                  ['1080p (FHD)', '720p (HD)', '480p'].map(q => (
                    <button key={q} onClick={() => startDownload(q)} className="w-full py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-accent hover:text-black transition-all active:scale-95">
                      {q}
                    </button>
                  ))
                )}
              </div>
              <button 
                onClick={() => setShowQualityMenu(null)} 
                className="w-full mt-6 py-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest"
              >
                Annuler
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status.type !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-xl flex items-center justify-between border ${
              status.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              'bg-violet-accent/10 text-violet-accent border-violet-accent/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {status.type === 'loading' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {status.type === 'error' && <AlertCircle size={18} />}
              {status.type === 'success' && <CheckCircle2 size={18} />}
              <span className="text-xs font-bold uppercase tracking-wide">{status.message || 'Chargement...'}</span>
            </div>
            
            {status.type === 'error' && lastAttempt && (
              <button 
                onClick={handleRetry}
                className="text-[10px] font-black uppercase bg-red-500 text-white px-3 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                {t.retry}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {searchResults.length > 0 ? (
          <div className="grid gap-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t.recent} Résultats</h2>
            {searchResults.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface/50 p-3 rounded-2xl border border-white/5 flex gap-4"
              >
                <img src={item.thumbnail} className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{item.author}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <button 
                      onClick={() => handleDownloadClick(item, 'audio')}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter bg-violet-accent/10 text-violet-accent hover:bg-violet-accent hover:text-black py-2 px-3 rounded-xl transition-all active:scale-95"
                    >
                      <Download size={12} />
                      {t.downloadMP3}
                    </button>
                    <button 
                      onClick={() => {
                        addToPlayNext({
                          ...item,
                          category: 'audio',
                          downloadedAt: Date.now(),
                          timestamp: 0,
                          duration: 200,
                          url: 'stream'
                        });
                        setStatus({ type: 'success', message: language === 'ar' ? 'تمت الإضافة للتشغيل التالي' : 'Ajouté à Jouer ensuite' });
                        setTimeout(() => setStatus({ type: 'idle' }), 2000);
                      }}
                      className="p-2 bg-white/5 text-violet-accent rounded-xl hover:bg-white/10 transition-all active:scale-95"
                      title={t.playNext}
                    >
                      <PlayCircle size={20} />
                    </button>
                    <button 
                      onClick={() => handleDownloadClick(item, 'video')}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter bg-white/5 text-white hover:bg-white/10 py-2 px-3 rounded-xl transition-all active:scale-95"
                    >
                      <Download size={12} />
                      {t.downloadMP4}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center opacity-20">
            <Music size={80} strokeWidth={1} />
            <p className="mt-4 text-sm font-bold uppercase tracking-widest">{language === 'ar' ? 'جاهز للبث' : 'Prêt à diffuser'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
