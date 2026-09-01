"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { PackSizeKg } from "@/mock/types";

export interface CartLine {
  productId: string;
  packSize: PackSizeKg;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  setQuantity: (productId: string, packSize: PackSizeKg, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const setQuantity = (productId: string, packSize: PackSizeKg, quantity: number) => {
    setLines((prev) => {
      const existingIndex = prev.findIndex(
        (l) => l.productId === productId && l.packSize === packSize
      );
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== existingIndex);
      }
      if (existingIndex === -1) {
        return [...prev, { productId, packSize, quantity }];
      }
      const next = [...prev];
      next[existingIndex] = { ...next[existingIndex], quantity };
      return next;
    });
  };

  const clear = () => setLines([]);

  const value = useMemo(() => ({ lines, setQuantity, clear }), [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
