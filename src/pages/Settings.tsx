import React from 'react';
import { Menu, Wifi, Layers, PlayCircle, Speaker, Timer, Languages, Info, ChevronLeft, Search, Folder, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../lib/translations';

export const Settings: React.FC<{ onOpenSidebar?: () => void }> = ({ onOpenSidebar }) => {
  const { language, setLanguage, settings, updateSettings, addToLibrary } = useAppContext();
  const t = translations[language];

  const SettingItem = ({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 group active:scale-[0.98] transition-all"
    >
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-violet-accent/20 group-hover:text-violet-accent transition-all">
        <Icon size={24} />
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-[15px] font-bold text-white/90">{title}</h3>
        <p className="text-[11px] text-gray-500 leading-tight pr-4">{desc}</p>
      </div>
    </button>
  );

  return (
    <div className={`min-h-screen atmosphere-bg pb-32 ${language === 'ar' ? 'rtl text-right' : 'ltr text-left'}`}>
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
              <SettingsIcon className="text-violet-accent" size={20} />
              <h1 className="text-xl font-black uppercase tracking-tight text-white">
                {language === 'ar' ? 'الإعدادات' : 'RÉGLAGES'}
              </h1>
            </div>
          </div>

        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Storage Section */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Stockage</label>
          <div className="bg-surface rounded-2xl border border-white/5 divide-y divide-white/5">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Folder size={20} className="text-violet-accent" />
                <p className="font-medium text-white">Dossier de téléchargement</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly
                  value={settings.downloadPath}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none text-white/70"
                />
                <button 
                  onClick={async () => {
                    try {
                      if ('showDirectoryPicker' in window) {
                        const handle = await (window as any).showDirectoryPicker();
                        updateSettings({ downloadPath: `/${handle.name}` });
                      } else {
                        const paths = ['/sdcard/HamzaPro', '/internal/Music/Hamza', '/Music/Archive'];
                        const randomPath = paths[Math.floor(Math.random() * paths.length)];
                        updateSettings({ downloadPath: randomPath });
                      }
                      
                      const mockFiles = [
                        { id: 'scan-1', title: 'Deep Soul Roots', author: 'Library Scan', thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop', url: '', category: 'audio' as const, duration: 245, timestamp: 0, downloadedAt: Date.now() },
                        { id: 'scan-2', title: 'Urban Jungle Visuals', author: 'Video Archive', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop', url: '', category: 'video' as const, duration: 120, timestamp: 0, downloadedAt: Date.now() },
                      ];
                      
                      mockFiles.forEach(file => addToLibrary(file));
                    } catch (err) {
                      console.log('Selection cancelled or not supported');
                    }
                  }}
                  className="bg-violet-accent/20 px-3 rounded-xl text-[10px] font-black uppercase text-violet-accent active:scale-95 transition-all"
                >
                  Scanner
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Langue</label>
          <div className="bg-surface rounded-2xl border border-white/5 divide-y divide-white/5">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Languages size={20} className="text-violet-accent" />
                <div>
                  <p className="font-medium text-white">Langue / اللغة</p>
                  <p className="text-xs text-gray-400">{language === 'fr' ? 'Français' : 'العربية'}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Download Section */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Téléchargement</label>
          <div className="bg-surface rounded-2xl border border-white/5 divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Wifi size={20} className="text-violet-accent" />
                <p className="font-medium text-white">{t.wifiOnly}</p>
              </div>
              <button
                onClick={() => updateSettings({ wifiOnly: !settings.wifiOnly })}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  settings.wifiOnly ? 'bg-violet-accent' : 'bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.wifiOnly ? (language === 'ar' ? 'left-1' : 'right-1') : (language === 'ar' ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Layers size={20} className="text-violet-accent" />
                <p className="font-medium text-white">Qualité Vidéo</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['144', '360', '720', '1080'].map((q) => (
                  <button
                    key={q}
                    onClick={() => updateSettings({ videoQuality: q as any })}
                    className={`text-xs py-2 rounded-lg transition-all ${
                      settings.videoQuality === q ? 'bg-violet-accent text-black font-bold' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {q}p
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Player Section */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Lecture</label>
          <div className="bg-surface rounded-2xl border border-white/5 divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <PlayCircle size={20} className="text-violet-accent" />
                <p className="font-medium text-white">{t.backgroundPlay}</p>
              </div>
              <button
                onClick={() => updateSettings({ backgroundPlay: !settings.backgroundPlay })}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  settings.backgroundPlay ? 'bg-violet-accent' : 'bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.backgroundPlay ? (language === 'ar' ? 'left-1' : 'right-1') : (language === 'ar' ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Speaker size={20} className="text-violet-accent" />
                <p className="font-medium text-white">{t.bassBoost}</p>
              </div>
              <button
                onClick={() => updateSettings({ bassBoost: !settings.bassBoost })}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  settings.bassBoost ? 'bg-violet-accent' : 'bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.bassBoost ? (language === 'ar' ? 'left-1' : 'right-1') : (language === 'ar' ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Timer size={20} className="text-violet-accent" />
                <p className="font-medium text-white">{t.sleepTimer}</p>
              </div>
              <select 
                className="bg-transparent text-violet-accent text-sm focus:outline-none"
                value={settings.sleepTimer || ''}
                onChange={(e) => updateSettings({ sleepTimer: e.target.value ? parseInt(e.target.value) : null })}
              >
                <option value="">OFF</option>
                <option value="15">15m</option>
                <option value="30">30m</option>
                <option value="60">1h</option>
              </select>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-surface rounded-2xl border border-white/5 p-4 flex items-center gap-3">
          <Info size={20} className="text-gray-500" />
          <div className="flex-1">
            <p className="text-xs text-gray-400">Hamza v1.0.0 (Build 2024)</p>
            <p className="text-[10px] text-gray-600">Optimisé pour Redmi 10A / Android 11</p>
          </div>
        </div>
      </div>
    </div>
  );
};
