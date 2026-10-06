import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Ml, Perfume, Promo } from '../types';
import { getPerfumeById, promosCatalog } from '../data/catalog';
import { cartKey, unitPrice } from '../utils/format';

interface CartContextType {
  cart: CartItem[];
  addToCart: (perfume: Perfume, ml: Ml, quantity?: number) => void;
  addPromoToCart: (promo: Promo, quantity?: number) => void;
  /** key = `${perfumeId}-${ml}` para perfumes, o el id de la promo */
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'ddp-cart-v1';

type StoredItem =
  | { kind: 'perfume'; id: string; ml: Ml; quantity: number }
  | { kind: 'promo'; id: string; quantity: number };

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const stored = JSON.parse(raw) as StoredItem[];
    return stored.flatMap((s): CartItem[] => {
      if (s.kind === 'perfume') {
        const perfume = getPerfumeById(s.id);
        return perfume ? [{ kind: 'perfume', perfume, ml: s.ml, quantity: s.quantity }] : [];
      }
      const promo = promosCatalog.find((p) => p.id === s.id);
      return promo ? [{ kind: 'promo', promo, quantity: s.quantity }] : [];
    });
  } catch {
    return [];
  }
};

const saveCart = (cart: CartItem[]) => {
  try {
    const stored: StoredItem[] = cart.map((item) =>
      item.kind === 'perfume'
        ? { kind: 'perfume', id: item.perfume.id, ml: item.ml, quantity: item.quantity }
        : { kind: 'promo', id: item.promo.id, quantity: item.quantity },
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Sin almacenamiento (modo privado, etc.): el carrito vive solo en memoria
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => saveCart(cart), [cart]);

  const addItem = useCallback((newItem: CartItem) => {
    const key = cartKey(newItem);
    setCart((prev) => {
      const existing = prev.find((item) => cartKey(item) === key);
      if (!existing) return [...prev, newItem];
      return prev.map((item) =>
        cartKey(item) === key ? { ...item, quantity: item.quantity + newItem.quantity } : item,
      );
    });
  }, []);

  const addToCart = useCallback(
    (perfume: Perfume, ml: Ml, quantity = 1) => addItem({ kind: 'perfume', perfume, ml, quantity }),
    [addItem],
  );

  const addPromoToCart = useCallback(
    (promo: Promo, quantity = 1) => addItem({ kind: 'promo', promo, quantity }),
    [addItem],
  );

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((item) => cartKey(item) !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((item) => cartKey(item) !== key)
        : prev.map((item) => (cartKey(item) === key ? { ...item, quantity } : item)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextType>(() => {
    const total = cart.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return {
      cart,
      addToCart,
      addPromoToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      isOpen,
      openCart,
      closeCart,
    };
  }, [cart, isOpen, addToCart, addPromoToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
