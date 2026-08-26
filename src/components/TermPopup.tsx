"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BookOpen, ExternalLink, X } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import {
  findGlossaryTerm,
  segmentGlossaryText,
  type TextSegment,
} from "@/lib/glossaryLookup";
import type { BilingualGlossaryTerm } from "@/data/glossaryBilingual";
import { cn } from "@/lib/utils";

interface TermPopupContextValue {
  openTerm: (term: string) => void;
  close: () => void;
  active: BilingualGlossaryTerm | null;
}

const TermPopupContext = createContext<TermPopupContextValue | null>(null);

export function useTermPopup(): TermPopupContextValue {
  const ctx = useContext(TermPopupContext);
  if (!ctx) {
    throw new Error("useTermPopup must be used within TermPopupProvider");
  }
  return ctx;
}

export function TermPopupProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<BilingualGlossaryTerm | null>(null);

  const openTerm = useCallback((termOrAlias: string) => {
    const found = findGlossaryTerm(termOrAlias);
    if (found) setActive(found);
  }, []);

  const close = useCallback(() => setActive(null), []);

  const value = useMemo(
    () => ({ openTerm, close, active }),
    [openTerm, close, active]
  );

  return (
    <TermPopupContext.Provider value={value}>
      {children}
      <TermPopupModal />
    </TermPopupContext.Provider>
  );
}

function TermPopupModal() {
  const { active, close } = useTermPopup();
  const { t } = useI18n();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  if (!active) return null;

  const full = active.fullName ? t(active.fullName) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"
        aria-label={t(ui.termClose)}
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-cyan-500/25 bg-slate-900/95 shadow-2xl shadow-cyan-950/40 p-5 sm:p-6 outline-none"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-[10px] font-mono tracking-wider text-cyan-500/80 uppercase mb-1">
              {t(active.category)}
            </p>
            <h2 id={titleId} className="text-xl font-bold text-slate-100 font-mono truncate">
              {active.term}
            </h2>
            {full && (
              <p className="text-sm text-slate-400 mt-1 leading-snug">{full}</p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label={t(ui.termClose)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          <TermText nested>{t(active.definition)}</TermText>
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-700/60">
          <a
            href="#glossary"
            onClick={close}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t(ui.termOpenGlossary)}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <button
            type="button"
            onClick={close}
            className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            {t(ui.termClose)}
          </button>
        </div>
      </div>
    </div>
  );
}

interface TermTextProps {
  children: string;
  className?: string;
  /** Soften highlight (e.g. in dense lists). */
  muted?: boolean;
  /** Inside popup — still clickable for related terms. */
  nested?: boolean;
}

export function TermText({ children, className, muted, nested }: TermTextProps) {
  const { openTerm } = useTermPopup();
  const segments = useMemo(() => segmentGlossaryText(children), [children]);

  if (!children) return null;

  return (
    <span className={className}>
      {segments.map((seg, i) => (
        <SegmentView
          key={`${i}-${seg.kind}-${seg.value.slice(0, 12)}`}
          seg={seg}
          muted={muted}
          nested={nested}
          onOpen={openTerm}
        />
      ))}
    </span>
  );
}

function SegmentView({
  seg,
  muted,
  nested,
  onOpen,
}: {
  seg: TextSegment;
  muted?: boolean;
  nested?: boolean;
  onOpen: (term: string) => void;
}) {
  if (seg.kind === "text") {
    return <>{seg.value}</>;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpen(seg.term);
      }}
      className={cn(
        "inline p-0 m-0 border-0 bg-transparent cursor-pointer font-inherit text-inherit leading-inherit align-baseline",
        "underline decoration-dotted underline-offset-[3px]",
        muted
          ? "decoration-cyan-500/35 hover:decoration-cyan-400/70 hover:text-cyan-200/90"
          : "decoration-cyan-400/50 hover:decoration-cyan-300 hover:bg-cyan-500/10 rounded-[2px]",
        nested && "decoration-amber-400/40 hover:decoration-amber-300"
      )}
      title={seg.term}
    >
      {seg.value}
    </button>
  );
}
