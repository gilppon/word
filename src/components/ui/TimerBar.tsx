import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const TimerBar: React.FC = () => {
  const timeLeft = useGameStore((state) => state.timeLeft);
  const percentage = (timeLeft / 60) * 100;

  return (
    <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      <div
        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-100 ease-linear"
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white mix-blend-difference">
        {Math.ceil(timeLeft)}s
      </div>
    </div>
  );
};
