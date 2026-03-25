import { useGameStore } from './store/useGameStore';
import { HomeScreen } from './components/game/HomeScreen';
import { GameScreen } from './components/game/GameScreen';
import { ResultScreen } from './components/game/ResultScreen';

export default function App() {
  const status = useGameStore((state) => state.status);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {status === 'IDLE' && <HomeScreen />}
      {status === 'PLAYING' && <GameScreen />}
      {status === 'FINISHED' && <ResultScreen />}
    </div>
  );
}
