import { BIBLE_VERSE_COUNTS } from "@/lib/bible-data";

export interface EmbroiderySelection {
  book: string;
  chapter: number;
  fromVerse: number;
  toVerse: number;
  /** Verses within the range whose complete text will be embroidered. */
  textVerses: number[];
}

export interface EmbroideryConfig {
  position: string;
  size: "Pequeño" | "Grande";
  defaultSelection: EmbroiderySelection;
}

export interface EmbroideredVerse {
  verse: number;
  text: string;
}

/** CLP surcharge for each verse with full text on a large design. */
export const TEXT_VERSE_PRICE = 1000;

/** Protestant canon, with exact chapter counts used to constrain the picker. */
export const BIBLE_BOOKS = Object.entries(BIBLE_VERSE_COUNTS).map(([name, chapters]) => ({
  name,
  chapters: chapters.length,
}));

export function verseCount(book: string, chapter: number): number {
  if (!Number.isInteger(chapter) || chapter < 1) return 0;
  return BIBLE_VERSE_COUNTS[book]?.[chapter - 1] ?? 0;
}

export function singularBookName(book: string): string {
  return book === "Salmos" ? "Salmo" : book;
}

export function formatReference(selection: EmbroiderySelection): string {
  const verses = selection.fromVerse === selection.toVerse
    ? String(selection.fromVerse)
    : `${selection.fromVerse}-${selection.toVerse}`;
  return `${singularBookName(selection.book)} ${selection.chapter}:${verses}`;
}

export function normalizeTextVerses(selection: EmbroiderySelection): number[] {
  return [...new Set(selection.textVerses)]
    .filter(
      (verse) =>
        Number.isInteger(verse) &&
        verse >= selection.fromVerse &&
        verse <= selection.toVerse,
    )
    .sort((a, b) => a - b);
}

export function isValidSelection(selection: EmbroiderySelection): boolean {
  const availableVerses = verseCount(selection.book, selection.chapter);
  const textVerses = selection.textVerses;
  return Boolean(
    availableVerses &&
      Number.isInteger(selection.fromVerse) &&
      Number.isInteger(selection.toVerse) &&
      selection.fromVerse >= 1 &&
      selection.toVerse >= selection.fromVerse &&
      selection.toVerse <= availableVerses &&
      textVerses.every(
        (verse) =>
          Number.isInteger(verse) &&
          verse >= selection.fromVerse &&
          verse <= selection.toVerse,
      ) &&
      new Set(textVerses).size === textVerses.length,
  );
}

export function embroideryTextSurcharge(
  config: EmbroideryConfig,
  selection: EmbroiderySelection | undefined,
): number {
  if (config.size !== "Grande" || !selection || !isValidSelection(selection)) return 0;
  return normalizeTextVerses(selection).length * TEXT_VERSE_PRICE;
}

export function formatVerseList(verses: number[]): string {
  const sorted = [...new Set(verses)].sort((a, b) => a - b);
  if (sorted.length < 2) return sorted[0]?.toString() ?? "";
  if (sorted.length === 2) return `${sorted[0]} y ${sorted[1]}`;
  return `${sorted.slice(0, -1).join(", ")} y ${sorted.at(-1)}`;
}
