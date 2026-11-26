import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import embroidery from "@/assets/embroidery.jpg";
import hero from "@/assets/hero.jpg";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "SELAH — Wear your faith",
      "Ropa cristiana contemporánea: prendas minimalistas con bordados sutiles y referencias bíblicas. Faith in every detail.",
    ),
  component: Home,
});

const PRINCIPLES = [
  { n: "01", title: "Sutil, no ruidoso", text: "Un bordado pequeño dice más que un estampado grande. La fe se lleva cerca, no a gritos." },
  { n: "02", title: "Hecho para durar", text: "Algodones gruesos, costuras cuidadas y colores que envejecen bien con el tiempo." },
  { n: "03", title: "Con sentido", text: "Cada prenda nace de un versículo o una palabra que vale la pena recordar." },
];

function Home() {
  const best = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[62vh] md:h-[calc(100vh-7rem)] md:min-h-[36rem]">
          <img src={hero} alt="Dos personas con prendas SELAH en una habitación con luz natural" className="absolute inset-0 size-full object-cover object-[70%_center]" />
          <div className="absolute inset-0 hidden md:block" style={{ backgroundImage: "var(--gradient-hero)" }} />
        </div>
        <div className="page py-12 md:absolute md:inset-0 md:flex md:items-center md:py-0">
          <div className="max-w-xl">
            <p className="eyebrow rise text-muted-foreground md:text-foreground/70">Colección Quietud · 2026</p>
            <h1 className="rise mt-5 text-6xl italic md:text-8xl lg:text-9xl" style={{ animationDelay: "120ms" }}>
              Wear your faith
            </h1>
            <p className="rise mt-6 max-w-sm text-lg leading-relaxed" style={{ animationDelay: "240ms" }}>
              Prendas minimalistas, bordadas con intención. Faith in every detail.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "360ms" }}>
              <Link to="/shop" className="btn btn-solid">
                Ver la tienda
              </Link>
              <a href="#filosofia" className="btn btn-line">
                Nuestra filosofía
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="page py-24 text-center md:py-36">
        <p className="eyebrow text-muted-foreground">Selah · סֶלָה</p>
        <p className="mx-auto mt-8 max-w-4xl font-serif text-3xl leading-snug md:text-5xl md:leading-[1.2]">
          En los Salmos, <em>selah</em> es una pausa: detenerse, respirar y considerar. Hacemos ropa para
          llevar esa pausa contigo, en lo cotidiano.
        </p>
      </section>

      {/* Collections */}
      <section className="page pb-24 md:pb-36">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-muted-foreground">Colecciones</p>
            <h2 className="mt-3 text-4xl md:text-6xl">Por categoría</h2>
          </div>
          <Link to="/shop" className="eyebrow link-line hidden items-center gap-2 sm:inline-flex">
            Ver todo <ArrowRight className="size-3.5" strokeWidth={1.25} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:gap-6 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug }}
              className={`group block ${i % 2 === 1 ? "lg:mt-16" : ""}`}
            >
              <div className="aspect-[3/4] overflow-hidden bg-card">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-2xl md:text-3xl">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-card">
        <div className="page py-24 md:py-32">
          <div className="text-center">
            <p className="eyebrow text-muted-foreground">Los más queridos</p>
            <h2 className="mt-3 text-4xl md:text-6xl">Más vendidos</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:gap-x-6 lg:grid-cols-4">
            {best.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link to="/shop" className="btn btn-line">
              Ver toda la tienda
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="filosofia" className="scroll-mt-28 bg-secondary">
        <div className="grid lg:grid-cols-2">
          <div className="aspect-[4/5] lg:aspect-auto">
            <img src={embroidery} alt="Manos terminando un bordado sobre algodón marfil" loading="lazy" className="size-full object-cover" />
          </div>
          <div className="flex items-center px-5 py-20 md:px-16 md:py-28">
            <div className="max-w-lg">
              <p className="eyebrow text-foreground/70">Filosofía</p>
              <h2 className="mt-4 text-5xl md:text-7xl">
                Faith in <em>every</em> detail.
              </h2>
              <p className="mt-6 leading-relaxed">
                Creemos que la fe no necesita adornos. Por eso diseñamos prendas serenas, donde el mensaje
                está en lo pequeño: una puntada, una referencia, una palabra.
              </p>
              <ol className="mt-10 space-y-7">
                {PRINCIPLES.map((p) => (
                  <li key={p.n} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-foreground/20 pt-6">
                    <span className="font-serif text-xl italic">{p.n}</span>
                    <div>
                      <h3 className="text-2xl">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Verse */}
      <section className="page py-24 text-center md:py-36">
        <blockquote className="mx-auto max-w-3xl font-serif text-4xl italic leading-tight md:text-6xl">
          «Estad quietos, y conoced que yo soy Dios.»
        </blockquote>
        <p className="eyebrow mt-8 text-muted-foreground">Salmo 46:10</p>
      </section>

      <Newsletter />
    </>
  );
}
