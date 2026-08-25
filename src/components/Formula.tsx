"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

interface FormulaProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export function Formula({ latex, block = true, className = "" }: FormulaProps) {
  let html = "";
  try {
    html = katex.renderToString(latex, {
      displayMode: block,
      throwOnError: false,
      strict: false,
    });
  } catch {
    html = latex;
  }

  if (block) {
    return (
      <div
        className={`my-3 sm:my-4 overflow-x-auto rounded-xl bg-slate-900/80 border border-slate-700/50 px-3 sm:px-6 py-3 sm:py-4 text-center max-w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block mx-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface FormulaBlockProps {
  label: string;
  latex: string;
  explanation: string;
}

export function FormulaBlock({ label, latex, explanation }: FormulaBlockProps) {
  return (
    <div className="glass rounded-xl p-4 sm:p-5 mb-4">
      <h4 className="text-sm font-mono text-cyan-400 mb-2">{label}</h4>
      <Formula latex={latex} />
      <p className="text-xs text-slate-400 leading-relaxed mt-2">{explanation}</p>
    </div>
  );
}
