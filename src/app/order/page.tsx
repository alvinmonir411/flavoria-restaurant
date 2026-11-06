'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useCurrency } from '@/context/CurrencyContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { MenuItem, MenuCategory, Order } from '@/types';
import { INITIAL_MENU_ITEMS } from '@/lib/seed-data';
import { 
  QrCode, 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Users, 
  Tag, 
  Check, 
  Clock, 
  ChefHat, 
  CreditCard, 
  ArrowRight,
  Sparkles,
  Utensils,
  Receipt,
  CheckCircle2,
  BellRing
} from 'lucide-react';

const TABLES = [
  'T-01 (Window Alcove)',
  'T-02 (Window Alcove)',
  'T-03 (Center Salon)',
  'T-04 (Center Salon)',
  'T-05 (Grand Booth)',
  "C-01 (Chef's Counter)",
  "C-02 (Chef's Counter)",
  'TG-01 (Rose Pergola)',
  'TG-02 (Rose Pergola)',
  'VIP-01 (Wine Vault)',
  'Takeaway / Bar Pickup'
];

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Desserts',
  'Drinks',
  "Chef's Special"
] as const;

interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export default function TableOrderPage() {
  const { formatPrice, convertPrice } = useCurrency();
  const { customer } = useCustomerAuth();
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // PRD Order Types: Dine-In, Delivery, Takeaway
  const [orderType, setOrderType] = useState<'Dine-In' | 'Delivery' | 'Takeaway'>('Dine-In');
  const [selectedTable, setSelectedTable] = useState('T-01 (Window Alcove)');
  const [deliveryAddress, setDeliveryAddress] = useState('House 14, Road 71, Block NW(B), Gulshan-2, Dhaka');
  const [deliveryZone, setDeliveryZone] = useState('Zone 1: Gulshan / Banani (৳50)');
  const [deliveryFee, setDeliveryFee] = useState(0.5); // ~60 BDT
  const [pickupTime, setPickupTime] = useState('ASAP (~20-25 mins)');

  const [customerName, setCustomerName] = useState(customer?.name || 'Alvin Monir');
  const [customerPhone, setCustomerPhone] = useState(customer?.phone || '+880 1712-345678');

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.name);
      setCustomerPhone(customer.phone);
    }
  }, [customer]);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  
  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Split bill & Gratuity
  const [splitCount, setSplitCount] = useState(1);
  const [tipPercent, setTipPercent] = useState(10);
  const [customTip, setCustomTip] = useState('');

  // Placed order tracking
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverCalled, setServerCalled] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setItems(data.items);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    fetchMenu();
  }, []);

  const addToOrder = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleApplyPromo = async () => {
    setPromoError('');
    if (!promoInput.trim()) return;

    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput, amount: subtotal })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedPromo({ code: promoInput.toUpperCase(), percent: data.discountPercent });
        setPromoInput('');
      } else {
        setPromoError(data.message || 'Invalid code');
      }
    } catch {
      setPromoError('Failed to validate promo code.');
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo ? (subtotal * appliedPromo.percent) / 100 : 0;
  const currentDeliveryFee = orderType === 'Delivery' ? deliveryFee : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.085;
  const tipAmount = customTip ? Number(customTip) : (taxableAmount * tipPercent) / 100;
  const grandTotal = taxableAmount + tax + tipAmount + currentDeliveryFee;
  const perPersonTotal = splitCount > 1 ? grandTotal / splitCount : grandTotal;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType,
          tableNumber: orderType === 'Dine-In' ? selectedTable.split(' ')[0] : undefined,
          customerName: customerName || (orderType === 'Delivery' ? 'Delivery Guest' : 'Table Guest'),
          customerPhone: customerPhone || '+880 1712-345678',
          customerEmail: customer?.email,
          deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined,
          deliveryZone: orderType === 'Delivery' ? deliveryZone : undefined,
          deliveryFee: currentDeliveryFee,
          scheduledFor: orderType === 'Takeaway' ? pickupTime : 'ASAP',
          paymentMethod: orderType === 'Delivery' ? 'Cash on Delivery' : orderType === 'Takeaway' ? 'Cash at Pickup' : 'Cash at Table',
          paymentStatus: 'pending',
          items: cart.map(i => ({
            menuItemId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity
          })),
          subtotal,
          taxAmount: tax,
          tipAmount,
          discountAmount: discount,
          totalAmount: Math.round(grandTotal * 100) / 100,
          notes: `${orderNotes ? `[Notes: ${orderNotes}] ` : ''}${appliedPromo ? `[Promo: ${appliedPromo.code}] ` : ''}Method: Cash Only`
        })
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setPlacedOrder(data.order);
        setCart([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCallServer = () => {
    setServerCalled(true);
    setTimeout(() => setServerCalled(false), 4000);
  };

  const filteredItems = items.filter((dish) => {
    let matchCat = false;
    if (activeCategory === 'All') matchCat = true;
    else if (activeCategory === "Chef's Special") {
      matchCat = dish.category === "Chef's Special" || dish.isSignature;
    } else {
      matchCat = dish.category.toLowerCase() === activeCategory.toLowerCase();
    }
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || dish.name.toLowerCase().includes(q) || dish.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="flex flex-col gap-6 mb-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
                  <QrCode className="w-4 h-4" />
                  <span>ONLINE ORDERING &amp; TABLE SUITE</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                  {orderType === 'Dine-In' ? 'Table QR Ordering & Bill' : orderType === 'Delivery' ? 'Direct Home & Office Delivery' : 'Quick Takeaway & Pickup'}
                </h1>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Single-Restaurant Platform • Cash Only • Prepared Fresh by Executive Chefs
                </p>
              </div>

              {/* Order Type Tabs matching PRD */}
              <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
                {(['Dine-In', 'Delivery', 'Takeaway'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setOrderType(type);
                      if (type === 'Delivery') setDeliveryFee(0.5);
                      else setDeliveryFee(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      orderType === type
                        ? 'bg-[#1A4231] text-white shadow-md'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {type === 'Dine-In' ? '🍽️ Dine-In' : type === 'Delivery' ? '🛵 Delivery' : '🛍️ Takeaway'}
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Bar for selected order type */}
            {orderType === 'Dine-In' && (
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">Table Number:</span>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-[#ea580c]"
                  >
                    {TABLES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCallServer}
                    className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{serverCalled ? 'Waiter Dispatched!' : 'Call Waiter'}</span>
                  </button>
                </div>
              </div>
            )}

            {orderType === 'Delivery' && (
              <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Delivery Address (Dhaka)</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House, Road, Area, Dhaka"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Delivery Zone &amp; Fee</label>
                  <select
                    value={deliveryZone}
                    onChange={(e) => {
                      setDeliveryZone(e.target.value);
                      if (e.target.value.includes('Zone 1')) setDeliveryFee(0.42);
                      else if (e.target.value.includes('Zone 2')) setDeliveryFee(0.58);
                      else if (e.target.value.includes('Zone 3')) setDeliveryFee(0.82);
                      else setDeliveryFee(1.15);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium"
                  >
                    <option value="Zone 1: Gulshan / Banani (৳50)">Zone 1: Gulshan / Banani (~25m, ৳50 fee)</option>
                    <option value="Zone 2: Baridhara / DOHS (৳70)">Zone 2: Baridhara / DOHS (~35m, ৳70 fee)</option>
                    <option value="Zone 3: Dhanmondi / Mohakhali (৳100)">Zone 3: Dhanmondi / Mohakhali (~45m, ৳100 fee)</option>
                    <option value="Zone 4: Uttara Perimeter (৳140)">Zone 4: Uttara Perimeter (~55m, ৳140 fee)</option>
                  </select>
                </div>
              </div>
            )}

            {orderType === 'Takeaway' && (
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-4">
                <span className="text-xs font-bold text-stone-700">Pickup Counter Timing:</span>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800"
                >
                  <option value="ASAP (~20-25 mins)">ASAP (~20-25 mins)</option>
                  <option value="Today at 1:30 PM">Today at 1:30 PM (Lunch Rush)</option>
                  <option value="Today at 7:30 PM">Today at 7:30 PM (Dinner)</option>
                  <option value="Today at 8:30 PM">Today at 8:30 PM (Late Dinner)</option>
                </select>
                <span className="text-xs text-stone-500">Pick up at Flavoria Concierge counter.</span>
              </div>
            )}
          </div>

          {placedOrder ? (
            /* Live Order Status Tracker */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs uppercase tracking-widest font-bold text-[#ea580c]">
                ORDER RECEIVED IN KITCHEN
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1 mb-2">
                Chef Is Preparing Your Dishes!
              </h2>
              <p className="text-xs text-stone-500 mb-8 font-light">
                Ticket <strong className="text-[#ea580c] font-mono text-sm">{placedOrder.orderCode}</strong> sent to Kitchen Display System for Table {placedOrder.tableNumber}.
              </p>

              {/* Live 4-Step KDS Progression */}
              <div className="grid grid-cols-4 gap-2 mb-8 text-center text-[10px]">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1">
                    ✓
                  </div>
                  <span>Received</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 font-bold text-amber-800 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-1">
                    2
                  </div>
                  <span>In Kitchen</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 font-medium text-stone-400">
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mx-auto mb-1">
                    3
                  </div>
                  <span>Plating</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 font-medium text-stone-400">
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mx-auto mb-1">
                    4
                  </div>
                  <span>Served</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-left space-y-2 mb-8 text-xs">
                <div className="font-bold text-stone-800 pb-2 border-b border-stone-200">
                  Table Order Details ({placedOrder.items.length} items):
                </div>
                {placedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-600">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-semibold">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#ea580c]">{formatPrice(placedOrder.totalAmount)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setPlacedOrder(null)}
                  className="px-6 py-3 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider"
                >
                  Order More Dishes
                </button>
                <Link
                  href="/management"
                  className="px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold tracking-wider"
                >
                  View on Kitchen Display
                </Link>
              </div>
            </div>
          ) : (
            /* Split View: Menu Selector (Left 7 Cols) + Digital Bill / Split Checkout (Right 5 Cols) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Menu Column */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Search & Category Pills */}
                <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search pasta, ribeye, dessert, wine..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                          activeCategory === cat
                            ? 'bg-[#ea580c] text-white shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dish Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map(dish => {
                    const cartMatch = cart.find(i => i.id === dish.id);
                    return (
                      <div
                        key={dish.id}
                        className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="flex gap-3 mb-3">
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-20 h-20 rounded-2xl object-cover shrink-0"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#ea580c] block">
                              {dish.category}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                              {dish.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 font-light">
                              {dish.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span className="font-bold text-[#ea580c] text-base">
                            {formatPrice(dish.price)}
                          </span>

                          {cartMatch ? (
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full text-xs font-bold text-[#ea580c]">
                              <button onClick={() => updateQuantity(dish.id, -1)} className="hover:text-black">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span>{cartMatch.quantity}</span>
                              <button onClick={() => updateQuantity(dish.id, 1)} className="hover:text-black">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToOrder(dish)}
                              className="px-3 py-1.5 rounded-full bg-[#1a4231] hover:bg-[#122b20] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Digital Check & Split Bill Checkout Column */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#ea580c]" />
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Table Bill & Summary
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-full">
                    {selectedTable.split(' ')[0]}
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 text-center text-stone-400">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40 text-stone-400" />
                    <p className="text-xs">Your table order is empty.</p>
                    <p className="text-[11px] text-stone-400 mt-1">Select dishes from the menu to add.</p>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-stone-100">
                          <div>
                            <span className="font-bold text-stone-800">{item.name}</span>
                            <span className="text-stone-400 text-[10px] block">
                              {formatPrice(item.price)} each
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-0.5 rounded-full">
                              <button onClick={() => updateQuantity(item.id, -1)} className="text-stone-600 hover:text-black">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-xs">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="text-stone-600 hover:text-black">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-bold text-stone-900 w-16 text-right">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Split Bill Calculator */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-700 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>Split Check Evenly:</span>
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold">
                          {[1, 2, 3, 4, 6].map(num => (
                            <button
                              key={num}
                              onClick={() => setSplitCount(num)}
                              className={`w-6 h-6 rounded-full text-[11px] ${
                                splitCount === num
                                  ? 'bg-[#ea580c] text-white'
                                  : 'bg-white border border-stone-200 text-stone-700'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      {splitCount > 1 && (
                        <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-bold text-emerald-800">
                          <span>Per Person ({splitCount} ways):</span>
                          <span>{formatPrice(perPersonTotal)} each</span>
                        </div>
                      )}
                    </div>

                    {/* Tip Presets */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1.5">
                        Gratuity / Tip
                      </label>
                      <div className="grid grid-cols-5 gap-1.5 text-xs">
                        {[10, 15, 18, 20].map(pct => (
                          <button
                            key={pct}
                            onClick={() => { setTipPercent(pct); setCustomTip(''); }}
                            className={`py-1.5 rounded-xl text-xs font-bold ${
                              tipPercent === pct && !customTip
                                ? 'bg-[#1a4231] text-white'
                                : 'bg-stone-50 border border-stone-200 text-stone-700'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                        <button
                          onClick={() => { setTipPercent(0); setCustomTip('0'); }}
                          className={`py-1.5 rounded-xl text-xs font-bold ${
                            customTip === '0'
                              ? 'bg-[#1a4231] text-white'
                              : 'bg-stone-50 border border-stone-200 text-stone-700'
                          }`}
                        >
                          No Tip
                        </button>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. WELCOME20)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedPromo && (
                        <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                          ✓ {appliedPromo.code} applied ({appliedPromo.percent}% off)
                        </span>
                      )}
                      {promoError && (
                        <span className="text-[11px] text-rose-600 block mt-1">
                          {promoError}
                        </span>
                      )}
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <input
                        type="text"
                        placeholder="Table notes / special requests for chef..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-1.5 pt-3 border-t border-stone-100 text-xs text-stone-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-stone-800">{formatPrice(subtotal)}</span>
                      </div>
                      {orderType === 'Delivery' && (
                        <div className="flex justify-between text-blue-700 font-medium">
                          <span>Delivery Fee ({deliveryZone.split(':')[0]}):</span>
                          <span>{formatPrice(currentDeliveryFee)}</span>
                        </div>
                      )}
                      {appliedPromo && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>VIP Promo ({appliedPromo.percent}%):</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Configurable Tax (8.5%):</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gratuity:</span>
                        <span>{formatPrice(tipAmount)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                        <span>Cash Total Due:</span>
                        <span className="text-[#ea580c]">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>

                    {/* Cash-Only Protocol Badge */}
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                      <span className="text-lg leading-none mt-0.5">💵</span>
                      <div>
                        <strong className="font-bold block text-[11px] uppercase tracking-wide text-amber-900">
                          Cash Payment Method ({orderType === 'Delivery' ? 'Cash on Delivery' : orderType === 'Takeaway' ? 'Cash at Pickup' : 'Cash at Restaurant'})
                        </strong>
                        <p className="text-[10px] text-amber-800 leading-tight mt-0.5">
                          {orderType === 'Delivery' 
                            ? 'Our delivery staff will collect the exact amount in cash upon handover.' 
                            : orderType === 'Takeaway' 
                            ? 'Please pay cash at the restaurant counter when collecting your order.' 
                            : 'Your floor server will collect the cash bill folder at your table.'}
                        </p>
                      </div>
                    </div>

                    {/* Send to Kitchen Button */}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:opacity-95"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ChefHat className="w-4 h-4 text-white" />
                          <span>SEND ORDER TO KITCHEN ({formatPrice(grandTotal)})</span>
                        </>
                      )}
                    </button>
                  </>
                )}

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
