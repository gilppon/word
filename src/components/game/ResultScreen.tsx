import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../ui/Button';
import { useAudioCues } from '../../hooks/useAudioCues';
import { translations } from '../../data/translations';

export const ResultScreen = () => {
   const { score, correctWords, skippedWords, resetGame, language, rank, vAge } = useGameStore();
  const { playTimeOut } = useAudioCues();
  const t = translations[language];

  useEffect(() => {
    playTimeOut();
  }, [playTimeOut]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white p-8 overflow-y-auto relative">
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ef4444 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 flex flex-col items-center max-w-2xl mx-auto w-full"
      >
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-500 text-center">
          {t.missionComplete.split('\n').map((line: string, i: number) => (
            <div key={i}>
              {line}
              {i === 0 && <br />}
            </div>
          ))}
        </h1>
        
        <div className="text-6xl sm:text-9xl font-mono font-bold text-emerald-400 my-8 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">
          {score}
        </div>
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2"
          >
            {t.rankTitle}: {t.ranks[rank as keyof typeof t.ranks]}
          </motion.div>
          <div className="text-slate-400 font-mono text-sm uppercase tracking-[0.3em]">
            {t.vAgeLabel}: {vAge}{t.vAgeUnit}
          </div>
        </div>
        <p className="text-xl text-slate-400 font-mono uppercase tracking-widest mb-12">{t.finalScore}</p>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <h3 className="text-emerald-400 font-bold text-lg mb-4 uppercase tracking-widest border-b border-emerald-500/20 pb-2 flex justify-between items-center">
              {t.correct} <span>{correctWords.length}</span>
            </h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {correctWords.map((w) => (
                <li key={w.id} className="text-slate-200 font-medium flex justify-between items-center py-1">
                  {w.text}
                  <span className="text-xs text-slate-500 font-mono">{w.category}</span>
                </li>
              ))}
              {correctWords.length === 0 && <li className="text-slate-500 italic text-sm">{t.none}</li>}
            </ul>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <h3 className="text-red-400 font-bold text-lg mb-4 uppercase tracking-widest border-b border-red-500/20 pb-2 flex justify-between items-center">
              {t.skipped} <span>{skippedWords.length}</span>
            </h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {skippedWords.map((w) => (
                <li key={w.id} className="text-slate-400 flex justify-between items-center py-1">
                  {w.text}
                  <span className="text-xs text-slate-600 font-mono">{w.category}</span>
                </li>
              ))}
              {skippedWords.length === 0 && <li className="text-slate-500 italic text-sm">{t.none}</li>}
            </ul>
          </div>
        </div>

        <Button size="lg" onClick={resetGame} className="w-full max-w-sm text-xl py-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          {t.playAgain}
        </Button>
      </motion.div>
    </div>
  );
};
