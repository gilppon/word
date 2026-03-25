import { motion, useMotionValue, useTransform, useAnimation } from 'motion/react';
import { useDrag } from '@use-gesture/react';
import { useHaptics } from '../../hooks/useHaptics';
import { useAudioCues } from '../../hooks/useAudioCues';
import { isSwipeUp, isSwipeDown } from '../../utils/gestureHelpers';

import { translations, Language } from '../../data/translations';

interface SwipeCardProps {
  word: string;
  category: string;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  language: Language;
}

export const SwipeCard = ({ word, category, onSwipeUp, onSwipeDown, language }: SwipeCardProps) => {
  const t = translations[language];
  const y = useMotionValue(0);
  const controls = useAnimation();
  const { success, error } = useHaptics();
  const { playSuccess, playError } = useAudioCues();

  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const scale = useTransform(y, [-200, 0, 200], [0.9, 1, 0.9]);
  const opacity = useTransform(y, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const bgOpacity = useTransform(y, [-200, 0, 200], [0.8, 0.1, 0.8]);
  const bgColor = useTransform(
    y,
    [-200, 0, 200],
    ['rgba(16, 185, 129, 0.8)', 'rgba(30, 41, 59, 0.8)', 'rgba(239, 68, 68, 0.8)']
  );

  const handleSwipeUp = () => {
    success();
    playSuccess();
    controls.start({ y: -500, opacity: 0, transition: { duration: 0.2 } }).then(() => {
      onSwipeUp();
      y.set(0);
      controls.set({ y: 0, opacity: 1 });
    });
  };

  const handleSwipeDown = () => {
    error();
    playError();
    controls.start({ y: 500, opacity: 0, transition: { duration: 0.2 } }).then(() => {
      onSwipeDown();
      y.set(0);
      controls.set({ y: 0, opacity: 1 });
    });
  };

  const bind = useDrag(
    (state: any) => {
      const { active, movement: [, my], velocity: [, vy], direction: [, dy] } = state;
      if (!active) {
        if (isSwipeUp(my) || (vy > 0.5 && dy < 0)) {
          handleSwipeUp();
        } else if (isSwipeDown(my) || (vy > 0.5 && dy > 0)) {
          handleSwipeDown();
        } else {
          // Reset
          controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        }
      } else {
        controls.set({ y: my });
      }
    },
    { axis: 'y', filterTaps: true }
  );

  return (
    <motion.div
      {...(bind() as any)}
      style={{ y, rotateX, scale, opacity, willChange: 'transform' }}
      animate={controls}
      className="relative w-full max-w-md aspect-[3/4] sm:aspect-video rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing touch-none glass overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: bgColor, opacity: bgOpacity }}
      />
      
      <div className="absolute top-8 text-sm font-mono tracking-widest text-emerald-400 uppercase opacity-80">
        {category}
      </div>
      
      <h2 className="text-5xl sm:text-7xl font-bold text-white text-center tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {word}
      </h2>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-50">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">{t.swipeUpHint}</span>
          <svg className="w-6 h-6 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        <div className="flex flex-col items-center mt-4">
          <svg className="w-6 h-6 text-red-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-xs uppercase tracking-widest font-bold text-red-400">{t.swipeDownHint}</span>
        </div>
      </div>
    </motion.div>
  );
};
