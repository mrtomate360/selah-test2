import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getProductById, variantStock, type Product } from "@/lib/catalog";

export interface CartItem {
  productId: string;
  color: string;
  size: string;
  quantity: number;
  embroideryReference?: string;
}

export interface CartLine extends CartItem {
  key: string;
  product: Product;
  stock: number;
  lineTotal: number;
}

// Demo shipping rule until real rates are set.
export const FREE_SHIPPING_FROM = 60000;
export const FLAT_SHIPPING = 3990;

export function itemKey(item: Pick<CartItem, "productId" | "color" | "size" | "embroideryReference">): string {
  return `${item.productId}|${item.color}|${item.size}|${item.embroideryReference ?? ""}`;
}

export function cartTotals(lines: Pick<CartLine, "lineTotal" | "quantity">[]) {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : FLAT_SHIPPING;
  return { subtotal, count, shipping, total: subtotal + shipping };
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (item: CartItem) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "selah-bag-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore unreadable storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, loaded]);

  const add = useCallback((item: CartItem) => {
    const product = getProductById(item.productId);
    if (!product) return;
    const stock = variantStock(product, item.color, item.size);
    const embroideryReference = item.embroideryReference?.trim();
    if (product.embroidery && !embroideryReference) return;
    const normalizedItem: CartItem = {
      productId: item.productId,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      ...(product.embroidery && embroideryReference ? { embroideryReference } : {}),
    };
    setItems((prev) => {
      const key = itemKey(normalizedItem);
      const existing = prev.find((p) => itemKey(p) === key);
      if (existing) {
        return prev.map((p) =>
          itemKey(p) === key ? { ...p, quantity: Math.min(stock, p.quantity + item.quantity) } : p,
        );
      }
      return [...prev, { ...normalizedItem, quantity: Math.min(stock, item.quantity) }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.flatMap((p) => {
        if (itemKey(p) !== key) return [p];
        const product = getProductById(p.productId);
        const stock = product ? variantStock(product, p.color, p.size) : 0;
        const next = Math.min(stock, Math.max(0, quantity));
        return next === 0 ? [] : [{ ...p, quantity: next }];
      }),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => itemKey(p) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = items.flatMap((item): CartLine[] => {
      const product = getProductById(item.productId);
      if (!product) return [];
      return [
        {
          ...item,
          key: itemKey(item),
          product,
          stock: variantStock(product, item.color, item.size),
          lineTotal: product.price * item.quantity,
        },
      ];
    });
    return { lines, ...cartTotals(lines), add, setQuantity, remove, clear };
  }, [items, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
