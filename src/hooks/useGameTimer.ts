import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useGameTimer = () => {
  const { status, tick } = useGameStore();

  useEffect(() => {
    let lastTime: number | null = null;
    let requestRef: number;

    const animate = (time: number) => {
      if (lastTime !== null) {
        const deltaTime = (time - lastTime) / 1000;
        tick(deltaTime);
      }
      lastTime = time;
      requestRef = requestAnimationFrame(animate);
    };

    if (status === 'PLAYING') {
      requestRef = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef) {
        cancelAnimationFrame(requestRef);
      }
    };
  }, [status, tick]);
};
