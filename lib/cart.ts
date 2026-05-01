export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  model?: string | null;
  price: number;
  currency: string;
  image?: string | null;
  stock: number;
  quantity: number;
};

export const CART_STORAGE_KEY = "icc-topografia-cart";

export function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    quantity: Math.max(1, Math.min(item.quantity, Math.max(item.stock, 1)))
  };
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
