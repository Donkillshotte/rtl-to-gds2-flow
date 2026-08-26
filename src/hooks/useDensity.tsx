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

export type DensityMode = "deep" | "compact";

const KEY = "rtl-gds2-density-v1";

interface DensityContextValue {
  density: DensityMode;
  setDensity: (d: DensityMode) => void;
  toggle: () => void;
  isCompact: boolean;
}

const DensityContext = createContext<DensityContextValue | null>(null);

export function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensityState] = useState<DensityMode>("deep");

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY) as DensityMode | null;
      if (v === "compact" || v === "deep") setDensityState(v);
    } catch {
      /* ignore */
    }
  }, []);

  const setDensity = useCallback((d: DensityMode) => {
    setDensityState(d);
    try {
      localStorage.setItem(KEY, d);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.density = d;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  const toggle = useCallback(() => {
    setDensity(density === "deep" ? "compact" : "deep");
  }, [density, setDensity]);

  const value = useMemo(
    () => ({ density, setDensity, toggle, isCompact: density === "compact" }),
    [density, setDensity, toggle]
  );

  return (
    <DensityContext.Provider value={value}>{children}</DensityContext.Provider>
  );
}

export function useDensity() {
  const ctx = useContext(DensityContext);
  if (!ctx) throw new Error("useDensity requires DensityProvider");
  return ctx;
}
