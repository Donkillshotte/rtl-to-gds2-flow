"use client";

import { I18nProvider } from "@/i18n/context";
import { TermPopupProvider } from "@/components/TermPopup";
import { ProgressProvider } from "@/hooks/useProgress";
import { DensityProvider } from "@/hooks/useDensity";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <DensityProvider>
        <ProgressProvider>
          <TermPopupProvider>{children}</TermPopupProvider>
        </ProgressProvider>
      </DensityProvider>
    </I18nProvider>
  );
}
