import * as Dialog from "@radix-ui/react-dialog";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import fallbackImage from "@/assets/tote.jpg";
import { DemoNotice } from "@/components/DemoNotice";
import { PageHeading } from "@/components/PageHeading";
import {
  filterCustomers,
  filterOrders,
  filterProducts,
  LOW_STOCK,
  parsePrice,
  priceDigits,
  type StockFilter,
} from "@/lib/admin";
import {
  CATEGORIES,
  categoryName,
  formatPrice,
  PRODUCTS,
  SWATCHES,
  totalStock,
  type CategorySlug,
  type Product,
  type Variant,
} from "@/lib/catalog";
import {
  DEMO_CUSTOMERS,
  DEMO_ORDERS,
  formatDate,
  ORDER_STATUSES,
  STATUS_LABEL,
  type DemoOrder,
  type OrderStatus,
} from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      ...seo("Administración — SELAH", "Panel de administración de la tienda SELAH.").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Tab = "products" | "orders" | "customers";
const TABS: { id: Tab; label: string }[] = [
  { id: "products", label: "Productos" },
  { id: "orders", label: "Pedidos" },
  { id: "customers", label: "Clientes" },
];

interface Draft {
  id: string | null;
  name: string;
  category: CategorySlug;
  price: string;
  description: string;
  colors: string;
  sizes: string;
  image: string;
  variants: Variant[];
}

function splitList(value: string): string[] {
  return [
    ...new Set(
      value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ];
}

function rebuildVariants(colors: string, sizes: string, previous: Variant[]): Variant[] {
  return splitList(colors).flatMap((color) =>
    splitList(sizes).map((size) => ({
      color,
      size,
      stock: previous.find((v) => v.color === color && v.size === size)?.stock ?? 0,
    })),
  );
}

function emptyDraft(): Draft {
  const colors = "Marfil";
  const sizes = "S, M, L";
  return {
    id: null,
    name: "",
    category: "t-shirts",
    price: "",
    description: "",
    colors,
    sizes,
    image: "",
    variants: rebuildVariants(colors, sizes, []),
  };
}

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: String(p.price),
    description: p.description,
    colors: p.colors.map((c) => c.name).join(", "),
    sizes: p.sizes.join(", "),
    image: p.images[0] ?? "",
    variants: p.variants,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Admin() {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<DemoOrder[]>(DEMO_ORDERS);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [productFilter, setProductFilter] = useState<{
    query: string;
    category: CategorySlug | "all";
    stock: StockFilter;
  }>({
    query: "",
    category: "all",
    stock: "all",
  });
  const [orderFilter, setOrderFilter] = useState<{ query: string; status: OrderStatus | "all" }>({
    query: "",
    status: "all",
  });
  const [customerFilter, setCustomerFilter] = useState({ query: "", city: "all" });

  const shownProducts = filterProducts(products, productFilter);
  const shownOrders = filterOrders(orders, orderFilter);
  const shownCustomers = filterCustomers(DEMO_CUSTOMERS, customerFilter);
  const cities = [...new Set(DEMO_CUSTOMERS.map((c) => c.city))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  const revenue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "pending")
    .reduce((s, o) => s + o.total, 0);
  const units = products.reduce((s, p) => s + totalStock(p), 0);
  const stats = [
    { label: "Ventas (demo)", value: formatPrice(revenue) },
    { label: "Pedidos", value: String(orders.length) },
    { label: "Productos", value: String(products.length) },
    { label: "Unidades en stock", value: String(units) },
  ];

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const price = parsePrice(draft.price);
    if (!draft.name.trim() || price === null || draft.variants.length === 0) {
      toast.error("Revisa el nombre, el precio y agrega al menos un color y una talla.");
      return;
    }
    const existing = products.find((p) => p.id === draft.id);
    const colorNames = splitList(draft.colors);
    const product: Product = {
      id: existing?.id ?? `p-${Date.now()}`,
      slug: existing?.slug ?? slugify(draft.name),
      name: draft.name.trim(),
      category: draft.category,
      price,
      tagline: existing?.tagline ?? "",
      description: draft.description.trim(),
      details: existing?.details ?? [],
      images: draft.image
        ? [draft.image, ...(existing?.images.slice(1) ?? [])]
        : (existing?.images ?? [fallbackImage]),
      colors: colorNames.map((name) => ({
        name,
        swatch: existing?.colors.find((c) => c.name === name)?.swatch ?? SWATCHES.natural,
      })),
      sizes: splitList(draft.sizes),
      variants: draft.variants,
      bestSeller: existing?.bestSeller ?? false,
      isNew: existing?.isNew ?? true,
      createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) =>
      existing ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev],
    );
    setDraft(null);
    toast.success(
      existing
        ? "Producto actualizado (solo en esta vista previa)"
        : "Producto creado (solo en esta vista previa)",
    );
  };

  const updateDraft = (patch: Partial<Draft>) =>
    setDraft((d) => {
      if (!d) return d;
      const next = { ...d, ...patch };
      if (patch.colors !== undefined || patch.sizes !== undefined) {
        next.variants = rebuildVariants(next.colors, next.sizes, d.variants);
      }
      return next;
    });

  return (
    <>
      <PageHeading eyebrow="Administración" title="Panel SELAH" />
      <div className="page pb-24 md:pb-32">
        <DemoNotice>
          Vista previa del panel con datos de ejemplo. Los cambios no se guardan ni aparecen en la
          tienda, y esta página aún no está protegida: el acceso seguro para administradores se
          activa al conectar la tienda.
        </DemoNotice>

        <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card p-5 md:p-6">
              <dt className="eyebrow text-[0.5625rem] text-muted-foreground">{s.label}</dt>
              <dd className="mt-3 font-serif text-3xl md:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap items-center gap-8 border-b border-border pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              data-status={tab === t.id ? "active" : undefined}
              className="eyebrow link-line"
            >
              {t.label}
            </button>
          ))}
          {tab === "products" && (
            <button
              type="button"
              className="btn btn-solid btn-sm ml-auto"
              onClick={() => setDraft(emptyDraft())}
            >
              <Plus className="size-3.5" /> Nuevo producto
            </button>
          )}
        </div>

        {tab === "products" && (
          <FilterBar
            label="Buscar productos"
            placeholder="Buscar por nombre o color"
            query={productFilter.query}
            onQuery={(query) => setProductFilter((f) => ({ ...f, query }))}
            count={shownProducts.length}
            total={products.length}
          >
            <select
              aria-label="Filtrar por categoría"
              className="field-box md:w-44"
              value={productFilter.category}
              onChange={(e) => {
                const category = CATEGORIES.find((c) => c.slug === e.target.value)?.slug ?? "all";
                setProductFilter((f) => ({ ...f, category }));
              }}
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrar por stock"
              className="field-box md:w-40"
              value={productFilter.stock}
              onChange={(e) => {
                const stock = STOCK_FILTERS.find((s) => s.id === e.target.value)?.id ?? "all";
                setProductFilter((f) => ({ ...f, stock }));
              }}
            >
              {STOCK_FILTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </FilterBar>
        )}

        {tab === "products" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="eyebrow text-[0.5625rem] text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 font-medium">Producto</th>
                  <th className="py-3 font-medium">Categoría</th>
                  <th className="py-3 font-medium">Tallas</th>
                  <th className="py-3 font-medium">Stock</th>
                  <th className="py-3 font-medium">Precio</th>
                  <th className="py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shownProducts.length === 0 && (
                  <EmptyRow columns={6}>Ningún producto coincide con la búsqueda.</EmptyRow>
                )}
                {shownProducts.map((p) => {
                  const stock = totalStock(p);
                  return (
                    <tr key={p.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="h-14 w-11 bg-card object-cover"
                          />
                          <span className="font-serif text-lg">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3">{categoryName(p.category)}</td>
                      <td className="py-3 text-muted-foreground">{p.sizes.join(" · ")}</td>
                      <td className="py-3">
                        <span className={stock <= LOW_STOCK ? "bg-accent px-2 py-1" : ""}>
                          {stock === 0 ? "Agotado" : stock}
                        </span>
                      </td>
                      <td className="py-3">{formatPrice(p.price)}</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          className="p-2"
                          aria-label={`Editar ${p.name}`}
                          onClick={() => setDraft(toDraft(p))}
                        >
                          <Pencil className="size-4" strokeWidth={1.25} />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-destructive"
                          aria-label={`Eliminar ${p.name}`}
                          onClick={() => {
                            if (window.confirm(`¿Eliminar "${p.name}" de esta vista previa?`)) {
                              setProducts((prev) => prev.filter((x) => x.id !== p.id));
                            }
                          }}
                        >
                          <Trash2 className="size-4" strokeWidth={1.25} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "orders" && (
          <FilterBar
            label="Buscar pedidos"
            placeholder="Buscar por número, cliente, correo o producto"
            query={orderFilter.query}
            onQuery={(query) => setOrderFilter((f) => ({ ...f, query }))}
            count={shownOrders.length}
            total={orders.length}
          >
            <select
              aria-label="Filtrar por estado"
              className="field-box md:w-44"
              value={orderFilter.status}
              onChange={(e) => {
                const status = ORDER_STATUSES.find((s) => s === e.target.value) ?? "all";
                setOrderFilter((f) => ({ ...f, status }));
              }}
            >
              <option value="all">Todos los estados</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </FilterBar>
        )}

        {tab === "orders" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="eyebrow text-[0.5625rem] text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 font-medium">Pedido</th>
                  <th className="py-3 font-medium">Cliente</th>
                  <th className="py-3 font-medium">Fecha</th>
                  <th className="py-3 font-medium">Productos</th>
                  <th className="py-3 font-medium">Total</th>
                  <th className="py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shownOrders.length === 0 && (
                  <EmptyRow columns={6}>Ningún pedido coincide con la búsqueda.</EmptyRow>
                )}
                {shownOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-4 font-serif text-lg">{o.id}</td>
                    <td className="py-4">
                      {o.customer}
                      <span className="block text-xs text-muted-foreground">{o.email}</span>
                    </td>
                    <td className="py-4">{formatDate(o.date)}</td>
                    <td className="py-4 text-muted-foreground">
                      {o.items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}
                    </td>
                    <td className="py-4">{formatPrice(o.total)}</td>
                    <td className="py-4">
                      <select
                        aria-label={`Estado del pedido ${o.id}`}
                        value={o.status}
                        onChange={(e) => {
                          const status = ORDER_STATUSES.find((s) => s === e.target.value) as
                            OrderStatus | undefined;
                          if (status)
                            setOrders((prev) =>
                              prev.map((x) => (x.id === o.id ? { ...x, status } : x)),
                            );
                        }}
                        className="field-box w-36"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "customers" && (
          <FilterBar
            label="Buscar clientes"
            placeholder="Buscar por nombre, correo o ciudad"
            query={customerFilter.query}
            onQuery={(query) => setCustomerFilter((f) => ({ ...f, query }))}
            count={shownCustomers.length}
            total={DEMO_CUSTOMERS.length}
          >
            <select
              aria-label="Filtrar por ciudad"
              className="field-box md:w-44"
              value={customerFilter.city}
              onChange={(e) => setCustomerFilter((f) => ({ ...f, city: e.target.value }))}
            >
              <option value="all">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </FilterBar>
        )}

        {tab === "customers" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="eyebrow text-[0.5625rem] text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 font-medium">Cliente</th>
                  <th className="py-3 font-medium">Ciudad</th>
                  <th className="py-3 font-medium">Pedidos</th>
                  <th className="py-3 font-medium">Total comprado</th>
                  <th className="py-3 font-medium">Desde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shownCustomers.length === 0 && (
                  <EmptyRow columns={5}>Ningún cliente coincide con la búsqueda.</EmptyRow>
                )}
                {shownCustomers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-4">
                      <span className="font-serif text-lg">{c.name}</span>
                      <span className="block text-xs text-muted-foreground">{c.email}</span>
                    </td>
                    <td className="py-4">{c.city}</td>
                    <td className="py-4">{c.orders}</td>
                    <td className="py-4">{formatPrice(c.spent)}</td>
                    <td className="py-4">{formatDate(c.joined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog.Root open={draft !== null} onOpenChange={(o) => !o && setDraft(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-background p-6 shadow-[var(--shadow-soft)] md:p-10">
            <div className="flex items-start justify-between">
              <Dialog.Title className="font-serif text-4xl">
                {draft?.id ? "Editar producto" : "Nuevo producto"}
              </Dialog.Title>
              <Dialog.Close className="-mr-2 p-2" aria-label="Cerrar">
                <X className="size-5" strokeWidth={1.25} />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              Los cambios solo viven en esta vista previa.
            </Dialog.Description>
            {draft && (
              <form onSubmit={save} className="mt-8 space-y-5">
                <AdminField label="Nombre">
                  <input
                    className="field-box"
                    required
                    maxLength={100}
                    value={draft.name}
                    onChange={(e) => updateDraft({ name: e.target.value })}
                  />
                </AdminField>
                <div className="grid grid-cols-2 gap-4">
                  <AdminField label="Categoría">
                    <select
                      className="field-box"
                      value={draft.category}
                      onChange={(e) => {
                        const category = CATEGORIES.find((c) => c.slug === e.target.value)?.slug;
                        if (category) updateDraft({ category });
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label="Precio (CLP)">
                    <input
                      className="field-box"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="54990"
                      required
                      value={draft.price}
                      onChange={(e) => updateDraft({ price: priceDigits(e.target.value) })}
                    />
                  </AdminField>
                </div>
                <AdminField label="Descripción">
                  <textarea
                    className="field-box"
                    rows={3}
                    maxLength={600}
                    value={draft.description}
                    onChange={(e) => updateDraft({ description: e.target.value })}
                  />
                </AdminField>
                <AdminField label="Imagen">
                  <div className="flex items-center gap-4">
                    {draft.image && (
                      <img src={draft.image} alt="" className="h-20 w-16 bg-card object-cover" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="text-sm file:mr-3 file:border file:border-input file:bg-card file:px-3 file:py-2 file:text-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateDraft({ image: URL.createObjectURL(file) });
                      }}
                    />
                  </div>
                </AdminField>
                <div className="grid grid-cols-2 gap-4">
                  <AdminField label="Colores (separados por coma)">
                    <input
                      className="field-box"
                      maxLength={120}
                      value={draft.colors}
                      onChange={(e) => updateDraft({ colors: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Tallas (separadas por coma)">
                    <input
                      className="field-box"
                      maxLength={120}
                      value={draft.sizes}
                      onChange={(e) => updateDraft({ sizes: e.target.value })}
                    />
                  </AdminField>
                </div>
                <div>
                  <p className="eyebrow text-[0.5625rem] text-muted-foreground">
                    Inventario por variante
                  </p>
                  <ul className="mt-3 grid grid-cols-2 gap-3">
                    {draft.variants.map((v, i) => (
                      <li key={`${v.color}-${v.size}`}>
                        <label className="flex items-center justify-between gap-3 text-sm">
                          <span>
                            {v.color} · {v.size}
                          </span>
                          <input
                            type="number"
                            min={0}
                            className="field-box w-20"
                            value={v.stock}
                            onChange={(e) => {
                              const stock = Math.max(0, Math.floor(Number(e.target.value) || 0));
                              setDraft((d) =>
                                d
                                  ? {
                                      ...d,
                                      variants: d.variants.map((x, xi) =>
                                        xi === i ? { ...x, stock } : x,
                                      ),
                                    }
                                  : d,
                              );
                            }}
                          />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-solid flex-1">
                    Guardar
                  </button>
                  <button type="button" className="btn btn-line" onClick={() => setDraft(null)}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

const STOCK_FILTERS: { id: StockFilter; label: string }[] = [
  { id: "all", label: "Todo el stock" },
  { id: "in", label: "Con stock" },
  { id: "low", label: "Stock bajo" },
  { id: "out", label: "Agotados" },
];

function FilterBar({
  label,
  placeholder,
  query,
  onQuery,
  count,
  total,
  children,
}: {
  label: string;
  placeholder: string;
  query: string;
  onQuery: (query: string) => void;
  count: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative md:flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.25}
        />
        <input
          type="search"
          aria-label={label}
          placeholder={placeholder}
          maxLength={80}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="field-box pl-10"
        />
      </div>
      {children}
      <p
        className="shrink-0 text-xs text-muted-foreground md:w-16 md:text-right"
        aria-live="polite"
      >
        {count} de {total}
      </p>
    </div>
  );
}

function EmptyRow({ columns, children }: { columns: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={columns} className="py-12 text-center text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block text-[0.5625rem] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
