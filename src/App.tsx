import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { BottomNav } from './components/BottomNav';
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

const AppContent: React.FC = () => {
  const { language, page, isAuthorized } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isRTL = language === 'ar';

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
      className={`max-w-md mx-auto relative min-h-screen border-x border-white/5 shadow-2xl overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}
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
