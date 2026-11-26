import { Link } from "@tanstack/react-router";

import logo from "@/assets/selah-logo.svg.asset.json";
import { CATEGORIES } from "@/lib/catalog";

export const SOCIALS = [
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "TikTok", href: "https://www.tiktok.com/" },
  { name: "Pinterest", href: "https://www.pinterest.com/" },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-24">
        <div>
          <span
            role="img"
            aria-label="SELAH"
            className="block h-24 w-20 bg-primary-foreground"
            style={{
              WebkitMaskImage: `url("${logo.url}")`,
              maskImage: `url("${logo.url}")`,
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
          <p className="mt-5 font-serif text-xl italic opacity-80">Faith in every detail.</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed opacity-70">
            Ropa cristiana contemporánea. Prendas minimalistas, bordados sutiles y mensajes con sentido.
          </p>
        </div>
        <div>
          <p className="eyebrow opacity-60">Tienda</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/shop" className="link-line">
                Todo
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to="/shop" search={{ category: c.slug }} className="link-line">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow opacity-60">Ayuda</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/contact" className="link-line">
                Contacto
              </Link>
            </li>
            <li>
              <Link to="/account" className="link-line">
                Mi cuenta
              </Link>
            </li>
            <li>
              <Link to="/cart" className="link-line">
                Bolsa
              </Link>
            </li>
            <li>
              <Link to="/admin" className="link-line">
                Administración
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow opacity-60">Síguenos</p>
          <ul className="mt-5 space-y-3 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-line">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="page flex flex-col gap-2 py-6 text-xs opacity-60 md:flex-row md:justify-between">
          <p>© 2026 SELAH. Hecho con calma en Chile.</p>
          <p>Vista previa con datos de demostración.</p>
        </div>
      </div>
    </footer>
  );
}
