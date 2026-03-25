export const SWIPE_THRESHOLD = 100;

export const isSwipeUp = (y: number) => y < -SWIPE_THRESHOLD;
export const isSwipeDown = (y: number) => y > SWIPE_THRESHOLD;
