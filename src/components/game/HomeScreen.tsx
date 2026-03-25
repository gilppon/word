import { motion } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../ui/Button';
import vocabulary from '../../data/vocabulary.json';
import { translations, Language } from '../../data/translations';
import { Difficulty, Word } from '../../types';
import { generateTrendingWords } from '../../utils/aiService';
import { useState } from 'react';

export const HomeScreen = () => {
  const { startGame, language, setLanguage, difficulty, setDifficulty } = useGameStore();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const t = translations[language];

  const handleStart = () => {
    // Shuffle words for a new game based on selected language
    const words = vocabulary[language as keyof typeof vocabulary] || vocabulary['ko'];
    
    // Filter by difficulty
    const filteredWords = difficulty === 'all' 
      ? words 
      : (words as Word[]).filter(w => w.difficulty === difficulty);

    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    startGame(shuffled as Word[]);
  };

  const handleAiStart = async () => {
    setIsAiLoading(true);
    try {
      const words = await generateTrendingWords(language);
      if (words && words.length > 0) {
        startGame(words);
      } else {
        alert(t.aiError);
        handleStart();
      }
    } catch (error) {
      handleStart();
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 text-white p-8 relative overflow-hidden">
      {/* Animated Star Background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20 flex gap-2 bg-slate-900/80 p-1.5 rounded-full backdrop-blur-md border border-white/10">
        {(['ko', 'en', 'ja'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              language === lang
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang === 'ko' ? '한국어' : lang === 'en' ? 'EN' : '日本語'}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center"
      >
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl">
              GALAXY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">WORDS</span>
            </h1>
            <p className="max-w-md text-center text-slate-400 sm:text-lg">
              AI가 실시간으로 생성하는 트렌드 단어로 즐기는<br/>
              스릴 넘치는 스와이프 파티 단어 게임
            </p>
          </div>
        <p className="text-xl sm:text-2xl text-slate-400 font-mono tracking-widest mb-8 uppercase text-center max-w-md">
          {t.subtitle}
        </p>

        <div className="flex flex-col gap-6 w-full max-w-xs">
          {/* Difficulty Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">{t.difficulty}</span>
            <div className="flex gap-2 bg-slate-900/80 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
              {(['all', 'easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    difficulty === diff
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {diff === 'all' ? t.diffAll : diff === 'easy' ? t.diffEasy : diff === 'medium' ? t.diffMedium : t.diffHard}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" onClick={handleStart} className="w-full text-xl py-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            {t.startGame}
          </Button>

          <Button 
            size="lg" 
            variant="outline"
            onClick={handleAiStart} 
            disabled={isAiLoading}
            className="w-full text-xl py-6 rounded-2xl border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            {isAiLoading ? t.aiLoading : t.aiTrendMode}
          </Button>
          
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 text-center">
            <h3 className="text-emerald-400 font-bold mb-4 uppercase tracking-wider text-sm">{t.howToPlay}</h3>
            <ul className="text-slate-300 text-sm space-y-3 text-left">
              <li className="flex items-center gap-3">
                <span className="bg-slate-800 p-2 rounded-lg text-emerald-400 font-mono font-bold">1</span>
                {t.step1}
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-slate-800 p-2 rounded-lg text-emerald-400 font-mono font-bold">2</span>
                {t.step2}
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-slate-800 p-2 rounded-lg text-emerald-400 font-mono font-bold">3</span>
                {t.step3}
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-slate-800 p-2 rounded-lg text-emerald-400 font-mono font-bold">4</span>
                {t.step4}
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
