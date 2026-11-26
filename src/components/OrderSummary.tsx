import type { ReactNode } from "react";

import { FREE_SHIPPING_FROM, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

export function OrderSummary({ children }: { children?: ReactNode }) {
  const { subtotal, shipping, total } = useCart();
  return (
    <aside className="bg-card p-6 md:p-8 lg:sticky lg:top-36 lg:self-start">
      <h2 className="text-3xl">Resumen</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-lg">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Envío gratis desde {formatPrice(FREE_SHIPPING_FROM)}. Tarifas de demostración.
      </p>
      {children}
    </aside>
  );
}

