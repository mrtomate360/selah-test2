import { BIBLE_VERSE_COUNTS } from "@/lib/bible-data";

export interface EmbroiderySelection {
  book: string;
  chapter: number;
  fromVerse: number;
  toVerse: number;
}

export interface EmbroideryConfig {
  position: string;
  size: "Pequeño" | "Grande";
  defaultSelection: EmbroiderySelection;
}

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

export function isValidSelection(selection: EmbroiderySelection): boolean {
  const availableVerses = verseCount(selection.book, selection.chapter);
  return Boolean(
    availableVerses &&
      Number.isInteger(selection.fromVerse) &&
      Number.isInteger(selection.toVerse) &&
      selection.fromVerse >= 1 &&
      selection.toVerse >= selection.fromVerse &&
      selection.toVerse <= availableVerses,
  );
}
