import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem, AppSettings, Language, DownloadTask } from '../lib/types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  library: MediaItem[];
  addToLibrary: (item: MediaItem) => void;
  removeFromLibrary: (id: string) => void;
  updateMediaTimestamp: (id: string, timestamp: number) => void;
  downloadQueue: DownloadTask[];
  addToQueue: (item: any, type: 'audio' | 'video', quality?: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  removeFromQueue: (id: string) => void;
  currentMedia: MediaItem | null;
  setCurrentMedia: (item: MediaItem | null) => void;
  playNextQueue: MediaItem[];
  addToPlayNext: (item: MediaItem) => void;
  getNextFromQueue: () => MediaItem | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isAuthorized: boolean;
  authorize: () => void;
  page: string;
  setPage: (page: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  wifiOnly: true,
  audioQuality: '192',
  videoQuality: '720',
  backgroundPlay: true,
  bassBoost: false,
  sleepTimer: null,
  downloadPath: '/HamzaPro/Downloads',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('hp_lang');
    return (saved as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('hp_lang', language);
  }, [language]);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('hp_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [library, setLibrary] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('hp_library');
    return saved ? JSON.parse(saved) : [];
  });

  const updateMediaTimestamp = React.useCallback((id: string, timestamp: number) => {
    setLibrary(prev => prev.map(item => 
      item.id === id ? { ...item, timestamp } : item
    ));
  }, []);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [playNextQueue, setPlayNextQueue] = useState<MediaItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('hp_authorized') === 'true';
  });
  const [downloadQueue, setDownloadQueue] = useState<DownloadTask[]>([]);
  const [page, setPage] = useState('home');

  const authorize = () => {
    setIsAuthorized(true);
    localStorage.setItem('hp_authorized', 'true');
  };

  // Download Queue Logic
  useEffect(() => {
    const activeDownloads = downloadQueue.filter(t => t.status === 'downloading');
    if (activeDownloads.length < 2) {
      const nextInQueue = downloadQueue.find(t => t.status === 'queued');
      if (nextInQueue) {
        resumeDownload(nextInQueue.id);
      }
    }
  }, [downloadQueue]);

  const activeIntervals = React.useRef<Record<string, NodeJS.Timeout>>({});

  const addToLibrary = React.useCallback((item: MediaItem) => {
    setLibrary(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, []);

  const removeFromLibrary = React.useCallback((id: string) => {
    setLibrary(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateSettings = React.useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const addToQueue = React.useCallback((item: any, type: 'audio' | 'video', quality?: string) => {
    setDownloadQueue(prev => {
      // Use a truly unique ID
      const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
      const id = `task-${Date.now()}-${uuid}`;
      
      const itemToCompare = item.id || item.title || JSON.stringify(item);
      if (prev.some(t => (t.item.id === item.id || (item.id === undefined && t.item.title === item.title)) && t.status !== 'completed' && t.status !== 'error')) {
        return prev;
      }
      return [...prev, { id, title: item.title, progress: 0, status: 'queued', type, item, quality }];
    });
  }, []);

  const pauseDownload = React.useCallback((id: string) => {
    if (activeIntervals.current[id]) {
      clearInterval(activeIntervals.current[id]);
      delete activeIntervals.current[id];
    }
    setDownloadQueue(prev => prev.map(t => t.id === id ? { ...t, status: 'paused' } : t));
  }, []);

  const resumeDownload = React.useCallback((id: string) => {
    // If already downloading (has an active interval), do nothing
    if (activeIntervals.current[id]) return;

    setDownloadQueue(prev => {
      const taskIndex = prev.findIndex(t => t.id === id);
      if (taskIndex === -1) return prev;
      
      const task = prev[taskIndex];
      // Double check status - though activeIntervals should be enough
      if (task.status === 'downloading' && activeIntervals.current[id]) return prev;

      const interval = setInterval(() => {
        setDownloadQueue(curr => {
          const currentTask = curr.find(t => t.id === id);
          if (!currentTask || currentTask.status === 'paused' || currentTask.status === 'completed' || currentTask.status === 'error') {
            clearInterval(interval);
            delete activeIntervals.current[id];
            return curr;
          }
          
          const newProgress = Math.min(currentTask.progress + 5, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            delete activeIntervals.current[id];
            
            setTimeout(() => {
              const newItem: MediaItem = {
                ...currentTask.item,
                id: currentTask.id,
                category: currentTask.type,
                downloadedAt: Date.now(),
                timestamp: 0,
                duration: 200,
                url: 'local_stream'
              };
              addToLibrary(newItem);
            }, 0);

            return curr.map(t => t.id === id ? { ...t, progress: 100, status: 'completed' } : t);
          }
          return curr.map(t => t.id === id ? { ...t, progress: newProgress, status: 'downloading' } : t);
        });
      }, 500);

      activeIntervals.current[id] = interval;

      return prev.map(t => t.id === id ? { ...t, status: 'downloading' } : t);
    });
  }, [addToLibrary]);

  const removeFromQueue = React.useCallback((id: string) => {
    setDownloadQueue(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    localStorage.setItem('hp_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('hp_library', JSON.stringify(library));
  }, [library]);

  const addToPlayNext = React.useCallback((item: MediaItem) => {
    setPlayNextQueue(prev => [...prev, item]);
  }, []);

  const getNextFromQueue = React.useCallback(() => {
    if (playNextQueue.length === 0) return null;
    const item = playNextQueue[0];
    setPlayNextQueue(prev => prev.slice(1));
    return item;
  }, [playNextQueue]);

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      settings,
      updateSettings,
      library,
      addToLibrary,
      removeFromLibrary,
      updateMediaTimestamp,
      downloadQueue,
      addToQueue,
      pauseDownload,
      resumeDownload,
      removeFromQueue,
      currentMedia,
      setCurrentMedia,
      playNextQueue,
      addToPlayNext,
      getNextFromQueue,
      isPlaying,
      setIsPlaying,
      isAuthorized,
      authorize,
      page,
      setPage
    }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-black text-white selection:bg-violet-500/30">
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
