import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ShieldCheck, Zap, Globe, Lock, Cpu, Music2, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AuthorizationScreen: React.FC = () => {
  const { authorize, language } = useAppContext();
  const [step, setStep] = useState(0);
  const [isActivating, setIsActivating] = useState(false);

  const steps = [
    {
      title: "Hamza Engine",
      description: "Installation du moteur de musique et vidéo de nouvelle génération.",
      icon: Cpu
    },
    {
      title: "Sécurité & Accès",
      description: "Autorisation du système de fichiers et des protocoles réseau sécurisés.",
      icon: ShieldCheck
    },
    {
      title: "Prêt pour l'activation",
      description: "Votre application est prête à être activée. Cliquez pour démarrer.",
      icon: Zap
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleActivate();
    }
  };

  const handleActivate = () => {
    setIsActivating(true);
    // Simulate activation process
    setTimeout(() => {
      authorize();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
      <div className="absolute inset-0 atmosphere-bg opacity-40" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-violet-accent/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-16 scale-125"
        >
          <div className="bg-[#4c1d95] px-6 py-3 rounded-[1.5rem] flex items-center gap-3 shadow-[0_0_40px_rgba(76,29,149,0.4)] border border-white/10">
            <span className="text-3xl font-serif italic font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Hamza</span>
            <div className="flex items-center justify-center translate-y-0.5">
              <Play size={20} className="text-white fill-white" />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isActivating ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-violet-accent/10 flex items-center justify-center border border-violet-accent/20">
                      {React.createElement(steps[step].icon, { className: "text-violet-accent", size: 32 })}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-center text-white mb-2 uppercase tracking-tight">{steps[step].title}</h3>
                  <p className="text-gray-500 text-center text-sm mb-10 leading-relaxed">{steps[step].description}</p>

                  <div className="flex gap-2 mb-8 justify-center">
                    {steps.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-violet-accent' : 'w-2 bg-white/10'}`} 
                      />
                    ))}
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full py-4 rounded-2xl bg-violet-accent text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:brightness-110 active:scale-95 transition-all text-sm"
                  >
                    {step === steps.length - 1 ? "Activer l'application" : "Continuer"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="activating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12"
            >
              <div className="relative w-32 h-32 mb-8">
                <motion.div 
                  className="absolute inset-0 border-4 border-violet-accent/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-0 border-4 border-transparent border-t-violet-accent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={40} className="text-violet-accent animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">Activation du Hamza Engine...</h3>
              <p className="text-[10px] text-gray-600 font-bold tracking-[0.3em] mt-3 animate-pulse">OPTIMISATION DE LA MÉMOIRE</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center gap-2 opacity-30">
          <Globe size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Authentification Distante Unifiée</span>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationScreen;
