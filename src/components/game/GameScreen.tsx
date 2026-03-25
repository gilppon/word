import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { SwipeCard } from './SwipeCard';
import { TimerBar } from '../ui/TimerBar';
import { useGameTimer } from '../../hooks/useGameTimer';
import { translations } from '../../data/translations';

export const GameScreen = () => {
  const { words, activeIndex, swipeUp, swipeDown, score, language } = useGameStore();
  const [isLandscape, setIsLandscape] = useState(true);
  const t = translations[language];

  useGameTimer();

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', checkOrientation);
    checkOrientation();

    // Attempt to lock orientation
    if (screen.orientation && 'lock' in screen.orientation) {
      (screen.orientation as any).lock('landscape').catch((err: any) => {
        console.warn('Orientation lock failed:', err);
      });
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      if (screen.orientation && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock();
      }
    };
  }, []);

  if (!isLandscape) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-950 text-white">
        <svg className="w-24 h-24 mb-6 animate-pulse text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h2 className="text-3xl font-bold mb-4 font-mono">{t.rotateDevice}</h2>
        <p className="text-slate-400 text-lg">{t.rotateDesc}</p>
      </div>
    );
  }

  const currentWord = words[activeIndex];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      {/* Starry Background Effect */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="text-emerald-400 font-mono text-xl font-bold tracking-widest uppercase">
          {t.score}: {score}
        </div>
        <div className="w-1/3 max-w-xs">
          <TimerBar />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center z-10 relative">
        <AnimatePresence mode="wait">
          {currentWord ? (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full flex justify-center"
            >
              <SwipeCard
                word={currentWord.text}
                category={currentWord.category}
                onSwipeUp={swipeUp}
                onSwipeDown={swipeDown}
                language={language}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-400 font-mono text-xl"
            >
              {t.noMoreWords}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
