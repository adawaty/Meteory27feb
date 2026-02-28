export type QuoteItemType = "extinguisher" | "cabinet" | "system" | "accessory";

export interface QuoteCartItem {
  id: string; // product id
  name: string;
  nameAr?: string;
  category: QuoteItemType;
  subCategory?: string;
  image?: string;
  // buyer input
  qty: number;
  notes?: string;
  // optional product refs
  sku?: string;
}

export interface QuoteCartState {
  items: QuoteCartItem[];
  updatedAt: number;
}

export const QUOTE_CART_STORAGE_KEY = "meteory.quoteCart.v1";

export function loadCart(): QuoteCartState {
  try {
    const raw = localStorage.getItem(QUOTE_CART_STORAGE_KEY);
    if (!raw) return { items: [], updatedAt: Date.now() };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [], updatedAt: Date.now() };
    // normalize
    const items: QuoteCartItem[] = parsed.items
      .map((it: any) => ({
        id: String(it.id),
        name: String(it.name || ""),
        nameAr: it.nameAr ? String(it.nameAr) : undefined,
        category: (it.category as QuoteItemType) || "accessory",
        subCategory: it.subCategory ? String(it.subCategory) : undefined,
        image: it.image ? String(it.image) : undefined,
        qty: Number.isFinite(Number(it.qty)) ? Math.max(1, Number(it.qty)) : 1,
        notes: it.notes ? String(it.notes) : undefined,
        sku: it.sku ? String(it.sku) : undefined,
      }))
      .filter((it: QuoteCartItem) => it.id && it.name);

    return { items, updatedAt: Number(parsed.updatedAt) || Date.now() };
  } catch {
    return { items: [], updatedAt: Date.now() };
  }
}

export function saveCart(state: QuoteCartState) {
  localStorage.setItem(QUOTE_CART_STORAGE_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
}

export function addToCart(item: Omit<QuoteCartItem, "qty">, qty = 1) {
  const state = loadCart();
  const existing = state.items.find((x) => x.id === item.id);
  if (existing) {
    existing.qty = Math.min(999, existing.qty + Math.max(1, qty));
  } else {
    state.items.unshift({ ...item, qty: Math.max(1, qty) });
  }
  saveCart(state);
  return state;
}

export function updateQty(id: string, qty: number) {
  const state = loadCart();
  const it = state.items.find((x) => x.id === id);
  if (it) it.qty = Math.min(999, Math.max(1, qty));
  saveCart(state);
  return state;
}

export function updateNotes(id: string, notes: string) {
  const state = loadCart();
  const it = state.items.find((x) => x.id === id);
  if (it) it.notes = notes || undefined;
  saveCart(state);
  return state;
}

export function removeFromCart(id: string) {
  const state = loadCart();
  state.items = state.items.filter((x) => x.id !== id);
  saveCart(state);
  return state;
}

export function clearCart() {
  const state: QuoteCartState = { items: [], updatedAt: Date.now() };
  saveCart(state);
  return state;
}
