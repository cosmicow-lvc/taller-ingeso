import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { productId, variantId, name, price, qty, meta }

  function addItem(newItem) {
    // newItem: { productId, variantId, name, price, qty }
    setItems(prev => {
      const key = `${newItem.productId}:${newItem.variantId ?? "default"}`;
      const idx = prev.findIndex(x => `${x.productId}:${x.variantId ?? "default"}` === key);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + (newItem.qty || 1) };
        return copy;
      }
      return [...prev, { ...newItem, qty: newItem.qty ?? 1 }];
    });
  }

  function removeItem(productId, variantId) {
    setItems(prev => prev.filter(i => !(i.productId === productId && (i.variantId ?? "default") === (variantId ?? "default"))));
  }

  function updateQty(productId, variantId, qty) {
    setItems(prev => prev.map(i => {
      if (i.productId === productId && (i.variantId ?? "default") === (variantId ?? "default")) {
        return { ...i, qty: Math.max(0, qty) };
      }
      return i;
    }).filter(i => i.qty > 0));
  }

  function clearCart() { setItems([]); }

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + (i.price * i.qty), 0), [items]);

  // drawer open state para controlar visualización globalmente
  const [open, setOpen] = useState(false);
  function toggle() { setOpen(o => !o); }
  function openCart() { setOpen(true); }
  function closeCart() { setOpen(false); }

  const value = {
    items, addItem, removeItem, updateQty, clearCart,
    totalCount, totalPrice,
    open, toggle, openCart, closeCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}