"use client";

import { useState } from "react";
import { Home, List, ClipboardCheck, Cpu, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStages } from "@/hooks/useStages";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";

export function MobileBottomNav() {
  const stages = useStages();
  const { t } = useI18n();
  const [phasesOpen, setPhasesOpen] = useState(false);

  const close = () => setPhasesOpen(false);

  return (
    <>
      {/* Phase drawer */}
      {phasesOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] rounded-t-2xl glass border-t border-slate-700/50 overflow-hidden flex flex-col safe-bottom">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40 shrink-0">
              <span className="text-sm font-semibold text-slate-200">{t(ui.flowTitle)}</span>
              <button
                type="button"
                onClick={close}
                className="p-2 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain p-3 grid grid-cols-2 gap-2">
              {stages.map((stage) => (
                <a
                  key={stage.id}
                  href={`#stage-${stage.id}`}
                  onClick={close}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 active:bg-slate-800/80"
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0"
                    style={{
                      background: `${stage.color}20`,
                      color: stage.color,
                      border: `1px solid ${stage.color}40`,
                    }}
                  >
                    {stage.step}
                  </span>
                  <span className="text-xs text-slate-300 leading-tight line-clamp-2">{stage.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar — mobile only */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-slate-700/50 safe-bottom"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-4 h-14">
          <MobileNavItem href="#" icon={<Home className="w-5 h-5" />} label="Home" />
          <button
            type="button"
            onClick={() => setPhasesOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-slate-400 active:text-cyan-400 min-h-[44px]"
          >
            <List className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t(ui.phase)}</span>
          </button>
          <MobileNavItem
            href="#signoff-checklist"
            icon={<ClipboardCheck className="w-5 h-5" />}
            label={t(ui.navSignoff)}
          />
          <MobileNavItem
            href="#cells-glossary"
            icon={<Cpu className="w-5 h-5" />}
            label={t(ui.navCells)}
          />
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center gap-0.5 text-slate-400 active:text-cyan-400 min-h-[44px]"
    >
      {icon}
      <span className="text-[10px] font-medium truncate max-w-full px-1">{label}</span>
    </a>
  );
}

export function MobileHeaderMenu() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#learn-lab", label: t(ui.navLearn) },
    { href: "#flow-overview", label: t(ui.flowTitle).split("—")[0]?.trim() ?? "Flow" },
    { href: "#signoff-checklist", label: t(ui.navSignoff) },
    { href: "#glossary", label: t(ui.navGlossary) },
    { href: "#cells-glossary", label: t(ui.navCells) },
    { href: "#eda-reference", label: t(ui.navRef) },
    { href: "#stage-tapeout", label: t(ui.navTapeout) },
  ];

  return (
    <div className="md:hidden relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-slate-400 active:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl glass border border-slate-700/50 py-2 shadow-xl">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm text-slate-300 active:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
