export type MediaCategory = 'audio' | 'video';

export interface MediaItem {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  url: string;
  category: MediaCategory;
  duration: number; // in seconds
  timestamp: number; // current playback position
  downloadedAt: number; // timestamp
}

export interface AppSettings {
  wifiOnly: boolean;
  audioQuality: '128' | '192' | '320';
  videoQuality: '144' | '360' | '720' | '1080';
  backgroundPlay: boolean;
  bassBoost: boolean;
  sleepTimer: number | null; // minutes
  downloadPath: string;
}

export type Language = 'fr' | 'ar';

export interface DownloadTask {
  id: string;
  title: string;
  progress: number;
  status: 'downloading' | 'paused' | 'queued' | 'completed' | 'error';
  type: 'audio' | 'video';
  item: any;
  quality?: string;
}
