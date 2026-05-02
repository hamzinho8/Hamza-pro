import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, ChevronDown, ListMusic, Volume2, Share2, MoreVertical, Music, Activity, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';

const PlayerComponent: React.ComponentType<any> = ReactPlayer as any;

export const Player: React.FC = () => {
  const { language, currentMedia, isPlaying, setIsPlaying, setCurrentMedia, updateMediaTimestamp, library, getNextFromQueue, settings, removeFromLibrary } = useAppContext();
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'player' | 'lyrics' | 'eq'>('player');
  const [progress, setProgress] = useState(0); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  const [isReady, setIsReady] = useState(false);
  
  const playerRef = useRef<any>(null);

  const handleNext = React.useCallback(() => {
    if (!currentMedia) return;
    setIsReady(false);

    // First try to get from user-defined queue
    const nextFromQueue = getNextFromQueue();
    if (nextFromQueue) {
      setCurrentMedia(nextFromQueue);
      setIsPlaying(true);
      return;
    }

    // Then try library sequence
    const currentIndex = library.findIndex(item => item.id === currentMedia.id);
    if (currentIndex !== -1 && currentIndex < library.length - 1) {
      setCurrentMedia(library[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentMedia, library, getNextFromQueue, setCurrentMedia, setIsPlaying]);

  const handlePrev = React.useCallback(() => {
    if (!currentMedia) return;
    const currentIndex = library.findIndex(item => item.id === currentMedia.id);
    if (currentIndex > 0) {
      setCurrentMedia(library[currentIndex - 1]);
      setIsPlaying(true);
    }
  }, [currentMedia, library, setCurrentMedia, setIsPlaying]);

  // Media Session API Metadata
  useEffect(() => {
    if (!currentMedia) return;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMedia.title,
        artist: currentMedia.author,
        album: 'Hamza Pro',
        artwork: [
          { src: currentMedia.thumbnail, sizes: '96x96', type: 'image/jpeg' },
          { src: currentMedia.thumbnail, sizes: '128x128', type: 'image/jpeg' },
          { src: currentMedia.thumbnail, sizes: '192x192', type: 'image/jpeg' },
          { src: currentMedia.thumbnail, sizes: '256x256', type: 'image/jpeg' },
          { src: currentMedia.thumbnail, sizes: '384x384', type: 'image/jpeg' },
          { src: currentMedia.thumbnail, sizes: '512x512', type: 'image/jpeg' },
        ]
      });
    }
  }, [currentMedia?.id]);

  // Handle Media Session Actions separately to ensure fresh callbacks
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && playerRef.current) {
          playerRef.current.seekTo(details.seekTime);
        }
      });
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekto', null);
      }
    };
  }, [handleNext, handlePrev, setIsPlaying]);

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleShare = async () => {
    if (!currentMedia) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentMedia.title,
          text: `En train d'écouter ${currentMedia.title} par ${currentMedia.author} sur Hamza Pro`,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${currentMedia.title} - ${currentMedia.author}`);
        alert('Lien copié dans le presse-papier');
      } catch (err) {
        console.error('Clipboard failed:', err);
      }
    }
  };

  if (!currentMedia) return null;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const MOCK_LYRICS = [
    { time: 0, text: "Welcome to Hamza Pro" },
    { time: 10, text: "The music is flowing through your soul" },
    { time: 20, text: "High quality audio extraction" },
    { time: 30, text: "Designed for Redmi 10A experience" },
    { time: 40, text: "Midnight city, lights so bright..." }
  ];

  const renderContent = () => {
    switch (viewMode) {
      case 'lyrics':
        return (
          <div className="flex-1 overflow-y-auto mask-fade-bottom py-10 px-4 scrollbar-hide">
            <div className="space-y-10 text-center">
              {MOCK_LYRICS.map((line, i) => (
                <motion.p 
                  key={`lyric-${i}`}
                  animate={{ 
                    opacity: currentTime >= line.time ? 1 : 0.2,
                    scale: currentTime >= line.time ? 1.1 : 1,
                    color: currentTime >= line.time ? '#BB86FC' : '#FFFFFF'
                  }}
                  className="text-2xl font-serif font-light leading-relaxed"
                >
                  {line.text}
                </motion.p>
              ))}
            </div>
          </div>
        );
      case 'eq':
        return (
          <div className="flex-1 flex flex-col justify-center items-center p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-12 text-violet-accent">Pro Equalizer</h3>
            <div className="flex items-end justify-between w-full h-48 gap-3">
              {[60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000].map((freq, index) => (
                <div key={`freq-${freq}`} className="flex flex-col items-center flex-1 gap-4">
                  <div className="w-full bg-white/5 rounded-full relative overflow-hidden flex-1">
                    <motion.div 
                      key={isPlaying ? `active-${index}` : `idle-${index}`}
                      animate={{ 
                        height: isPlaying ? [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 50}%`, `${10 + Math.random() * 80}%`] : '30%'
                      }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                      className="absolute bottom-0 w-full bg-violet-accent/40 border-t border-violet-accent"
                    />
                  </div>
                  <span className="text-[8px] font-mono text-gray-600 font-bold">{freq >= 1000 ? `${freq/1000}k` : freq}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-surface p-4 rounded-2xl w-full border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400">BASS BOOST</span>
                <span className="text-xs font-bold text-violet-accent">+12dB</span>
              </div>
              <input type="range" className="w-full" defaultValue={80} />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col justify-center items-center">
            <motion.div 
               layoutId="artwork"
               className="w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-violet-accent/10 border border-white/5 max-w-[320px]"
            >
              <img src={currentMedia.thumbnail} alt="" className="w-full h-full object-cover" />
            </motion.div>
            
            <div className="mt-10 w-full text-center">
              <h2 className="text-2xl font-bold mb-2 line-clamp-1 px-4">{currentMedia.title}</h2>
              <p className="text-gray-400 font-medium text-lg">{currentMedia.author}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {!isExpanded ? (
        /* Mini Player */
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-16 left-2 right-2 h-16 glass rounded-2xl flex items-center px-3 gap-3 shadow-2xl z-40"
          onClick={() => setIsExpanded(true)}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface flex-shrink-0">
            <motion.img layoutId="artwork-mini" src={currentMedia.thumbnail} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">{currentMedia.title}</h4>
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-violet-accent animate-pulse" />
              <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider font-bold">{currentMedia.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
              className="p-2 text-violet-accent"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentMedia(null); }}
              className="p-2 text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
          {/* Progress Bar Mini */}
          <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-violet-accent" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </motion.div>
      ) : (
        /* Full Screen Player */
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 bg-black z-50 flex flex-col px-8 py-10 atmosphere-bg"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setIsExpanded(false)} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors">
              <ChevronDown size={32} />
            </button>
            <div className="text-center">
              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-600">NOW STREAMING</span>
              <p className="text-[10px] font-black text-violet-accent mt-0.5">HAMZA PRO ENGINE 1.0</p>
            </div>
            <button 
              onClick={() => setShowOptionsMenu(true)}
              className="p-2 -mr-2 text-gray-500 hover:text-white transition-colors"
            >
              <MoreVertical size={24} />
            </button>
          </div>

          <AnimatePresence>
            {showOptionsMenu && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowOptionsMenu(false)}
                  className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 bg-[#121212] z-[61] rounded-t-3xl overflow-hidden border-t border-white/5"
                >
                  <div className="p-6 pb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <img src={currentMedia.thumbnail} alt="" className="w-14 h-14 rounded-xl shadow-2xl" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-white truncate">{currentMedia.title}</h4>
                        <p className="text-xs text-gray-500">{currentMedia.author}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          handleShare();
                          setShowOptionsMenu(false);
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all text-white/80"
                      >
                        <Share2 size={20} className="text-gray-400" />
                        <span className="text-[14px] font-medium">{t.share}</span>
                      </button>
                      <button
                        onClick={() => {
                          removeFromLibrary(currentMedia.id);
                          setCurrentMedia(null);
                          setShowOptionsMenu(false);
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all text-red-500"
                      >
                        <Trash2 size={20} className="text-red-500" />
                        <span className="text-[14px] font-medium">{t.deleteFromMemory}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Dynamic Content */}
          <div className="flex-1 flex flex-col justify-center items-center relative">
            {/* Visualizer Aura */}
            <AnimatePresence>
              {isPlaying && viewMode === 'player' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={`aura-${i}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.5 + i * 0.2, 1.8 + i * 0.3],
                        opacity: [0, 0.15, 0],
                        borderWidth: ['1px', '2px', '0px']
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 0.8,
                        ease: "easeOut" 
                      }}
                      className="absolute w-[280px] h-[280px] rounded-full border border-violet-accent/30"
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {renderContent()}
          </div>

          {/* Controls Area */}
          <div className="w-full mt-auto">
            {/* Seek Bar */}
            <div className="mb-10 group">
              <input 
                type="range" 
                className="w-full"
                value={progress}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setProgress(val);
                  const newTime = (val / 100) * duration;
                  setCurrentTime(newTime);
                  if (playerRef.current) {
                    playerRef.current.seekTo(val / 100);
                  }
                }}
              />
              <div className="flex justify-between mt-4 text-[10px] font-black text-gray-500 tracking-[0.2em] font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || currentMedia.duration || 0)}</span>
              </div>
            </div>

            {/* Main Buttons */}
            <div className="flex items-center justify-between mb-12">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setViewMode(viewMode === 'lyrics' ? 'player' : 'lyrics')}
                className={`transition-colors ${viewMode === 'lyrics' ? 'text-violet-accent' : 'text-gray-600'}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black">LYRICS</span>
                  <div className={`w-1 h-1 rounded-full ${viewMode === 'lyrics' ? 'bg-violet-accent' : 'bg-transparent'}`} />
                </div>
              </motion.button>
              
              <div className="flex items-center gap-8">
                <motion.button 
                  whileTap={{ scale: 0.8, x: -10 }}
                  onClick={handlePrev}
                  className="text-white/40 hover:text-white/60 transition-colors"
                >
                  <SkipBack size={36} fill="currentColor" />
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] z-10"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isPlaying ? 'pause' : 'play'}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.8, x: 10 }}
                  onClick={handleNext}
                  className="text-white active:scale-90 transition-transform"
                >
                  <SkipForward size={36} fill="currentColor" />
                </motion.button>
              </div>

              <motion.button 
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setViewMode(viewMode === 'eq' ? 'player' : 'eq')}
                className={`transition-colors ${viewMode === 'eq' ? 'text-violet-accent' : 'text-gray-600'}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black">EQ PRO</span>
                  <div className={`w-1 h-1 rounded-full ${viewMode === 'eq' ? 'bg-violet-accent' : 'bg-transparent'}`} />
                </div>
              </motion.button>
            </div>

            {/* Bottom Utility */}
            <div className="flex justify-between items-center px-4 bg-surface/30 py-4 rounded-3xl border border-white/5 mb-6">
              <Volume2 size={20} className="text-gray-600" />
              <div className="flex-1 mx-6 h-[2px] bg-white/5 rounded-full overflow-hidden">
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                />
                <div className="h-full bg-gray-500 relative" style={{ width: `${volume * 100}%` }} />
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="text-gray-600 hover:text-violet-accent transition-colors"
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </div>
          
          {/* Hidden ReactPlayer */}
          <div className="hidden">
            <PlayerComponent
              ref={playerRef}
              url={(currentMedia.url === 'local_stream' || currentMedia.url === 'stream' 
                ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                : currentMedia.url) || ''}
              playing={isPlaying && isReady}
              volume={volume}
              onProgress={(state: any) => {
                if (state.playedSeconds !== undefined) {
                  setCurrentTime(state.playedSeconds);
                  setProgress(state.played * 100);
                  
                  // Save bookmark periodically
                  if (Math.floor(state.playedSeconds) % 5 === 0 && isPlaying) {
                    updateMediaTimestamp(currentMedia.id, Math.floor(state.playedSeconds));
                  }
                }
              }}
              onDuration={setDuration}
              onEnded={handleNext}
              onError={(e: any) => {
                console.error("Player Error:", e);
                setIsPlaying(false);
              }}
              onReady={() => {
                setIsReady(true);
                if (currentMedia.timestamp && playerRef.current) {
                  (playerRef.current as any).seekTo(currentMedia.timestamp, 'seconds');
                }
              }}
              config={{
                file: {
                  forceAudio: true,
                  attributes: {
                    preload: 'metadata'
                  }
                }
              } as any}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
