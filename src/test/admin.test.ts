import { describe, expect, it } from "vitest";

import { filterOrders, filterProducts, parsePrice } from "@/lib/admin";
import { PRODUCTS, totalStock } from "@/lib/catalog";
import { DEMO_ORDERS } from "@/lib/demo-data";

describe("admin price", () => {
  it("accepts 54990 and other amounts ending in 0", () => {
    expect(parsePrice("54990")).toBe(54990);
    expect(parsePrice("10")).toBe(10);
    expect(parsePrice("24995")).toBe(24995);
  });

  it("rejects an empty or zero price", () => {
    expect(parsePrice("")).toBeNull();
    expect(parsePrice("0")).toBeNull();
  });
});

describe("demo catalog", () => {
  it("includes a sold-out product", () => {
    expect(PRODUCTS.some((p) => totalStock(p) === 0)).toBe(true);
  });
});

describe("admin filters", () => {
  it("finds products by name ignoring accents and lists only sold-out ones on request", () => {
    const byName = filterProducts(PRODUCTS, { query: "poleron", category: "all", stock: "all" });
    expect(byName.map((p) => p.id)).toEqual(["p-sweatshirt"]);
    const soldOut = filterProducts(PRODUCTS, { query: "", category: "all", stock: "out" });
    expect(soldOut.length).toBeGreaterThan(0);
    expect(soldOut.every((p) => totalStock(p) === 0)).toBe(true);
  });

  it("filters orders by status and customer", () => {
    const shipped = filterOrders(DEMO_ORDERS, { query: "clienta demo", status: "shipped" });
    expect(shipped.map((o) => o.id)).toEqual(["DEMO-1042"]);
  });
});
