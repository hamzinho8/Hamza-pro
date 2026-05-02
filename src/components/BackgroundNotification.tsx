import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, X, Music } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const BackgroundNotification: React.FC = () => {
  const { currentMedia, isPlaying, setIsPlaying, setCurrentMedia, library, settings } = useAppContext();
  const [isVisible, setIsVisible] = React.useState(true);
  const lastMediaId = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (currentMedia?.id !== lastMediaId.current) {
      setIsVisible(true);
      lastMediaId.current = currentMedia?.id || null;
    }
  }, [currentMedia?.id]);

  if (!currentMedia || !isVisible || !isPlaying) return null;

  const handleNext = () => {
    const currentIndex = library.findIndex(item => item.id === currentMedia.id);
    if (currentIndex !== -1 && currentIndex < library.length - 1) {
      setCurrentMedia(library[currentIndex + 1]);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 20, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[340px] z-[100] px-4"
      >
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl flex items-center gap-3">
          <div className="relative">
            <img 
              src={currentMedia.thumbnail} 
              alt="" 
              className="w-12 h-12 rounded-xl object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                <div className="flex gap-0.5 items-end h-3">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 6, 12, 4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-violet-accent rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-black uppercase tracking-tighter truncate text-white">
              {currentMedia.title}
            </h4>
            <p className="text-[9px] font-bold text-gray-500 uppercase truncate">
              {currentMedia.author} • Hamza Pro
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button 
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90"
            >
              <SkipForward size={14} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 active:scale-90 ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
