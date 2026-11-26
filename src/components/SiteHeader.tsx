import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/lib/cart";
import { CATEGORIES } from "@/lib/catalog";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <p className="bg-primary px-4 py-2 text-center text-[0.625rem] uppercase tracking-[0.22em] text-primary-foreground">
        Tienda en vista previa · productos y precios de demostración
      </p>
      <div className="page grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
        <div className="flex items-center">
          <button
            type="button"
            className="-ml-2 p-2 xl:hidden"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" strokeWidth={1.25} />
          </button>
          <nav
            className="hidden items-center gap-6 tracking-[0.2em] xl:flex 2xl:gap-9"
            aria-label="Principal"
          >
            <Link
              to="/shop"
              activeOptions={{ exact: true, includeSearch: true }}
              className="eyebrow link-line tracking-[0.2em]"
            >
              Tienda
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="eyebrow link-line tracking-[0.2em]"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          to="/"
          className="font-serif text-2xl tracking-[0.42em] md:text-3xl"
          aria-label="SELAH, inicio"
        >
          <span className="pl-[0.42em]">SELAH</span>
        </Link>

        <div className="flex items-center justify-end gap-1 md:gap-5">
          <Link to="/contact" className="eyebrow link-line hidden xl:inline">
            Contacto
          </Link>
          <Link to="/account" className="p-2" aria-label="Mi cuenta">
            <User className="size-5" strokeWidth={1.25} />
          </Link>
          <Link to="/cart" className="relative -mr-2 p-2" aria-label={`Bolsa, ${count} productos`}>
            <ShoppingBag className="size-5" strokeWidth={1.25} />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[0.5625rem] text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-[2px] duration-500 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 xl:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col border-r border-border bg-background shadow-2xl ease-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:slide-in-from-left focus:outline-none xl:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6 md:h-20 md:px-8">
              <Dialog.Title className="font-serif text-2xl tracking-[0.42em]">SELAH</Dialog.Title>
              <Dialog.Close className="-mr-2 p-2" aria-label="Cerrar menú">
                <X className="size-5" strokeWidth={1.25} />
              </Dialog.Close>
            </div>
            <nav
              className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pt-8 md:px-8"
              aria-label="Móvil"
            >
              <Link to="/shop" onClick={() => setOpen(false)} className="rise font-serif text-4xl">
                Tienda
              </Link>
              {CATEGORIES.map((c, i) => (
                <Link
                  key={c.slug}
                  to="/shop"
                  search={{ category: c.slug }}
                  onClick={() => setOpen(false)}
                  className="rise font-serif text-4xl"
                  style={{ animationDelay: `${(i + 1) * 60}ms` }}
                >
                  {c.name}
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
                <Link to="/account" onClick={() => setOpen(false)} className="eyebrow">
                  Mi cuenta
                </Link>
                <Link to="/cart" onClick={() => setOpen(false)} className="eyebrow">
                  Bolsa ({count})
                </Link>
                <Link to="/contact" onClick={() => setOpen(false)} className="eyebrow">
                  Contacto
                </Link>
              </div>
            </nav>
            <p className="px-6 pb-8 pt-6 font-serif text-lg italic text-muted-foreground md:px-8">
              Faith in every detail.
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
