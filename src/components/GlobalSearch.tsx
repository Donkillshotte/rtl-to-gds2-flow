"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useStages } from "@/hooks/useStages";
import { getUniqueGlossary } from "@/lib/glossaryLookup";
import { cellGlossary } from "@/data/cellGlossary";
import { playbook } from "@/data/playbook";
import { playbookMore } from "@/data/playbookMore";
import { playbookEvenMore } from "@/data/playbookEvenMore";
import { playbookFinal } from "@/data/playbookFinal";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { glossaryTermId } from "@/lib/utils";

const allPlaybook = [...playbook, ...playbookMore, ...playbookEvenMore, ...playbookFinal];

type Hit = {
  id: string;
  kind: "stage" | "glossary" | "cell" | "playbook";
  title: string;
  href: string;
  blurb: string;
};

export function GlobalSearch() {
  const { t } = useI18n();
  const stages = useStages();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [] as Hit[];
    const out: Hit[] = [];

    for (const s of stages) {
      const hay = `${s.title} ${s.subtitle} ${s.description}`.toLowerCase();
      if (hay.includes(needle)) {
        out.push({
          id: s.id,
          kind: "stage",
          title: s.title,
          href: `#stage-${s.id}`,
          blurb: s.subtitle,
        });
      }
    }

    for (const g of getUniqueGlossary()) {
      const hay = `${g.term} ${t(g.definition)}`.toLowerCase();
      if (hay.includes(needle)) {
        out.push({
          id: g.term,
          kind: "glossary",
          title: g.term,
          href: `#${glossaryTermId(g.term)}`,
          blurb: t(g.definition).slice(0, 100) + "…",
        });
      }
    }

    for (const c of cellGlossary) {
      const hay = `${t(c.name)} ${t(c.function)}`.toLowerCase();
      if (hay.includes(needle)) {
        out.push({
          id: c.id,
          kind: "cell",
          title: t(c.name),
          href: `#cell-${c.id}`,
          blurb: t(c.category),
        });
      }
    }

    for (const ch of allPlaybook) {
      const hay = `${t(ch.title)} ${ch.paragraphs.map((p) => t(p)).join(" ")}`.toLowerCase();
      if (hay.includes(needle)) {
        out.push({
          id: ch.id,
          kind: "playbook",
          title: t(ch.title),
          href: "#learn-lab",
          blurb: t(ui.searchPlaybook),
        });
      }
    }

    return out.slice(0, 12);
  }, [q, stages, t]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const kindLabel = {
    stage: t(ui.searchKindStage),
    glossary: t(ui.searchKindGlossary),
    cell: t(ui.searchKindCell),
    playbook: t(ui.searchKindPlaybook),
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-[11rem] sm:max-w-xs">
      <label className="sr-only" htmlFor="global-search">
        {t(ui.searchPlaceholder)}
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/60 px-2.5 py-1.5">
        <Search className="size-3.5 shrink-0 text-slate-500" aria-hidden />
        <input
          id="global-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t(ui.searchPlaceholder)}
          className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-slate-200 outline-none placeholder:text-slate-600"
          autoComplete="off"
        />
      </div>
      {open && q.trim().length >= 2 && (
        <div className="absolute right-0 left-0 z-[60] mt-2 max-h-80 overflow-auto rounded-xl border border-slate-700/50 bg-slate-950 shadow-xl">
          {hits.length === 0 ? (
            <p className="px-3 py-3 text-sm text-slate-500">{t(ui.searchEmpty)}</p>
          ) : (
            <ul className="py-1">
              {hits.map((h) => (
                <li key={`${h.kind}-${h.id}`}>
                  <a
                    href={h.href}
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                    }}
                    className="block px-3 py-2 hover:bg-slate-900"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-400">
                      {kindLabel[h.kind]}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium text-slate-100">
                      {h.title}
                    </span>
                    <span className="block text-xs text-slate-500 line-clamp-1">{h.blurb}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
