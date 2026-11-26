import { BIBLE_BOOKS } from "@/lib/embroidery";

export const BIBLE_VERSION = "Reina-Valera 1960";

const bookCache = new Map<number, Promise<string[][]>>();

/**
 * Loads one book at a time from the static Reina-Valera 1960 text derived from
 * https://github.com/thiagobodruk/bible/blob/master/json/es_rvr1960.json.
 */
export function loadBibleChapter(book: string, chapter: number, signal?: AbortSignal): Promise<string[]> {
  const bookIndex = BIBLE_BOOKS.findIndex((candidate) => candidate.name === book);
  if (bookIndex < 0 || !Number.isInteger(chapter) || chapter < 1) return Promise.resolve([]);

  const fileNumber = bookIndex + 1;
  let request = bookCache.get(fileNumber);
  if (!request) {
    request = fetch(`/bible/rvr1960/${fileNumber}.json`, signal ? { signal } : {}).then((response) => {
      if (!response.ok) throw new Error("No se pudo cargar el texto bíblico");
      return response.json() as Promise<string[][]>;
    });
    bookCache.set(fileNumber, request);
    request.catch(() => bookCache.delete(fileNumber));
  }

  return request.then((chapters) => chapters[chapter - 1] ?? []);
}
