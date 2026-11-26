import { totalStock, type CategorySlug, type Product } from "@/lib/catalog";
import type { DemoCustomer, DemoOrder, OrderStatus } from "@/lib/demo-data";

/** Stock at or below this many units counts as low in the admin panel. */
export const LOW_STOCK = 5;

export type StockFilter = "all" | "in" | "low" | "out";

/** Keeps only the digits of what was typed, so any whole peso amount is accepted. */
export function priceDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 9);
}

/** Whole CLP amount typed in the price box, or null when it is empty or zero. */
export function parsePrice(value: string): number | null {
  const amount = Number(priceDigits(value));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** True when every word of the query appears somewhere in the given texts, ignoring case and accents. */
export function matchesQuery(query: string, ...texts: string[]): boolean {
  const haystack = normalize(texts.join(" "));
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function filterProducts(
  products: Product[],
  filter: { query: string; category: CategorySlug | "all"; stock: StockFilter },
): Product[] {
  return products.filter((p) => {
    const stock = totalStock(p);
    const stockOk =
      filter.stock === "all" ||
      (filter.stock === "out" && stock === 0) ||
      (filter.stock === "low" && stock > 0 && stock <= LOW_STOCK) ||
      (filter.stock === "in" && stock > 0);
    return (
      stockOk &&
      (filter.category === "all" || p.category === filter.category) &&
      matchesQuery(filter.query, p.name, p.colors.map((c) => c.name).join(" "))
    );
  });
}

export function filterOrders(
  orders: DemoOrder[],
  filter: { query: string; status: OrderStatus | "all" },
): DemoOrder[] {
  return orders.filter(
    (o) =>
      (filter.status === "all" || o.status === filter.status) &&
      matchesQuery(filter.query, o.id, o.customer, o.email, o.items.map((i) => i.name).join(" ")),
  );
}

export function filterCustomers(
  customers: DemoCustomer[],
  filter: { query: string; city: string },
): DemoCustomer[] {
  return customers.filter(
    (c) =>
      (filter.city === "all" || c.city === filter.city) &&
      matchesQuery(filter.query, c.name, c.email, c.city),
  );
}
