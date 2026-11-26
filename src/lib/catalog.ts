import accessories from "@/assets/accessories.jpg";
import cap from "@/assets/cap.jpg";
import embroidery from "@/assets/embroidery.jpg";
import hoodie from "@/assets/hoodie.jpg";
import hoodieWorn from "@/assets/hoodie-worn.jpg";
import sweatshirt from "@/assets/sweatshirt.jpg";
import sweatshirtWorn from "@/assets/sweatshirt-worn.jpg";
import tee from "@/assets/tee.jpg";
import teeWorn from "@/assets/tee-worn.jpg";
import tote from "@/assets/tote.jpg";
import type { EmbroideryConfig } from "@/lib/embroidery";

/**
 * DEMO CATALOG — sample products, prices and stock used until the store's
 * database is connected. Everything here is placeholder data.
 */

export type CategorySlug = "t-shirts" | "hoodies" | "sweatshirts" | "accessories";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
}

export interface ProductColor {
  name: string;
  swatch: string;
}

export interface Variant {
  color: string;
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  tagline: string;
  description: string;
  details: string[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  variants: Variant[];
  bestSeller: boolean;
  isNew: boolean;
  createdAt: string;
  embroidery?: EmbroideryConfig;
}

export const CATEGORIES: Category[] = [
  { slug: "t-shirts", name: "Poleras", blurb: "Algodón de todos los días, bordado en silencio.", image: teeWorn },
  { slug: "hoodies", name: "Hoodies", blurb: "Capas gruesas para mañanas sin apuro.", image: hoodieWorn },
  { slug: "sweatshirts", name: "Polerones", blurb: "Cuello redondo, con un versículo cerca.", image: sweatshirtWorn },
  { slug: "accessories", name: "Accesorios", blurb: "Piezas pequeñas, la misma intención.", image: accessories },
];

export const SWATCHES = {
  ivory: "oklch(0.913 0.019 84)",
  sage: "oklch(0.846 0.03 138)",
  sand: "oklch(0.831 0.045 85)",
  rose: "oklch(0.882 0.022 30)",
  olive: "oklch(0.394 0.016 118)",
  natural: "oklch(0.89 0.03 88)",
} as const;

function variants(colors: ProductColor[], sizes: string[], stock: number[][]): Variant[] {
  return colors.flatMap((color, ci) =>
    sizes.map((size, si) => ({ color: color.name, size, stock: stock[ci]?.[si] ?? 0 })),
  );
}

const hoodieColors: ProductColor[] = [
  { name: "Marfil", swatch: SWATCHES.ivory },
  { name: "Arena", swatch: SWATCHES.sand },
];
const teeColors: ProductColor[] = [
  { name: "Salvia", swatch: SWATCHES.sage },
  { name: "Marfil", swatch: SWATCHES.ivory },
  { name: "Rosa Viejo", swatch: SWATCHES.rose },
];
const sweatColors: ProductColor[] = [
  { name: "Arena", swatch: SWATCHES.sand },
  { name: "Salvia", swatch: SWATCHES.sage },
];
const capColors: ProductColor[] = [
  { name: "Oliva", swatch: SWATCHES.olive },
  { name: "Marfil", swatch: SWATCHES.ivory },
];
const limitedColors: ProductColor[] = [{ name: "Marfil", swatch: SWATCHES.ivory }];
const toteColors: ProductColor[] = [{ name: "Natural", swatch: SWATCHES.natural }];

const APPAREL = ["XS", "S", "M", "L", "XL"];
const ONE = ["Talla única"];

export const PRODUCTS: Product[] = [
  {
    id: "p-hoodie",
    slug: "hoodie-oversize-quietud",
    name: "Hoodie Oversize Quietud",
    category: "hoodies",
    price: 54990,
    tagline: "Marfil, bordado en el pecho",
    description:
      "Un hoodie oversize de algodón grueso en marfil cálido, con un pequeño bordado tono sobre tono a la altura del corazón. Hecho para vivirlo: mañanas tempranas, caminatas largas y tardes en calma.",
    details: [
      "Bordado tono sobre tono en el pecho",
      "Felpa de algodón perchado, 420 g/m²",
      "Corte oversize, hombro caído",
      "Lavar con agua fría, secar en plano",
    ],
    images: [hoodie, hoodieWorn, embroidery],
    colors: hoodieColors,
    sizes: APPAREL,
    variants: variants(hoodieColors, APPAREL, [
      [4, 9, 12, 7, 2],
      [0, 5, 6, 3, 0],
    ]),
    bestSeller: true,
    isNew: false,
    createdAt: "2026-09-12",
  },
  {
    id: "p-tee",
    slug: "polera-rama-de-olivo",
    name: "Polera Rama de Olivo",
    category: "t-shirts",
    price: 24990,
    tagline: "Verde salvia, rama de olivo bordada",
    description:
      "Una polera de algodón de corte relajado en verde salvia, con una rama de olivo dibujada a mano y bordada en el pecho: una pequeña señal de paz para los días comunes.",
    details: [
      "Rama de olivo bordada",
      "Jersey de algodón peinado, 200 g/m²",
      "Corte relajado",
      "Prelavada para mayor suavidad",
    ],
    images: [tee, teeWorn],
    colors: teeColors,
    sizes: APPAREL,
    variants: variants(teeColors, APPAREL, [
      [6, 14, 18, 11, 5],
      [3, 8, 9, 4, 0],
      [2, 3, 0, 1, 0],
    ]),
    bestSeller: true,
    isNew: true,
    createdAt: "2026-11-02",
  },
  {
    id: "p-sweatshirt",
    slug: "poleron-salmo-46-10",
    name: "Polerón Salmo 46:10",
    category: "sweatshirts",
    price: 44990,
    tagline: "Cuello redondo arena, un versículo cerca",
    description:
      "Un polerón cuello redondo color arena con una referencia discreta bordada tono sobre tono en el pecho. «Estad quietos, y conoced». Fácil de pasar por alto, a propósito.",
    details: [
      "Referencia bíblica bordada tono sobre tono",
      "Algodón french terry, 360 g/m²",
      "Corte regular, terminaciones en rib",
      "Lavar con agua fría, al revés",
    ],
    images: [sweatshirt, sweatshirtWorn],
    colors: sweatColors,
    sizes: APPAREL,
    variants: variants(sweatColors, APPAREL, [
      [3, 7, 10, 6, 3],
      [0, 2, 4, 2, 0],
    ]),
    bestSeller: true,
    isNew: false,
    createdAt: "2026-10-05",
  },
  {
    id: "p-cap",
    slug: "jockey-bordado-selah",
    name: "Jockey Bordado Selah",
    category: "accessories",
    price: 19990,
    tagline: "Algodón sin estructura, bordado mínimo",
    description:
      "Un jockey suave y sin estructura en sarga de algodón lavado, con un pequeño bordado al frente. Ajustable, simple, para todos los días.",
    details: [
      "Bordado frontal",
      "Sarga de algodón lavado",
      "Hebilla de latón ajustable",
      "Talla única",
    ],
    images: [cap, accessories],
    colors: capColors,
    sizes: ONE,
    variants: variants(capColors, ONE, [[15], [3]]),
    bestSeller: true,
    isNew: true,
    createdAt: "2026-11-10",
  },
  {
    id: "p-tote",
    slug: "bolso-tote-pan-de-cada-dia",
    name: "Bolso Tote Pan de Cada Día",
    category: "accessories",
    price: 14990,
    tagline: "Lona cruda, hecha para llevar",
    description:
      "Un bolso tote de lona cruda y resistente, con asas largas y un pequeño bordado. Para libros, pan y lo que el día te pida llevar.",
    details: [
      "Bordado en la esquina",
      "Lona gruesa de algodón sin teñir",
      "38 × 42 cm, asas largas",
      "Bolsillo interior",
    ],
    images: [tote, accessories],
    colors: toteColors,
    sizes: ONE,
    variants: variants(toteColors, ONE, [[22]]),
    bestSeller: false,
    isNew: false,
    createdAt: "2026-08-20",
  },
  {
    id: "p-hoodie-limited",
    slug: "hoodie-gracia-edicion-limitada",
    name: "Hoodie Gracia Edición Limitada",
    category: "hoodies",
    price: 59990,
    tagline: "Edición limitada, bordado a mano",
    description:
      "Una edición pequeña de nuestro hoodie en marfil, con el bordado hecho a mano en el pecho. Se hicieron pocas unidades y ya encontraron su hogar.",
    details: [
      "Bordado a mano en el pecho",
      "Felpa de algodón perchado, 420 g/m²",
      "Corte oversize, hombro caído",
      "Edición limitada",
    ],
    images: [embroidery, hoodieWorn],
    colors: limitedColors,
    sizes: APPAREL,
    variants: variants(limitedColors, APPAREL, [[0, 0, 0, 0, 0]]),
    bestSeller: false,
    isNew: false,
    createdAt: "2026-07-15",
  },
  {
    id: "p-hoodie-back",
    slug: "hoodie-oversize-tu-versiculo",
    name: "Hoodie Oversize Tu Versículo",
    category: "hoodies",
    price: 56990,
    tagline: "Tu referencia bordada en grande en la espalda",
    description:
      "Nuestro hoodie oversize de algodón grueso, ahora con la referencia bíblica que tú elijas bordada en grande en la espalda. Una prenda única, hecha para llevar contigo un pasaje significativo.",
    details: [
      "Referencia personalizada bordada en la espalda",
      "Bordado grande, incluido en el precio",
      "Felpa de algodón perchado, 420 g/m²",
      "Corte oversize, hombro caído",
    ],
    images: [hoodieWorn, hoodie, embroidery],
    colors: hoodieColors,
    sizes: APPAREL,
    variants: variants(hoodieColors, APPAREL, [
      [3, 8, 10, 6, 2],
      [2, 5, 7, 4, 1],
    ]),
    bestSeller: false,
    isNew: true,
    createdAt: "2026-11-26",
    embroidery: {
      position: "Espalda",
      size: "Grande",
      defaultSelection: { book: "Salmos", chapter: 23, fromVerse: 1, toVerse: 6 },
    },
  },
  {
    id: "p-tee-chest",
    slug: "polera-tu-versiculo-en-el-pecho",
    name: "Polera Tu Versículo en el Pecho",
    category: "t-shirts",
    price: 26990,
    tagline: "Una referencia pequeña, cerca del corazón",
    description:
      "Una polera relajada de algodón con tu referencia bíblica bordada en pequeño en el pecho. Elige el libro, capítulo y versículos que quieres llevar todos los días.",
    details: [
      "Referencia personalizada bordada en el pecho",
      "Bordado pequeño, incluido en el precio",
      "Jersey de algodón peinado, 200 g/m²",
      "Corte relajado",
    ],
    images: [teeWorn, tee, embroidery],
    colors: teeColors,
    sizes: APPAREL,
    variants: variants(teeColors, APPAREL, [
      [5, 10, 12, 8, 3],
      [4, 7, 9, 5, 2],
      [2, 4, 6, 3, 1],
    ]),
    bestSeller: false,
    isNew: true,
    createdAt: "2026-11-26",
    embroidery: {
      position: "Pecho",
      size: "Pequeño",
      defaultSelection: { book: "Filipenses", chapter: 4, fromVerse: 13, toVerse: 13 },
    },
  },
  {
    id: "p-sweatshirt-sleeve",
    slug: "poleron-tu-versiculo-en-la-manga",
    name: "Polerón Tu Versículo en la Manga",
    category: "sweatshirts",
    price: 46990,
    tagline: "Tu referencia bordada discretamente en la manga",
    description:
      "Un polerón de cuello redondo con tu referencia bíblica favorita bordada en pequeño en la manga derecha. Un detalle discreto con un significado muy personal.",
    details: [
      "Referencia personalizada bordada en la manga derecha",
      "Bordado pequeño, incluido en el precio",
      "Algodón french terry, 360 g/m²",
      "Corte regular, terminaciones en rib",
    ],
    images: [sweatshirtWorn, sweatshirt, embroidery],
    colors: sweatColors,
    sizes: APPAREL,
    variants: variants(sweatColors, APPAREL, [
      [4, 8, 9, 5, 2],
      [3, 6, 8, 4, 1],
    ]),
    bestSeller: false,
    isNew: true,
    createdAt: "2026-11-26",
    embroidery: {
      position: "Manga derecha",
      size: "Pequeño",
      defaultSelection: { book: "Josué", chapter: 1, fromVerse: 9, toVerse: 9 },
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function categoryName(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function variantStock(product: Product, color: string, size: string): number {
  return product.variants.find((v) => v.color === color && v.size === size)?.stock ?? 0;
}

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return clp.format(amount);
}
