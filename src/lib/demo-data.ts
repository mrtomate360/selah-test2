/**
 * DEMO ORDERS AND CUSTOMERS — invented sample records shown in the account
 * and admin previews until the store's database is connected.
 */

import type { EmbroideredVerse } from "@/lib/embroidery";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export interface DemoOrderItem {
  productId: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  embroidery?: { reference: string; position: string; size: string; verses?: EmbroideredVerse[] };
}

export interface DemoOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: DemoOrderItem[];
  total: number;
  status: OrderStatus;
  /** Date each status was reached (ISO). Statuses not reached yet are absent. */
  history: Partial<Record<OrderStatus, string>>;
}

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
}

export const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "DEMO-1042",
    customer: "Clienta Demo",
    email: "clienta.demo@example.com",
    date: "2026-11-18",
    items: [
      {
        productId: "p-hoodie-back",
        name: "Hoodie Oversize Tu Versículo",
        variant: "Marfil / M",
        quantity: 1,
        price: 59990,
        embroidery: {
          reference: "Salmo 23:1-6",
          position: "Espalda",
          size: "Grande",
          verses: [
            { verse: 1, text: "Jehová es mi pastor; nada me faltará." },
            { verse: 3, text: "Confortará mi alma; Me guiará por sendas de justicia por amor de su nombre." },
            {
              verse: 6,
              text: "Ciertamente el bien y la misericordia me seguirán todos los días de mi vida; Y en la casa de Jehová moraré por largos días.",
            },
          ],
        },
      },
      { productId: "p-tote", name: "Bolso Tote Pan de Cada Día", variant: "Natural", quantity: 1, price: 14990 },
    ],
    total: 74980,
    status: "shipped",
    history: { pending: "2026-11-18", paid: "2026-11-18", shipped: "2026-11-20" },
  },
  {
    id: "DEMO-1041",
    customer: "Comprador de Ejemplo",
    email: "comprador.ejemplo@example.com",
    date: "2026-11-16",
    items: [{ productId: "p-tee", name: "Polera Rama de Olivo", variant: "Salvia / L", quantity: 2, price: 24990 }],
    total: 53970,
    status: "paid",
    history: { pending: "2026-11-16", paid: "2026-11-16" },
  },
  {
    id: "DEMO-1040",
    customer: "Clienta Demo",
    email: "clienta.demo@example.com",
    date: "2026-10-29",
    items: [{ productId: "p-sweatshirt", name: "Polerón Salmo 46:10", variant: "Arena / S", quantity: 1, price: 44990 }],
    total: 48980,
    status: "delivered",
    history: { pending: "2026-10-29", paid: "2026-10-29", shipped: "2026-10-31", delivered: "2026-11-03" },
  },
  {
    id: "DEMO-1039",
    customer: "Compradora de Prueba",
    email: "compradora.prueba@example.com",
    date: "2026-10-21",
    items: [{ productId: "p-cap", name: "Jockey Bordado Selah", variant: "Oliva", quantity: 1, price: 19990 }],
    total: 23980,
    status: "pending",
    history: { pending: "2026-10-21" },
  },
  {
    id: "DEMO-1038",
    customer: "Persona de Ejemplo",
    email: "persona.ejemplo@example.com",
    date: "2026-10-12",
    items: [{ productId: "p-tee", name: "Polera Rama de Olivo", variant: "Marfil / M", quantity: 1, price: 24990 }],
    total: 28980,
    status: "cancelled",
    history: { pending: "2026-10-12", cancelled: "2026-10-13" },
  },
];

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  { id: "c1", name: "Clienta Demo", email: "clienta.demo@example.com", city: "Santiago", orders: 2, spent: 123960, joined: "2026-09-30" },
  { id: "c2", name: "Comprador de Ejemplo", email: "comprador.ejemplo@example.com", city: "Valparaíso", orders: 1, spent: 53970, joined: "2026-11-01" },
  { id: "c3", name: "Compradora de Prueba", email: "compradora.prueba@example.com", city: "Concepción", orders: 1, spent: 23980, joined: "2026-10-20" },
  { id: "c4", name: "Persona de Ejemplo", email: "persona.ejemplo@example.com", city: "La Serena", orders: 1, spent: 0, joined: "2026-10-10" },
];

export const DEMO_PROFILE = {
  name: "Clienta Demo",
  email: "clienta.demo@example.com",
  phone: "+56 9 0000 0000",
  address: "Calle de Ejemplo 123",
  city: "Santiago",
  region: "Región Metropolitana",
};

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d ?? 1} ${months[(m ?? 1) - 1] ?? ""} ${y ?? ""}`;
}

export type JourneyState = "done" | "current" | "upcoming" | "cancelled";

export interface JourneyStep {
  status: OrderStatus;
  label: string;
  detail: string;
  date?: string;
  state: JourneyState;
}

const JOURNEY: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

const STEP_LABEL: Record<OrderStatus, string> = {
  pending: "Pedido recibido",
  paid: "Pago confirmado",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STEP_DETAIL: Record<OrderStatus, { done: string; current: string; upcoming: string }> = {
  pending: {
    done: "Recibimos tu pedido.",
    current: "Recibimos tu pedido y esperamos la confirmación del pago.",
    upcoming: "",
  },
  paid: {
    done: "Tu pago fue confirmado.",
    current: "Pago confirmado. Estamos preparando tus prendas.",
    upcoming: "Te avisaremos cuando se confirme el pago.",
  },
  shipped: {
    done: "Tu pedido salió de nuestro taller.",
    current: "Tu pedido va en camino a tu dirección.",
    upcoming: "Lo despacharemos apenas esté listo.",
  },
  delivered: {
    done: "Tu pedido fue entregado.",
    current: "Tu pedido fue entregado. Que lo disfrutes.",
    upcoming: "Llegará a la dirección que indicaste.",
  },
  cancelled: {
    done: "Este pedido fue cancelado.",
    current: "Este pedido fue cancelado y no seguirá avanzando.",
    upcoming: "",
  },
};

/** Steps an order has gone through and the ones still ahead, in order. */
export function orderJourney(order: Pick<DemoOrder, "status" | "history">): JourneyStep[] {
  const step = (status: OrderStatus, state: JourneyState): JourneyStep => {
    const date = order.history[status];
    const detail = STEP_DETAIL[status][state === "cancelled" ? "current" : state];
    return { status, label: STEP_LABEL[status], detail, state, ...(date ? { date } : {}) };
  };

  if (order.status === "cancelled") {
    const reached = JOURNEY.filter((s) => order.history[s]);
    return [...reached.map((s) => step(s, "done")), step("cancelled", "cancelled")];
  }

  const at = JOURNEY.indexOf(order.status);
  return JOURNEY.map((s, i) => step(s, i < at ? "done" : i === at ? "current" : "upcoming"));
}
