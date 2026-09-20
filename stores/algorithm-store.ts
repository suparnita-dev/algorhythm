import { create } from "zustand";

interface AlgorithmState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  totalSteps: number;

  setCurrentStep: (step: number) => void;
  setTotalSteps: (totalSteps: number) => void;

  nextStep: () => void;
  previousStep: () => void;

  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;

  reset: () => void;
}

export const useAlgorithmStore = create<AlgorithmState>((set) => ({
  currentStep: 0,
  isPlaying: false,
  speed: 1,
  totalSteps: 1,

  setCurrentStep: (step) =>
    set((state) => ({
      currentStep: Math.max(
        0,
        Math.min(step, state.totalSteps - 1)
      ),
    })),

  setTotalSteps: (totalSteps) =>
    set({
      totalSteps: Math.max(1, totalSteps),
      currentStep: 0,
      isPlaying: false,
    }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(
        state.currentStep + 1,
        state.totalSteps - 1
      ),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(
        state.currentStep - 1,
        0
      ),
    })),

  setIsPlaying: (playing) =>
    set({
      isPlaying: playing,
    }),

  setSpeed: (speed) =>
    set({
      speed,
    }),

  reset: () =>
    set({
      currentStep: 0,
      isPlaying: false,
    }),
}));