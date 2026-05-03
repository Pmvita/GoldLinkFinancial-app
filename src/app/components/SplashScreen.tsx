import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState('initial');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('reveal'), 500);
    const t2 = setTimeout(() => setStage('loading'), 1500);
    const t3 = setTimeout(() => onComplete(), 3000);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
    >
      {/* Background Shimmer/Glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#cca858]"
        initial={{ opacity: 0, scale: 0.5, filter: 'blur(100px)' }}
        animate={{ 
          opacity: stage !== 'initial' ? 0.08 : 0, 
          scale: stage !== 'initial' ? 1 : 0.5,
          filter: 'blur(120px)'
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Main Logo Container */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e6cc80] via-[#cca858] to-[#997a3d] p-[1px] shadow-2xl shadow-[#cca858]/20 mb-8">
          <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-gradient-to-br from-[#1a1a20] to-[#121217]">
            <span className="font-serif text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#e6cc80] to-[#cca858]">GL</span>
          </div>
        </div>

        {/* Text */}
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === 'loading' || stage === 'reveal' ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-2xl font-light text-white tracking-[0.2em] uppercase mb-1">
            GoldLink<span className="font-semibold text-[#cca858]">Bank</span>
          </span>
          <span className="text-xs text-gray-500 tracking-[0.3em] uppercase">Private Wealth</span>
        </motion.div>
      </motion.div>

      {/* Loading Line */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-[#27272a] overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-transparent via-[#cca858] to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
        />
      </div>
    </motion.div>
  );
}
