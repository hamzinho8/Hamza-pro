import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Home } from './pages/Home';
import { Library } from './pages/Library';
import { Live } from './pages/Live';
import { Settings } from './pages/Settings';
import { DownloadManager } from './pages/DownloadManager';
import { Player } from './components/Player';
import { BackgroundNotification } from './components/BackgroundNotification';
import { DownloadNotification } from './components/DownloadNotification';
import { Sidebar } from './components/Sidebar';
import AuthorizationScreen from './components/AuthorizationScreen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

const AppContent: React.FC = () => {
  const { language, page, isAuthorized } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    const initCapacitor = async () => {
      try {
        // Set Status Bar
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000000' });
        
        // Hide Splash Screen
        await SplashScreen.hide();
      } catch (e) {
        console.warn('Capacitor not available:', e);
      }
    };
    initCapacitor();
  }, []);

  if (!isAuthorized) {
    return <AuthorizationScreen />;
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home onOpenSidebar={() => setIsSidebarOpen(true)} />;
      case 'library': return <Library onOpenSidebar={() => setIsSidebarOpen(true)} />;
      case 'live': return <Live onOpenSidebar={() => setIsSidebarOpen(true)} />;
      case 'settings': return <Settings onOpenSidebar={() => setIsSidebarOpen(true)} />;
      case 'downloads': return <DownloadManager onOpenSidebar={() => setIsSidebarOpen(true)} />;
      default: return <Home onOpenSidebar={() => setIsSidebarOpen(true)} />;
    }
  };

  return (
    <div 
      className={`relative min-h-screen bg-black overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <main className="animate-in fade-in duration-500 overflow-y-auto h-full scrollbar-hide">
        <BackgroundNotification />
        <DownloadNotification />
        {renderPage()}
      </main>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Player />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
