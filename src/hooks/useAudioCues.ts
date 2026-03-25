import { Howl } from 'howler';

const CORRECT_SOUND = 'https://actions.google.com/sounds/v1/ui/message_notification.ogg';
const PASS_SOUND = 'https://actions.google.com/sounds/v1/ui/error.ogg';
const TIMEOUT_SOUND = 'https://actions.google.com/sounds/v1/science_fiction/power_down.ogg';

// Initialize outside the hook to ensure they are preloaded immediately
// when the module is evaluated, guaranteeing zero latency.
const correctHowl = new Howl({ src: [CORRECT_SOUND], preload: true, volume: 0.6 });
const passHowl = new Howl({ src: [PASS_SOUND], preload: true, volume: 0.6 });
const timeoutHowl = new Howl({ src: [TIMEOUT_SOUND], preload: true, volume: 0.8 });

export const useAudioCues = () => {
  const playSuccess = () => correctHowl.play();
  const playError = () => passHowl.play();
  const playTimeOut = () => timeoutHowl.play();

  return { playSuccess, playError, playTimeOut };
};
