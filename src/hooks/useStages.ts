"use client";

import { useMemo } from "react";
import { useI18n } from "@/i18n/context";
import { stages as stagesIt } from "@/data/stages";
import { stagesEnMap } from "@/data/stagesEn";
import type { Stage } from "@/data/stages";

export function useStages(): Stage[] {
  const { locale } = useI18n();

  return useMemo(() => {
    if (locale === "it") return stagesIt;
    return stagesIt.map((stage) => {
      const en = stagesEnMap[stage.id];
      if (!en) return stage;
      return { ...stage, ...en };
    });
  }, [locale]);
}

export function useStageById(id: string): Stage | undefined {
  const stages = useStages();
  return stages.find((s) => s.id === id);
}
