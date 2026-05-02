import React from 'react';
import { Home, Library, Radio, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { language } = useAppContext();

  const tabs = [
    { id: 'home', icon: Home, label: { fr: 'Accueil', ar: 'الرئيسية' } },
    { id: 'library', icon: Library, label: { fr: 'Bibliothèque', ar: 'المكتبة' } },
    { id: 'live', icon: Radio, label: { fr: 'Live', ar: 'مباشر' } },
    { id: 'settings', icon: Settings, label: { fr: 'Réglages', ar: 'الإعدادات' } },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-deep-dark/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
              isActive ? 'text-violet-accent' : 'text-gray-500'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="nav-bg"
                className="absolute inset-x-4 inset-y-1 bg-violet-accent/10 rounded-xl -z-10"
              />
            )}
            <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">
              {tab.label[language]}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
