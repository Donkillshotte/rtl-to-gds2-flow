"use client";

import { I18nProvider } from "@/i18n/context";
import { TermPopupProvider } from "@/components/TermPopup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <TermPopupProvider>{children}</TermPopupProvider>
    </I18nProvider>
  );
}
