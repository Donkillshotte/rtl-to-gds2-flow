import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Stable HTML id for glossary anchors (spaces / punctuation → hyphen). */
export function glossaryTermId(term: string): string {
  return `glossary-term-${term.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}
