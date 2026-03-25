import { useCallback } from 'react';

export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const success = useCallback(() => vibrate(50), [vibrate]);
  const error = useCallback(() => vibrate([100, 50, 100]), [vibrate]);
  const warning = useCallback(() => vibrate([50, 50, 50]), [vibrate]);

  return { success, error, warning, vibrate };
};
