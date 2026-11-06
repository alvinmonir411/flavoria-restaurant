'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import { Order, OrderType } from '@/types';

export default function CartDrawer() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    totalItems, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Delivery');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const packagingFee = subtotal > 0 ? 15 : 0;
  const tax = Math.round(subtotal * 0.08875);
  const total = subtotal + packagingFee + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setError('Please provide your name and phone number for delivery coordination.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType,
          customerName,
          customerPhone,
          items,
          totalAmount: total,
          notes: notes || 'Private packaging requested'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setConfirmedOrder(data.order);
      clearCart();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#faf7f2]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-[#b8860b]/40 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#b8860b]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#171512]">
                  Your Tasting Selection
                </h3>
                <span className="text-[11px] text-[#8a5e06] uppercase tracking-wider font-semibold">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in order
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {confirmedOrder ? (
              /* Confirmation Screen */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-[#b8860b] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-9 h-9 text-[#b8860b]" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#171512] mb-2">
                  Order Dispatched to Kitchen
                </h4>
                <p className="text-xs text-[#574e44] mb-6">
                  Our brigade has received your tasting order. It has been queued in our Live Kitchen Display System.
                </p>

                <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#b8860b]/30 text-left space-y-2 mb-6">
                  <div className="flex justify-between text-xs pb-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Kitchen Ticket Code:</span>
                    <span className="font-mono font-bold text-[#8a5e06] text-sm">
                      {confirmedOrder.orderCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500 font-medium">Recipient:</span>
                    <span className="text-[#171512] font-semibold">{confirmedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500 font-medium">Total:</span>
                    <span className="text-[#8a5e06] font-bold text-sm">${confirmedOrder.totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3.5 rounded-xl gold-button text-xs uppercase tracking-wider font-bold shadow-md"
                >
                  Close & Continue Exploring
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="font-serif text-lg text-[#171512] font-bold mb-1">Your bag is empty</p>
                <p className="text-xs text-[#574e44] mb-6 font-light">
                  Explore our seasonal degustation menu to craft your bespoke tasting experience.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full gold-outline-button text-xs uppercase tracking-wider font-bold"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="p-3.5 rounded-2xl bg-[#faf7f2] border border-stone-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#171512] truncate font-serif">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-[#8a5e06] font-bold mt-0.5">
                          ${item.price} each
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-stone-300 shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="text-stone-500 hover:text-black p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-[#171512] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="text-stone-500 hover:text-black p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Checkout Details Form */}
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  <div className="text-xs uppercase tracking-wider text-[#8a5e06] font-bold">
                    Order Delivery & Contact Details
                  </div>

                  {/* Order Type Toggle */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['Delivery', 'Takeaway'] as OrderType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type)}
                        className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                          orderType === type
                            ? 'bg-[#f4ede2] border-2 border-[#b8860b] text-[#8a5e06]'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-[#171512] focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number for courier *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-[#171512] focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Delivery address or special preparation instructions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-[#171512] focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold">
                      {error}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {!confirmedOrder && items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-[#faf7f2]">
              <div className="space-y-1.5 text-xs text-[#574e44] mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#171512] font-semibold">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thermal Gold Seal Packaging</span>
                  <span className="font-mono text-[#171512] font-semibold">${packagingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>State & Municipal Tax (8.875%)</span>
                  <span className="font-mono text-[#171512] font-semibold">${tax}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#171512] pt-2 border-t border-stone-200">
                  <span className="font-serif">Total Experience</span>
                  <span className="font-mono text-[#8a5e06] text-base">${total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3.5 rounded-xl gold-button text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Send to Kitchen</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-stone-500 text-center mt-2">
                Order will appear in real-time on our kitchen line for immediate prep.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
