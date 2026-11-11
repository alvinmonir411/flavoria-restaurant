'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StaffAuthGuard from '@/components/auth/StaffAuthGuard';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Navigation, 
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Order, DeliveryDriver } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';

export default function DriverPortalPage() {
  return (
    <StaffAuthGuard
      portalName="Delivery Logistics Portal"
      allowedRoles={['Admin', 'Manager']}
    >
      <DriverPortalContent />
    </StaffAuthGuard>
  );
}

function DriverPortalContent() {
  const { formatPrice } = useCurrency();
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-1');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cashCollectedInput, setCashCollectedInput] = useState<{ [key: string]: string }>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/drivers');
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        // Show Delivery orders
        const deliveries = (data.orders || []).filter((o: Order) => o.orderType === 'Delivery');
        setOrders(deliveries);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];
  const driverOrders = orders.filter(o => 
    // Filter orders either assigned to this driver or pending assignment
    o.assignedDriverId === selectedDriverId || !o.assignedDriverId
  );

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status'], cashAmount?: number) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: orderId, 
          status: newStatus,
          paymentStatus: newStatus === 'served' ? 'paid' : undefined,
          cashAmountCollected: cashAmount
        })
      });
      if (res.ok) {
        setActionSuccess(`Order #${orderId.slice(-6)} updated to ${newStatus}`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      {/* Driver Header */}
      <header className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 sticky top-0 z-50 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/management" 
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
              title="Back to Admin"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                  Flavoria Delivery Dispatch
                </h1>
                <p className="text-[11px] text-stone-500">Driver Portal & Cash-on-Delivery Ledger</p>
              </div>
            </div>
          </div>

          {/* Driver Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 hidden sm:inline">Active Staff:</span>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.vehicle} — {d.status})
                </option>
              ))}
            </select>

            <button 
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Driver Stats Strip */}
      <section className="bg-emerald-800 text-white py-3 px-4 sm:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span>Driver: <strong>{activeDriver?.name || 'Driver'}</strong> ({activeDriver?.vehicle || 'Bike'})</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Rating: <strong>⭐ {activeDriver?.rating || 4.9}</strong></span>
            <span>Assigned Deliveries: <strong>{driverOrders.filter(o => o.status !== 'served' && o.status !== 'cancelled').length} Active</strong></span>
          </div>
        </div>
      </section>

      {/* Main Delivery Feed */}
      <main className="max-w-5xl mx-auto w-full p-4 sm:p-8 flex-1">
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Assigned Deliveries &amp; Cash Collections
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Cash-on-Delivery Protocol (Cash Only)
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
            <p className="text-xs">Loading assigned orders...</p>
          </div>
        ) : driverOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">No Deliveries in Queue!</h3>
            <p className="text-stone-500 text-xs">You have completed all assigned deliveries. Stay on standby for new customer orders.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {driverOrders.map((order) => {
              const isDelivered = order.status === 'served';
              const isEnRoute = order.status === 'out_for_delivery';
              const isReady = order.status === 'ready';

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl p-6 border transition-all duration-300 shadow-xs ${
                    isDelivered
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isEnRoute
                      ? 'border-blue-400 shadow-md ring-2 ring-blue-400/20'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-stone-900">
                        #{order.orderCode}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isDelivered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isEnRoute
                          ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Cash to Collect Highlight */}
                    <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-2xl border border-emerald-200">
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block leading-tight">Cash to Collect</span>
                        <strong className="text-sm font-bold text-emerald-900 leading-tight">
                          {formatPrice(order.totalAmount)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Customer Delivery Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <div className="text-xs text-stone-500 uppercase font-bold">Customer Contact</div>
                      <div className="font-bold text-sm text-stone-900">{order.customerName}</div>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{order.customerPhone}</span>
                      </a>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-stone-500 uppercase font-bold">Delivery Address</div>
                      <div className="flex items-start gap-1.5 text-xs text-stone-700">
                        <MapPin className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <span>{order.deliveryAddress || 'Gulshan-2, Road 71, House 14, Dhaka 1212'}</span>
                      </div>
                      {order.deliveryZone && (
                        <div className="text-[11px] text-stone-500 pl-5">
                          Zone: <strong>{order.deliveryZone}</strong>
                        </div>
                      )}
                      {order.notes && (
                        <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-2">
                          Note: {order.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ordered Items Preview */}
                  <div className="pt-3 border-t border-stone-100 pb-4">
                    <div className="text-xs text-stone-500 font-bold mb-1.5">Package Contents:</div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((i, idx) => (
                        <span key={idx} className="text-xs bg-stone-100 px-2.5 py-1 rounded-lg text-stone-800 font-medium">
                          {i.quantity}x {i.name} {i.variant ? `(${i.variant})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Driver Status Action Strip */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    {!isDelivered ? (
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {!isEnRoute && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Pick Up &amp; Start Journey</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleUpdateStatus(order.id, 'served', order.totalAmount)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Cash Collected &amp; Delivered</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Delivered successfully. Cash reconciled in register.</span>
                      </div>
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
