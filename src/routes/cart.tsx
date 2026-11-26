import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

import { PageHeading } from "@/components/PageHeading";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => seo("Tu bolsa — SELAH", "Revisa los productos de tu bolsa SELAH antes de continuar al pago."),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="page py-28 text-center md:py-40">
        <p className="eyebrow text-muted-foreground">Tu bolsa</p>
        <h1 className="mt-4 text-5xl md:text-7xl">Está vacía, por ahora</h1>
        <p className="mx-auto mt-5 max-w-md text-muted-foreground">Tómate tu tiempo. Las prendas te esperan.</p>
        <Link to="/shop" className="btn btn-solid mt-10">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeading eyebrow="Tu bolsa" title="Bolsa" />
      <div className="page grid gap-10 pb-24 lg:grid-cols-[1fr_24rem] lg:gap-16 lg:pb-32">
        <ul className="divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <li key={line.key} className="grid grid-cols-[5.5rem_1fr] gap-4 py-6 md:grid-cols-[7rem_1fr] md:gap-6">
              <Link to="/shop/$slug" params={{ slug: line.product.slug }} className="aspect-[4/5] overflow-hidden bg-card">
                <img src={line.product.images[0]} alt={line.product.name} className="size-full object-cover" />
              </Link>
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl leading-tight">{line.product.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {line.color} · {line.size}
                    </p>
                  </div>
                  <button type="button" onClick={() => remove(line.key)} aria-label={`Quitar ${line.product.name}`} className="-mr-2 -mt-1 p-2">
                    <X className="size-4" strokeWidth={1.25} />
                  </button>
                </div>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="flex items-center border border-input">
                    <button type="button" className="grid size-10 place-items-center" aria-label="Menos" onClick={() => setQuantity(line.key, line.quantity - 1)}>
                      <Minus className="size-3" />
                    </button>
                    <span className="w-7 text-center text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      className="grid size-10 place-items-center disabled:opacity-40"
                      aria-label="Más"
                      disabled={line.quantity >= line.stock}
                      onClick={() => setQuantity(line.key, line.quantity + 1)}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <p>{formatPrice(line.lineTotal)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <OrderSummary>
          <Link to="/checkout" className="btn btn-solid mt-6 w-full">
            Continuar al pago
          </Link>
          <Link to="/shop" className="eyebrow link-line mt-5 inline-block text-[0.625rem]">
            Seguir comprando
          </Link>
        </OrderSummary>
      </div>
    </>
  );
}
