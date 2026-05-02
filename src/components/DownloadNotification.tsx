import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle2, AlertCircle, X, Music, Video, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';

export const DownloadNotification: React.FC = () => {
  const { downloadQueue, removeFromQueue, resumeDownload, language } = useAppContext();
  const t = translations[language];
  
  // Find the active or most recent incomplete task
  const activeTask = [...downloadQueue]
    .reverse()
    .find(t => t.status === 'downloading' || t.status === 'queued' || t.status === 'error');

  // If no active task, check if there's a recently completed one to show brief success
  const completedTask = !activeTask ? [...downloadQueue]
    .reverse()
    .find(t => t.status === 'completed') : null;

  // Track the task to show
  const task = activeTask || (completedTask ? completedTask : null);

  // We only show if there's an active task, or a recently completed one (we'll hide completed after 5s internally or keep it simple)
  if (!task) return null;

  // Don't show completed tasks here to keep it for progress only, unless just finished
  if (task.status === 'completed' && task.progress === 100) {
    // We could hide after some time, but for now we'll only show active progress
    // Wait, the user wants end of download indication.
  }

  return (
    <AnimatePresence mode="wait">
      {task && (task.status !== 'completed' || task.progress < 100) && (
        <motion.div
          key={`active-${task.id}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: -80, opacity: 1 }} // Positioned above the BottomNav
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[360px] z-[90] px-4"
        >
          <div className="bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  task.status === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-violet-accent/20 text-violet-accent'
                }`}>
                  {task.type === 'audio' ? <Music size={16} /> : <Video size={16} />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {task.status === 'downloading' ? (language === 'fr' ? 'Téléchargement...' : 'جاري التحميل...') : 
                     task.status === 'queued' ? (language === 'fr' ? 'En attente...' : 'في الانتظار...') : 
                     task.status === 'error' ? (language === 'fr' ? 'Échec' : 'فشل') : (language === 'fr' ? 'Initialisation' : 'تهيئة')}
                  </p>
                  <p className="text-xs font-bold truncate text-white">{task.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {task.status === 'error' && (
                  <button 
                    onClick={() => resumeDownload(task.id)}
                    className="p-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors active:scale-95"
                    title={t.retry}
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <div className="text-[10px] font-black text-violet-accent">
                  {task.progress}%
                </div>
              </div>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${task.progress}%` }}
                 className={`h-full ${task.status === 'error' ? 'bg-red-500' : 'bg-violet-accent shadow-[0_0_10px_rgba(187,134,252,0.6)]'}`}
               />
            </div>

            {task.quality && (
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                Qualité: {task.quality}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Finished Notification */}
      {completedTask && completedTask.status === 'completed' && (
        <motion.div
           key={`finished-${completedTask.id}`}
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: -80, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           onAnimationComplete={() => {
             // Hidden after some delay? Usually handled by state management
           }}
           className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[360px] z-[90] px-4"
        >
          <div className="bg-green-500/90 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <CheckCircle2 size={24} className="text-white" />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-white/70">{language === 'fr' ? 'Terminé' : 'تم بنجاح'}</p>
              <p className="text-xs font-bold text-white truncate">{completedTask.title}</p>
            </div>
            <button onClick={() => removeFromQueue(completedTask.id)} className="text-white/50">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
