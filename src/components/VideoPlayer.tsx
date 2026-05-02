import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Maximize, Minimize, Volume2, VolumeX, RotateCcw, RotateCw, Settings } from 'lucide-react';
import { MediaItem } from '../lib/types';
import ReactPlayer from 'react-player';

const PlayerComponent: React.ComponentType<any> = ReactPlayer as any;

interface VideoPlayerProps {
  item: MediaItem;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onClose }) => {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(val / 100);
      setProgress(val);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime + seconds);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 bg-black z-[1000] flex flex-col"
    >
      <div className="relative flex-1 group">
        <div className="w-full h-full" onClick={togglePlay}>
          <PlayerComponent
            ref={playerRef}
            url={item.url || 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-301d-4e83-853a-5bee53b99499.m3u8'}
            width="100%"
            height="100%"
            playing={isPlaying && isReady}
            volume={volume}
            muted={isMuted}
            onProgress={(state: any) => {
              if (state.playedSeconds !== undefined) {
                setCurrentTime(state.playedSeconds);
                setProgress(state.played * 100);
              }
            }}
            onDuration={setDuration}
            onReady={() => setIsReady(true)}
            style={{ pointerEvents: 'none' }}
          />
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 flex flex-col justify-between p-4"
            >
              <div className="flex items-center justify-between">
                <button onClick={onClose} className="p-2 text-white/80 hover:text-white transition-all">
                  <X size={28} />
                </button>
                <div className="text-center">
                  <h2 className="text-sm font-bold text-white truncate max-w-[200px]">{item.title}</h2>
                  <p className="text-[10px] text-white/50">{item.author}</p>
                </div>
                <button className="p-2 text-white/80">
                  <Settings size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-12">
                  <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="text-white hover:scale-110 transition-all">
                    <RotateCcw size={32} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="text-white hover:scale-110 transition-all">
                    <RotateCw size={32} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={seek}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-accent"
                  />
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="text-white/80">
                       {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                     </button>
                     <input 
                       type="range" 
                       min="0" max="1" step="0.1" 
                       value={isMuted ? 0 : volume}
                       onChange={(e) => setVolume(parseFloat(e.target.value))}
                       onClick={(e) => e.stopPropagation()}
                       className="w-20 h-1 accent-white" 
                     />
                   </div>
                   <button className="text-white/80">
                     <Maximize size={20} />
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
