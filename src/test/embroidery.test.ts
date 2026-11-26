import { describe, expect, it } from "vitest";

import { itemKey } from "@/lib/cart";
import { BIBLE_BOOKS, formatReference, isValidSelection, verseCount, type EmbroiderySelection } from "@/lib/embroidery";
import { DEMO_ORDERS } from "@/lib/demo-data";

const psalm: EmbroiderySelection = { book: "Salmos", chapter: 23, fromVerse: 1, toVerse: 6 };

describe("embroidered Bible references", () => {
  it("formats the selected passage as Salmo 23:1-6", () => {
    expect(formatReference(psalm)).toBe("Salmo 23:1-6");
  });

  it("accepts a real chapter and rejects reversed verses or a chapter outside the book", () => {
    expect(isValidSelection(psalm)).toBe(true);
    expect(isValidSelection({ ...psalm, fromVerse: 6, toVerse: 1 })).toBe(false);
    expect(isValidSelection({ ...psalm, chapter: 151 })).toBe(false);
  });

  it("limits Salmo 23 to its six actual verses instead of the book maximum", () => {
    expect(verseCount("Salmos", 23)).toBe(6);
    expect(isValidSelection({ ...psalm, fromVerse: 6, toVerse: 6 })).toBe(true);
    expect(isValidSelection({ ...psalm, fromVerse: 7, toVerse: 7 })).toBe(false);
  });

  it("accepts Juan 3:36 and rejects the nonexistent Juan 3:37", () => {
    const john = { book: "Juan", chapter: 3, fromVerse: 36, toVerse: 36 };
    expect(verseCount("Juan", 3)).toBe(36);
    expect(isValidSelection(john)).toBe(true);
    expect(isValidSelection({ ...john, fromVerse: 37, toVerse: 37 })).toBe(false);
  });

  it("contains all 66 books and their 1,189 chapters", () => {
    expect(BIBLE_BOOKS).toHaveLength(66);
    expect(BIBLE_BOOKS.reduce((sum, book) => sum + book.chapters, 0)).toBe(1189);
  });

  it("keeps identical variants with different references as separate bag lines", () => {
    const base = { productId: "p-hoodie-back", color: "Marfil", size: "M" };
    expect(itemKey({ ...base, embroideryReference: "Salmo 23:1-6" })).not.toBe(
      itemKey({ ...base, embroideryReference: "Juan 3:16" }),
    );
  });

  it("includes the requested reference and fixed placement in the admin order", () => {
    const item = DEMO_ORDERS.find((order) => order.id === "DEMO-1042")?.items[0];
    expect(item?.embroidery).toEqual({ reference: "Salmo 23:1-6", position: "Espalda", size: "Grande" });
  });
});
