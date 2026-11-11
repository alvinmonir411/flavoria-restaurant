'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StaffAuthGuard from '@/components/auth/StaffAuthGuard';
import { getStaffRequestHeaders } from '@/context/StaffAuthContext';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Filter, 
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  QrCode,
  Truck,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';

type StationFilter = 'All' | 'Grill' | 'Saute' | 'Pastry' | 'Cold Bar' | 'Bar';

export default function KitchenPage() {
  return (
    <StaffAuthGuard
      portalName="Kitchen Display System (KDS 2.0)"
      allowedRoles={['Admin', 'Manager']}
    >
      <KitchenContent />
    </StaffAuthGuard>
  );
}

function KitchenContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState<StationFilter>('All');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [now, setNow] = useState<number>(() => Date.now());

  // Timer tick every 10 seconds for elapsed prep timers
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        // Show active kitchen orders: received, in_kitchen, ready
        const active = (data.orders || []).filter((o: Order) => 
          o.status === 'received' || o.status === 'in_kitchen' || o.status === 'ready'
        );
        setOrders(active);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: getStaffRequestHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getElapsedMins = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    return Math.floor((now - created) / 60000);
  };

  return (
    <div className="min-h-screen bg-[#121417] text-white flex flex-col font-sans">
      {/* Top Bar for Kitchen Tablets */}
      <header className="bg-[#1A1D21] border-b border-stone-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link 
            href="/management" 
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#EA580C] flex items-center justify-center text-white shadow-md">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                  FLAVORIA KDS 2.0
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">Kitchen Display & Station Routing System</p>
            </div>
          </div>
        </div>

        {/* Station Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {(['All', 'Grill', 'Saute', 'Pastry', 'Cold Bar', 'Bar'] as StationFilter[]).map((st) => (
            <button
              key={st}
              onClick={() => setStation(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                station === st
                  ? 'bg-[#EA580C] text-white shadow-md'
                  : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              soundEnabled ? 'bg-stone-800 text-emerald-400' : 'bg-stone-800 text-stone-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>

          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="bg-stone-800 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-300 border border-stone-700">
            Active: <span className="text-[#EA580C]">{orders.length}</span> Tickets
          </div>
        </div>
      </header>

      {/* Main KDS Grid */}
      <main className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin text-[#EA580C] mb-2" />
          </div>
        ) : orders.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-[#1A1D21] rounded-3xl border border-stone-800 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mb-4 border border-emerald-500/20">
              ✓
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">All Kitchen Stations Clear!</h3>
            <p className="text-stone-400 text-xs max-w-sm">
              No pending orders in queue. New customer orders from Delivery, Takeaway, or Table QR will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {orders.map((ticket) => {
              const elapsed = getElapsedMins(ticket.createdAt);
              const isUrgent = elapsed >= 20;
              const isWarning = elapsed >= 10 && elapsed < 20;

              return (
                <div
                  key={ticket.id}
                  className={`bg-[#1A1D21] rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl border-2 ${
                    isUrgent
                      ? 'border-rose-600/90 shadow-rose-900/20 animate-pulse'
                      : isWarning
                      ? 'border-amber-500/80 shadow-amber-900/10'
                      : 'border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {/* Ticket Header */}
                  <div className={`p-4 border-b border-stone-800 flex items-center justify-between ${
                    isUrgent ? 'bg-rose-950/40' : isWarning ? 'bg-amber-950/30' : 'bg-[#22262B]'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-white tracking-wider">
                          #{ticket.orderCode}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ticket.orderType === 'Dine-In'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : ticket.orderType === 'Delivery'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {ticket.orderType}
                        </span>
                      </div>
                      <div className="text-xs text-stone-300 font-semibold mt-1">
                        {ticket.orderType === 'Dine-In' ? (
                          <span className="text-amber-400 font-bold">Table: {ticket.tableNumber || 'Floor'}</span>
                        ) : ticket.orderType === 'Delivery' ? (
                          <span>Delivery to: {ticket.customerName}</span>
                        ) : (
                          <span>Pickup: {ticket.customerName}</span>
                        )}
                      </div>
                    </div>

                    {/* Timer Badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                      isUrgent
                        ? 'bg-rose-600 text-white'
                        : isWarning
                        ? 'bg-amber-500 text-black'
                        : 'bg-stone-800 text-emerald-400 border border-stone-700'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsed}m</span>
                    </div>
                  </div>

                  {/* Ticket Items */}
                  <div className="p-4 flex-1 space-y-3 divide-y divide-stone-800/60 overflow-y-auto max-h-72">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="pt-2.5 first:pt-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-lg bg-stone-800 flex items-center justify-center font-bold text-xs text-[#EA580C] shrink-0">
                              {item.quantity}x
                            </span>
                            <div>
                              <div className="text-sm font-bold text-white leading-tight">
                                {item.name}
                              </div>
                              {item.variant && (
                                <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                                  Size: {item.variant}
                                </div>
                              )}
                              {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <div className="text-[10px] text-stone-400 mt-0.5">
                                  + {item.selectedAddons.map(a => a.name).join(', ')}
                                </div>
                              )}
                              {item.spiceLevel && (
                                <div className="text-[10px] text-rose-400 font-bold mt-0.5">
                                  🌶️ {item.spiceLevel}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {item.customNotes && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 italic">
                            &quot;{item.customNotes}&quot;
                          </div>
                        )}
                      </div>
                    ))}

                    {ticket.notes && (
                      <div className="pt-2 text-[11px] text-stone-400 italic">
                        Order Note: {ticket.notes}
                      </div>
                    )}
                  </div>

                  {/* Ticket Action Footers */}
                  <div className="p-3 bg-[#16181B] border-t border-stone-800 flex items-center gap-2">
                    {ticket.status === 'received' ? (
                      <button
                        onClick={() => updateStatus(ticket.id, 'in_kitchen')}
                        className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Start Cooking</span>
                      </button>
                    ) : ticket.status === 'in_kitchen' ? (
                      <button
                        onClick={() => updateStatus(ticket.id, 'ready')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Plated & Ready</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(ticket.id, 'served')}
                        className="w-full py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Complete Ticket</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
