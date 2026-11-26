import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import { Field } from "@/components/AuthShell";
import { OrderSummary } from "@/components/OrderSummary";
import { DemoNotice } from "@/components/DemoNotice";
import { PageHeading } from "@/components/PageHeading";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [...seo("Pago — SELAH", "Datos de envío y pago de tu pedido SELAH.").meta, { name: "robots", content: "noindex" }],
  }),
  component: Checkout,
});

function Checkout() {
  const { lines } = useCart();

  if (lines.length === 0) {
    return (
      <div className="page py-32 text-center">
        <h1 className="text-5xl">Tu bolsa está vacía</h1>
        <Link to="/shop" className="btn btn-solid mt-8">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeading eyebrow="Último paso" title="Pago" />
      <div className="page grid gap-10 pb-24 lg:grid-cols-[1fr_24rem] lg:gap-16 lg:pb-32">
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          <DemoNotice>
            Los pagos aún no están activos. No se creará ningún pedido ni se hará ningún cobro desde esta página.
          </DemoNotice>
          <fieldset>
            <legend className="font-serif text-3xl">Contacto</legend>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <Field label="Nombre completo" name="name" autoComplete="name" maxLength={100} />
              <Field label="Correo electrónico" name="email" type="email" autoComplete="email" maxLength={255} />
              <Field label="Teléfono" name="phone" type="tel" autoComplete="tel" placeholder="+56 9" maxLength={20} />
              <Field label="RUT (opcional)" name="rut" maxLength={12} />
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-serif text-3xl">Envío</legend>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Dirección" name="address" autoComplete="street-address" maxLength={160} />
              </div>
              <Field label="Comuna" name="comuna" maxLength={60} />
              <Field label="Región" name="region" maxLength={60} />
            </div>
          </fieldset>
          <div>
            <button type="button" disabled className="btn btn-solid w-full md:w-auto">
              <Lock className="size-3.5" /> Pagar con Mercado Pago
            </button>
            <p className="mt-3 text-sm text-muted-foreground">
              El pago se hará de forma segura en Mercado Pago cuando la tienda esté conectada.
            </p>
          </div>
        </form>

        <OrderSummary>
          <ul className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-4">
                <span>
                  {l.quantity} × {l.product.name}
                  <span className="block text-xs text-muted-foreground">
                    {l.color} · {l.size}
                  </span>
                  {l.embroideryReference && l.product.embroidery && (
                    <span className="mt-1 block text-xs">
                      Bordado: {l.embroideryReference}
                      <span className="block text-muted-foreground">
                        {l.product.embroidery.position} · {l.product.embroidery.size}
                      </span>
                    </span>
                  )}
                </span>
                <span>{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <Link to="/cart" className="eyebrow link-line mt-6 inline-block text-[0.625rem]">
            Editar bolsa
          </Link>
        </OrderSummary>
      </div>
    </>
  );
}
