import { useEffect, useState } from "react";
import {
  addToCart,
  clearCart,
  loadCart,
  removeFromCart,
  updateNotes,
  updateQty,
  type QuoteCartItem,
  type QuoteCartState,
} from "@/lib/quote-cart";

export function useQuoteCart() {
  const [cart, setCart] = useState<QuoteCartState>({ items: [], updatedAt: Date.now() });

  useEffect(() => {
    // initial load (client only)
    setCart(loadCart());

    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes("meteory.quoteCart")) {
        setCart(loadCart());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const api = {
    cart,
    count: cart.items.reduce((n, it) => n + it.qty, 0),
    add: (item: Omit<QuoteCartItem, "qty">, qty = 1) => setCart(addToCart(item, qty)),
    remove: (id: string) => setCart(removeFromCart(id)),
    setQty: (id: string, qty: number) => setCart(updateQty(id, qty)),
    setNotes: (id: string, notes: string) => setCart(updateNotes(id, notes)),
    clear: () => setCart(clearCart()),
    refresh: () => setCart(loadCart()),
  };

  return api;
}
