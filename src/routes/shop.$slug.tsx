import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { categoryName, formatPrice, getProduct, PRODUCTS, variantStock } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug, name: product.name, tagline: product.tagline };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(`${loaderData.name} — SELAH`, `${loaderData.tagline}. Ropa cristiana minimalista de SELAH.`)
      : { meta: [{ title: "No disponible — SELAH" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="page py-32 text-center">
      <h1 className="text-5xl">Producto no encontrado</h1>
      <Link to="/shop" className="btn btn-line mt-8">
        Volver a la tienda
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="page py-32 text-center">
      <h1 className="text-5xl">No pudimos cargar este producto</h1>
      <Link to="/shop" className="btn btn-line mt-8">
        Volver a la tienda
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const product = getProduct(slug);
  if (!product) return null;
  return <ProductView key={product.id} slug={slug} />;
}

function ProductView({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const { add } = useCart();
  const [image, setImage] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const firstAvailable = product.sizes.find((s) => variantStock(product, color, s) > 0);
  const [size, setSize] = useState(product.sizes.length === 1 ? (product.sizes[0] ?? "") : "");
  const [qty, setQty] = useState(1);

  const stock = size ? variantStock(product, color, size) : 0;
  const colorSoldOut = !firstAvailable;
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const pickColor = (name: string) => {
    setColor(name);
    setQty(1);
    if (size && variantStock(product, name, size) === 0 && product.sizes.length > 1) setSize("");
  };

  const addToBag = () => {
    if (!size || stock === 0) return;
    add({ productId: product.id, color, size, quantity: Math.min(qty, stock) });
    toast.success("Agregado a tu bolsa", { description: `${product.name} · ${color} · ${size}` });
  };

  let stockLabel = "Elige una talla para ver disponibilidad";
  if (colorSoldOut) stockLabel = "Agotado en este color";
  else if (size) stockLabel = stock === 0 ? "Agotado" : stock <= 3 ? `Quedan solo ${stock}` : "Disponible";

  return (
    <>
      <div className="page pt-6 text-xs text-muted-foreground">
        <Link to="/shop" className="link-line">
          Tienda
        </Link>
        <span className="mx-2">/</span>
        <Link to="/shop" search={{ category: product.category }} className="link-line">
          {categoryName(product.category)}
        </Link>
      </div>

      <div className="page grid gap-10 pb-20 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-28">
        <div className="grid gap-3 md:grid-cols-[5rem_1fr]">
          <div className="order-2 flex gap-3 md:order-1 md:flex-col">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setImage(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={`aspect-[4/5] w-16 overflow-hidden border md:w-full ${i === image ? "border-primary" : "border-transparent opacity-70"}`}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 aspect-[4/5] overflow-hidden bg-card md:order-2">
            <img src={product.images[image] ?? product.images[0]} alt={product.name} className="size-full object-cover" />
          </div>
        </div>

        <div className="lg:sticky lg:top-36 lg:self-start">
          <p className="eyebrow text-muted-foreground">{categoryName(product.category)}</p>
          <h1 className="mt-3 text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-3 font-serif text-xl italic text-muted-foreground">{product.tagline}</p>
          <p className="mt-6 text-2xl">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-9">
            <p className="eyebrow text-[0.625rem]">
              Color <span className="ml-2 normal-case tracking-normal text-muted-foreground">{color}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => pickColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={c.name === color}
                  className={`grid size-9 place-items-center rounded-full border ${c.name === color ? "border-primary" : "border-transparent"}`}
                >
                  <span className="size-6 rounded-full border border-border" style={{ backgroundColor: c.swatch }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <p className="eyebrow text-[0.625rem]">Talla</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const out = variantStock(product, color, s) === 0;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={out}
                    onClick={() => {
                      setSize(s);
                      setQty(1);
                    }}
                    aria-pressed={s === size}
                    className={`min-h-11 min-w-12 border px-4 text-sm transition-colors ${
                      s === size ? "border-primary bg-primary text-primary-foreground" : "border-input"
                    } ${out ? "cursor-not-allowed text-muted-foreground line-through opacity-50" : "hover:border-primary"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {stockLabel}
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex items-center border border-input">
              <button type="button" className="grid size-12 place-items-center" aria-label="Menos" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                className="grid size-12 place-items-center disabled:opacity-40"
                aria-label="Más"
                disabled={!size || qty >= stock}
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button type="button" className="btn btn-solid flex-1" disabled={!size || stock === 0} onClick={addToBag}>
              {colorSoldOut ? "Agotado" : size ? "Agregar a la bolsa" : "Elige tu talla"}
            </button>
          </div>

          <ul className="mt-10 divide-y divide-border border-y border-border text-sm">
            {product.details.map((d) => (
              <li key={d} className="py-3">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="bg-card">
        <div className="page py-20 md:py-28">
          <h2 className="text-center text-4xl md:text-5xl">También te puede gustar</h2>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
