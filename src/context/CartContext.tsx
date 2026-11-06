'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, OrderItem } from '@/types';

interface CartContextType {
  items: OrderItem[];
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from session storage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('aura_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('aura_cart', JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const addToCart = (item: MenuItem, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
