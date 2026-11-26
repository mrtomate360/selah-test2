import { Link } from "@tanstack/react-router";

import { categoryName, formatPrice, totalStock, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = totalStock(product) === 0;
  const second = product.images[1];
  return (
    <Link to="/shop/$slug" params={{ slug: product.slug }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-card">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
        />
        {second && (
          <img
            src={second}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        {(soldOut || product.isNew) && (
          <span className="eyebrow absolute left-3 top-3 bg-background/90 px-3 py-1.5 text-[0.5625rem]">
            {soldOut ? "Agotado" : "Nuevo"}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-[0.5625rem] text-muted-foreground">{categoryName(product.category)}</p>
          <h3 className="mt-1.5 text-xl leading-tight md:text-2xl">{product.name}</h3>
        </div>
        <p className="mt-5 shrink-0 text-sm">{formatPrice(product.price)}</p>
      </div>
      <div className="mt-3 flex gap-1.5">
        {product.colors.map((c) => (
          <span
            key={c.name}
            title={c.name}
            className="size-3 rounded-full border border-border"
            style={{ backgroundColor: c.swatch }}
          />
        ))}
      </div>
    </Link>
  );
}
