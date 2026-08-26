"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const KEY = "rtl-gds2-progress-v1";

export interface ProgressState {
  readStages: string[];
  quizDone: number;
  drillsDone: string[];
  interviewBest: number;
}

const defaultState: ProgressState = {
  readStages: [],
  quizDone: 0,
  drillsDone: [],
  interviewBest: 0,
};

interface ProgressContextValue {
  progress: ProgressState;
  markStageRead: (id: string) => void;
  isStageRead: (id: string) => boolean;
  bumpQuiz: () => void;
  markDrillDone: (id: string) => void;
  setInterviewBest: (score: number) => void;
  resetProgress: () => void;
  completionPct: (totalStages: number) => number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function load(): ProgressState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function save(state: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(progress);
  }, [progress, hydrated]);

  const markStageRead = useCallback((id: string) => {
    setProgress((p) =>
      p.readStages.includes(id) ? p : { ...p, readStages: [...p.readStages, id] }
    );
  }, []);

  const isStageRead = useCallback(
    (id: string) => progress.readStages.includes(id),
    [progress.readStages]
  );

  const bumpQuiz = useCallback(() => {
    setProgress((p) => ({ ...p, quizDone: p.quizDone + 1 }));
  }, []);

  const markDrillDone = useCallback((id: string) => {
    setProgress((p) =>
      p.drillsDone.includes(id) ? p : { ...p, drillsDone: [...p.drillsDone, id] }
    );
  }, []);

  const setInterviewBest = useCallback((score: number) => {
    setProgress((p) => ({
      ...p,
      interviewBest: Math.max(p.interviewBest, score),
    }));
  }, []);

  const resetProgress = useCallback(() => setProgress(defaultState), []);

  const completionPct = useCallback(
    (totalStages: number) =>
      totalStages === 0
        ? 0
        : Math.round((progress.readStages.length / totalStages) * 100),
    [progress.readStages]
  );

  const value = useMemo(
    () => ({
      progress,
      markStageRead,
      isStageRead,
      bumpQuiz,
      markDrillDone,
      setInterviewBest,
      resetProgress,
      completionPct,
    }),
    [
      progress,
      markStageRead,
      isStageRead,
      bumpQuiz,
      markDrillDone,
      setInterviewBest,
      resetProgress,
      completionPct,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress requires ProgressProvider");
  return ctx;
}
