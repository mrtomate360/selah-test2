import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Search, X } from "lucide-react";

import { PageHeading } from "@/components/PageHeading";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, totalStock, type CategorySlug, type Product } from "@/lib/catalog";
import { seo } from "@/lib/seo";

const SORTS = ["featured", "newest", "price-asc", "price-desc"] as const;
type Sort = (typeof SORTS)[number];
const SORT_LABEL: Record<Sort, string> = {
  featured: "Destacados",
  newest: "Novedades",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
};
const PRICE_CAPS = [20000, 30000, 50000] as const;

interface ShopSearch {
  category?: CategorySlug;
  q?: string;
  sort?: Sort;
  max?: number;
  stock?: boolean;
  personalized?: boolean;
}

type ShopPatch = { [K in keyof ShopSearch]?: ShopSearch[K] | undefined };

function clean(input: ShopPatch): ShopSearch {
  const out: ShopSearch = {};
  if (input.category) out.category = input.category;
  if (input.q) out.q = input.q;
  if (input.sort && input.sort !== "featured") out.sort = input.sort;
  if (input.max) out.max = input.max;
  if (input.stock) out.stock = true;
  if (input.personalized) out.personalized = true;
  return out;
}

export const Route = createFileRoute("/shop/")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => {
    const patch: ShopPatch = {};
    const category = CATEGORIES.find((c) => c.slug === s["category"])?.slug;
    if (category) patch.category = category;
    if (typeof s["q"] === "string") patch.q = s["q"].slice(0, 60);
    const sort = SORTS.find((x) => x === s["sort"]);
    if (sort) patch.sort = sort;
    const max = PRICE_CAPS.find((x) => x === Number(s["max"]));
    if (max) patch.max = max;
    if (s["stock"] === true || s["stock"] === "true") patch.stock = true;
    if (s["personalized"] === true || s["personalized"] === "true") patch.personalized = true;
    return clean(patch);
  },
  head: () =>
    seo(
      "Tienda — SELAH",
      "Poleras, hoodies, polerones y accesorios SELAH: ropa cristiana minimalista con bordados sutiles y referencias personalizables.",
    ),
  component: Shop,
});

function applyFilters(search: ShopSearch): Product[] {
  const q = search.q?.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => {
    if (search.personalized && !p.embroidery) return false;
    if (search.category && p.category !== search.category) return false;
    if (search.max && p.price > search.max) return false;
    if (search.stock && totalStock(p) === 0) return false;
    if (q && !`${p.name} ${p.tagline} ${p.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
  switch (search.sort) {
    case "newest":
      return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return [...list].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...list].sort((a, b) => b.price - a.price);
    default:
      return list;
  }
}

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop/" });
  const update = (patch: ShopPatch) =>
    navigate({ search: (prev) => clean({ ...prev, ...patch }), replace: true, resetScroll: false });

  const products = applyFilters(search);
  const customProducts = PRODUCTS.filter((product) => product.embroidery);
  const active = CATEGORIES.find((c) => c.slug === search.category);
  const hasFilters = Boolean(search.q || search.max || search.stock || search.category || search.personalized);

  return (
    <>
      <PageHeading
        eyebrow="Tienda"
        title={search.personalized ? "Tu versículo" : active ? active.name : "Toda la colección"}
        lead={
          search.personalized
            ? "Elige una prenda y borda la referencia bíblica que quieras llevar, sin costo adicional."
            : active
              ? active.blurb
              : "Prendas serenas, bordadas con intención."
        }
      />

      <div className="page pb-24 md:pb-32">
        <nav className="flex gap-6 overflow-x-auto border-b border-border pb-4 md:justify-center md:gap-10" aria-label="Categorías">
          <button
            type="button"
            onClick={() => update({ category: undefined, personalized: undefined })}
            data-status={!search.category && !search.personalized ? "active" : undefined}
            className="eyebrow link-line shrink-0"
          >
            Todo
          </button>
          <button
            type="button"
            onClick={() => update({ category: undefined, personalized: true })}
            data-status={search.personalized ? "active" : undefined}
            className="eyebrow link-line inline-flex shrink-0 items-center gap-2"
          >
            <BookOpen aria-hidden className="size-3.5" strokeWidth={1.25} />
            Tu versículo
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => update({ category: c.slug, personalized: undefined })}
              data-status={search.category === c.slug ? "active" : undefined}
              className="eyebrow link-line shrink-0"
            >
              {c.name}
            </button>
          ))}
        </nav>

        {!hasFilters && (
          <section className="mt-10 border-y border-border py-10 md:py-14" aria-labelledby="custom-collection-title">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow text-muted-foreground">Personalización incluida</p>
                <h2 id="custom-collection-title" className="mt-3 text-4xl md:text-5xl">Una referencia que sea tuya</h2>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                  Elige el libro, capítulo y versículos. Bordamos solo la referencia en la posición y el tamaño propios de cada prenda.
                </p>
              </div>
              <button type="button" onClick={() => update({ personalized: true })} className="btn btn-line shrink-0 self-start md:self-auto">
                Ver solo personalizables
              </button>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3">
              {customProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end md:gap-8">
          <label className="relative block">
            <span className="sr-only">Buscar productos</span>
            <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.25} />
            <input
              type="search"
              value={search.q ?? ""}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Buscar: hoodie, salvia, bordado…"
              maxLength={60}
              className="field pl-7"
            />
          </label>
          <label className="block">
            <span className="eyebrow text-[0.5625rem] text-muted-foreground">Precio</span>
            <select
              value={search.max ?? ""}
              onChange={(e) => update({ max: e.target.value ? Number(e.target.value) : undefined })}
              className="field min-w-40"
            >
              <option value="">Todos</option>
              {PRICE_CAPS.map((cap) => (
                <option key={cap} value={cap}>
                  Hasta ${cap / 1000}.000
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow text-[0.5625rem] text-muted-foreground">Ordenar</span>
            <select
              value={search.sort ?? "featured"}
              onChange={(e) => update({ sort: SORTS.find((s) => s === e.target.value) })}
              className="field min-w-52"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {SORT_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={search.stock ?? false}
              onChange={(e) => update({ stock: e.target.checked })}
              className="size-4 accent-primary"
            />
            Solo disponibles
          </label>
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>
          {hasFilters && (
            <Link to="/shop" className="eyebrow link-line inline-flex items-center gap-1.5 text-[0.625rem]">
              <X className="size-3" /> Limpiar filtros
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-28 text-center">
            <h2 className="text-4xl">Nada por aquí</h2>
            <p className="mt-3 text-muted-foreground">Prueba con otra búsqueda o quita algún filtro.</p>
            <Link to="/shop" className="btn btn-line mt-8">
              Ver todo
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
