import { describe, expect, it } from "vitest";

import { itemKey } from "@/lib/cart";
import { formatReference, isValidSelection, type EmbroiderySelection } from "@/lib/embroidery";
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
