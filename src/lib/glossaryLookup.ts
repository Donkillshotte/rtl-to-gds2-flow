import type { BilingualGlossaryTerm } from "@/data/glossaryBilingual";
import { bilingualGlossary } from "@/data/glossaryBilingual";
import { glossaryAliases } from "@/data/glossaryAliases";

export interface GlossaryEntry {
  /** Canonical term key (as in glossary). */
  term: string;
  data: BilingualGlossaryTerm;
  /** Patterns that resolve to this term (term + aliases), longest first. */
  patterns: string[];
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Deduped glossary: last definition wins for duplicate term keys. */
export function getUniqueGlossary(): BilingualGlossaryTerm[] {
  const map = new Map<string, BilingualGlossaryTerm>();
  for (const g of bilingualGlossary) {
    map.set(g.term.toUpperCase(), g);
  }
  return [...map.values()];
}

let cachedEntries: GlossaryEntry[] | null = null;
let cachedFlatPatterns: { pattern: string; term: string; caseSensitive: boolean }[] | null = null;

export function getGlossaryEntries(): GlossaryEntry[] {
  if (cachedEntries) return cachedEntries;
  const unique = getUniqueGlossary();
  const byUpper = new Map(unique.map((g) => [g.term.toUpperCase(), g]));

  const aliasToCanonical = new Map<string, string>();
  for (const [alias, canonical] of Object.entries(glossaryAliases)) {
    aliasToCanonical.set(alias.toUpperCase(), canonical);
  }

  const patternsByTerm = new Map<string, Set<string>>();
  for (const g of unique) {
    const set = patternsByTerm.get(g.term) ?? new Set<string>();
    set.add(g.term);
    if (g.fullName) {
      // fullName is Localized — skip here; aliases file covers common expansions
    }
    patternsByTerm.set(g.term, set);
  }

  for (const [alias, canonical] of Object.entries(glossaryAliases)) {
    const target =
      byUpper.get(canonical.toUpperCase()) ??
      byUpper.get(alias.toUpperCase());
    if (!target) continue;
    const set = patternsByTerm.get(target.term) ?? new Set<string>();
    set.add(alias);
    set.add(canonical);
    patternsByTerm.set(target.term, set);
  }

  cachedEntries = unique.map((g) => ({
    term: g.term,
    data: g,
    patterns: [...(patternsByTerm.get(g.term) ?? [g.term])].sort(
      (a, b) => b.length - a.length
    ),
  }));
  return cachedEntries;
}

function isWordChar(ch: string | undefined): boolean {
  if (ch === undefined) return false;
  return /[A-Za-z0-9_]/.test(ch);
}

/** Short all-caps acronyms must match case-sensitively (avoid Italian "si", "em"). */
function requiresExactCase(pattern: string): boolean {
  return pattern.length <= 3 && /^[A-Z0-9][A-Z0-9.&/-]*$/.test(pattern);
}

function buildFlatPatterns() {
  if (cachedFlatPatterns) return cachedFlatPatterns;
  const flat: { pattern: string; term: string; caseSensitive: boolean }[] = [];
  for (const e of getGlossaryEntries()) {
    for (const p of e.patterns) {
      flat.push({
        pattern: p,
        term: e.term,
        caseSensitive: requiresExactCase(p),
      });
    }
  }
  flat.sort((a, b) => b.pattern.length - a.pattern.length);
  cachedFlatPatterns = flat;
  return flat;
}

export type TextSegment =
  | { kind: "text"; value: string }
  | { kind: "term"; value: string; term: string };

export function segmentGlossaryText(text: string): TextSegment[] {
  if (!text) return [];
  const patterns = buildFlatPatterns();
  const segments: TextSegment[] = [];
  let i = 0;

  while (i < text.length) {
    let best: { len: number; term: string; value: string } | null = null;

    for (const { pattern, term, caseSensitive } of patterns) {
      const slice = text.slice(i, i + pattern.length);
      if (slice.length < pattern.length) continue;

      const matches = caseSensitive
        ? slice === pattern
        : slice.toLowerCase() === pattern.toLowerCase();

      if (!matches) continue;
      if (isWordChar(text[i - 1]) || isWordChar(text[i + pattern.length])) continue;

      // patterns sorted longest-first — first hit wins
      best = { len: pattern.length, term, value: slice };
      break;
    }

    if (best) {
      segments.push({ kind: "term", value: best.value, term: best.term });
      i += best.len;
    } else {
      const start = i;
      i += 1;
      while (i < text.length) {
        let found = false;
        for (const { pattern, caseSensitive } of patterns) {
          const slice = text.slice(i, i + pattern.length);
          if (slice.length < pattern.length) continue;
          const matches = caseSensitive
            ? slice === pattern
            : slice.toLowerCase() === pattern.toLowerCase();
          if (
            matches &&
            !isWordChar(text[i - 1]) &&
            !isWordChar(text[i + pattern.length])
          ) {
            found = true;
            break;
          }
        }
        if (found) break;
        i += 1;
      }
      segments.push({ kind: "text", value: text.slice(start, i) });
    }
  }

  return segments;
}

export function findGlossaryTerm(termOrAlias: string): BilingualGlossaryTerm | undefined {
  const upper = termOrAlias.toUpperCase();
  const entries = getGlossaryEntries();
  for (const e of entries) {
    if (e.term.toUpperCase() === upper) return e.data;
    if (e.patterns.some((p) => p.toUpperCase() === upper)) return e.data;
  }
  const aliasTarget = glossaryAliases[termOrAlias] ?? glossaryAliases[upper];
  if (aliasTarget) {
    return entries.find((e) => e.term.toUpperCase() === aliasTarget.toUpperCase())?.data;
  }
  return undefined;
}

/** Exported for tests / debugging. */
export function glossaryPatternCount(): number {
  return buildFlatPatterns().length;
}

export { escapeRegExp };
