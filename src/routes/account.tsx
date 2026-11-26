import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Field } from "@/components/AuthShell";
import { DemoNotice } from "@/components/DemoNotice";
import { EmbroideryTextDetails } from "@/components/EmbroideryTextDetails";
import { OrderJourney } from "@/components/OrderJourney";
import { PageHeading } from "@/components/PageHeading";
import { formatPrice, getProductById } from "@/lib/catalog";
import { DEMO_ORDERS, DEMO_PROFILE, formatDate, STATUS_LABEL } from "@/lib/demo-data";
import { notConnected } from "@/lib/notices";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => seo("Mi cuenta — SELAH", "Tu perfil y el historial de tus pedidos SELAH."),
  component: Account,
});

function Account() {
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const [openId, setOpenId] = useState<string | null>(null);
  const orders = DEMO_ORDERS.filter((o) => o.email === DEMO_PROFILE.email);

  return (
    <>
      <PageHeading eyebrow="Mi cuenta" title={`Hola, ${DEMO_PROFILE.name}`} />
      <div className="page max-w-4xl pb-24 md:pb-32">
        <DemoNotice>
          Este es un perfil de ejemplo con pedidos inventados. Cuando las cuentas estén activas, aquí verás tus datos reales.{" "}
          <Link to="/login" className="underline">
            Ver inicio de sesión
          </Link>{" "}
          ·{" "}
          <Link to="/register" className="underline">
            Ver registro
          </Link>
        </DemoNotice>

        <div className="mt-10 flex items-center gap-8 border-b border-border pb-4">
          <button type="button" onClick={() => setTab("orders")} data-status={tab === "orders" ? "active" : undefined} className="eyebrow link-line">
            Pedidos
          </button>
          <button type="button" onClick={() => setTab("profile")} data-status={tab === "profile" ? "active" : undefined} className="eyebrow link-line">
            Perfil
          </button>
          <button type="button" onClick={() => notConnected("Cerrar sesión")} className="eyebrow link-line ml-auto text-muted-foreground">
            Cerrar sesión
          </button>
        </div>

        {tab === "orders" ? (
          <ul className="mt-8 space-y-4">
            {orders.map((o) => {
              const open = openId === o.id;
              const units = o.items.reduce((n, i) => n + i.quantity, 0);
              return (
                <li key={o.id} className="bg-card">
                  <h2>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`order-${o.id}`}
                      onClick={() => setOpenId(open ? null : o.id)}
                      className="flex w-full items-center gap-4 p-6 text-left md:p-8"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="text-3xl">Pedido {o.id}</span>
                          <span className="eyebrow bg-secondary px-3 py-1.5 text-[0.5625rem]">{STATUS_LABEL[o.status]}</span>
                        </span>
                        <span className="mt-2 block font-sans text-sm tracking-normal text-muted-foreground">
                          {formatDate(o.date)} · {units} {units === 1 ? "producto" : "productos"} · {formatPrice(o.total)}
                        </span>
                      </span>
                      <span className="eyebrow hidden text-[0.5625rem] text-muted-foreground sm:inline">{open ? "Ocultar" : "Ver detalle"}</span>
                      <ChevronDown aria-hidden className={`size-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} strokeWidth={1.25} />
                    </button>
                  </h2>
                  {open ? (
                    <div id={`order-${o.id}`} className="border-t border-border px-6 pb-6 md:px-8 md:pb-8">
                      <OrderJourney order={o} />
                      <ul className="mt-6 divide-y divide-border border-y border-border text-sm">
                        {o.items.map((i) => {
                          const image = getProductById(i.productId)?.images[0];
                          return (
                            <li key={i.name} className="flex items-center gap-4 py-3">
                              <span className="block aspect-[4/5] w-14 shrink-0 overflow-hidden bg-secondary">
                                {image ? <img src={image} alt="" loading="lazy" className="size-full object-cover" /> : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block">
                                  {i.quantity} × {i.name}
                                </span>
                                <span className="mt-0.5 block text-muted-foreground">{i.variant}</span>
                                {i.embroidery && (
                                  <span className="mt-1 block text-xs">
                                    Bordado: {i.embroidery.reference}
                                    <span className="block text-muted-foreground">
                                      {i.embroidery.position} · {i.embroidery.size}
                                    </span>
                                    <EmbroideryTextDetails verses={i.embroidery.verses ?? []} />
                                  </span>
                                )}
                              </span>
                              <span className="shrink-0">{formatPrice(i.price * i.quantity)}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <p className="mt-4 flex justify-between">
                        <span>Total</span>
                        <span>{formatPrice(o.total)}</span>
                      </p>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <form
            className="mt-8 grid gap-6 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              notConnected("Guardar el perfil");
            }}
          >
            <Field label="Nombre completo" defaultValue={DEMO_PROFILE.name} maxLength={100} />
            <Field label="Correo electrónico" type="email" defaultValue={DEMO_PROFILE.email} maxLength={255} />
            <Field label="Teléfono" defaultValue={DEMO_PROFILE.phone} maxLength={20} />
            <Field label="Dirección" defaultValue={DEMO_PROFILE.address} maxLength={160} />
            <Field label="Comuna" defaultValue={DEMO_PROFILE.city} maxLength={60} />
            <Field label="Región" defaultValue={DEMO_PROFILE.region} maxLength={60} />
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-solid">
                Guardar cambios
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
