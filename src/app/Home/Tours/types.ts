// src/app/home/Tours/types.ts

export type TourStep = {
  selector: string;
  content: string;
};

export type TourManagerProps = {
  restartTrigger?: boolean;
};

export type TourButtonProps = {
  onRestart: () => void;
};
