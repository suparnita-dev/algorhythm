import { create } from "zustand";

interface WorkspaceState {
  selectedTopicId: string;
  setSelectedTopic: (topicId: string) => void;

  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;

  currentStep: number;
  setCurrentStep: (step: number) => void;

  speed: number;
  setSpeed: (speed: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedTopicId: "arrays",

  setSelectedTopic: (topicId) =>
    set({
      selectedTopicId: topicId,
      currentStep: 0,
      isPlaying: false,
    }),

  isPlaying: false,

  setIsPlaying: (playing) =>
    set({
      isPlaying: playing,
    }),

  currentStep: 0,

  setCurrentStep: (step) =>
    set({
      currentStep: step,
    }),

  speed: 1,

  setSpeed: (speed) =>
    set({
      speed,
    }),
}));