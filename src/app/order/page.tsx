import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import OrderClient from '@/components/order/OrderClient';
import {
  getDeliveryZones,
  getMenuItems,
  getRestaurantSettings,
  getTables,
} from '@/lib/db';

export const revalidate = false;

async function OrderLoader() {
  const [items, tables, zones, settings] = await Promise.all([
    getMenuItems(),
    getTables(),
    getDeliveryZones(),
    getRestaurantSettings(),
  ]);

  return (
    <OrderClient
      initialItems={items}
      initialTables={tables}
      initialZones={zones}
      settings={settings}
    />
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-36 rounded-3xl bg-white border border-stone-200 p-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="h-12 rounded-2xl bg-stone-200/70" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 rounded-3xl bg-white border border-stone-200" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 h-96 rounded-3xl bg-white border border-stone-200" />
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Static Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#ea580c]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ea580c] font-bold">Order Online</span>
          </nav>

          {/* Cached Neon DB Ordering Loader */}
          <Suspense fallback={<OrderSkeleton />}>
            <OrderLoader />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
