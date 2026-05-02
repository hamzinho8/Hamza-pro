import React, { useState } from 'react';
import { Menu, Music, Video, Clock, Trash2, PlayCircle, Activity, MoreVertical, Play, ListMusic, User, Share2, Disc, Library as LibraryIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';
import { MediaItem } from '../lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { VideoPlayer } from '../components/VideoPlayer';

export const Library: React.FC<{ onOpenSidebar?: () => void }> = ({ onOpenSidebar }) => {
  const { language, library, removeFromLibrary, setCurrentMedia, setIsPlaying, addToPlayNext } = useAppContext();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'playlists' | 'tracks' | 'artists' | 'albums'>('tracks');
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio');
  const [menuItem, setMenuItem] = useState<MediaItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  const filteredItems = library
    .filter(item => item.category === mediaType)
    .sort((a, b) => b.downloadedAt - a.downloadedAt);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = (item: MediaItem) => {
    if (item.category === 'video') {
      setActiveVideo(item);
    } else {
      setCurrentMedia(item);
      setIsPlaying(true);
    }
    setMenuItem(null);
  };

  const handleShare = async (item: MediaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `En train d'écouter ${item.title} par ${item.author} sur Hamza Pro`,
          url: item.url !== 'local_stream' && item.url !== 'stream' ? item.url : window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${item.title} - ${item.author}`);
        alert('Lien copié dans le presse-papier');
      } catch (err) {
        console.error('Clipboard failed:', err);
      }
    }
  };

  return (
    <div className={`p-0 pb-40 min-h-screen atmosphere-bg ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md pt-4 px-4 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenSidebar}
              className="text-white p-1 hover:bg-white/10 rounded-full transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <LibraryIcon className="text-violet-accent" size={20} />
              <h1 className="text-xl font-black uppercase tracking-tight text-white">{t.library}</h1>
            </div>
          </div>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setMediaType('audio')}
              className={`p-1.5 rounded-lg transition-all ${mediaType === 'audio' ? 'bg-violet-accent text-black shadow-lg shadow-violet-accent/20' : 'text-white/40'}`}
            >
              <Music size={16} />
            </button>
            <button
              onClick={() => setMediaType('video')}
              className={`p-1.5 rounded-lg transition-all ${mediaType === 'video' ? 'bg-violet-accent text-black shadow-lg shadow-violet-accent/20' : 'text-white/40'}`}
            >
              <Video size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-px bg-black">
        {filteredItems.length === 0 ? (
          <div className="text-center py-32 opacity-20 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white flex items-center justify-center mb-6">
              <PlayCircle size={40} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest">{t.noLibrary}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative overflow-hidden group">
                {/* Delete Background revealed during swipe */}
                <div className={`absolute inset-0 bg-red-600 flex items-center px-6 ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                  <div className="flex flex-col items-center text-white">
                    <Trash2 size={20} className="mb-0.5" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Supprimer</span>
                  </div>
                </div>

                <motion.div
                  layout
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  drag="x"
                  dragConstraints={{ left: language === 'ar' ? 0 : -120, right: language === 'ar' ? 120 : 0 }}
                  onDragEnd={(_, info) => {
                    const threshold = 80;
                    const isSwipeLeft = info.offset.x < -threshold;
                    const isSwipeRight = info.offset.x > threshold;
                    
                    if (language === 'ar' ? isSwipeRight : isSwipeLeft) {
                      removeFromLibrary(item.id);
                    }
                  }}
                  className="bg-black py-3 px-2 flex items-center gap-4 hover:bg-white/5 transition-colors relative z-10 cursor-grab active:cursor-grabbing"
                >
                  <div 
                    className={`relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 ${mediaType === 'video' ? 'w-24 h-14' : 'w-12 h-12'}`}
                    onClick={() => handlePlay(item)}
                  >
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    {mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                        <Play size={16} className="text-white fill-white opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handlePlay(item)}>
                    <h3 className="font-medium truncate pr-2 text-[14px] text-white/90">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500 truncate">{item.author}</p>
                      <span className="text-[10px] text-gray-600">• {formatTime(item.duration)}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuItem(item);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoPlayer item={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      {/* Context Menu Backdrop */}
      <AnimatePresence>
        {menuItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuItem(null)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#121212] z-[101] rounded-t-3xl overflow-hidden border-t border-white/5"
            >
              <div className="p-6 pb-12">
                <div className="flex items-center gap-4 mb-6">
                  <img src={menuItem.thumbnail} alt="" className="w-14 h-14 rounded-xl shadow-2xl" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{menuItem.title}</h4>
                    <p className="text-xs text-gray-500">{menuItem.author}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {[
                    { id: 'playOnce', label: t.playOnce, icon: Play, action: () => handlePlay(menuItem) },
                    { id: 'playNext', label: t.playNext, icon: PlayCircle, action: () => {
                      addToPlayNext(menuItem);
                      setMenuItem(null);
                    } },
                    { id: 'share', label: t.share, icon: Share2, action: () => {
                      handleShare(menuItem);
                      setMenuItem(null);
                    } },
                    { id: 'delete', label: t.deleteFromMemory, icon: Trash2, color: 'text-red-500', action: () => {
                      removeFromLibrary(menuItem.id);
                      setMenuItem(null);
                    }}
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => option.action ? option.action() : setMenuItem(null)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all active:scale-95 ${option.color || 'text-white/80'}`}
                    >
                      <option.icon size={20} className={option.color || "text-gray-400"} />
                      <span className="text-[14px] font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
