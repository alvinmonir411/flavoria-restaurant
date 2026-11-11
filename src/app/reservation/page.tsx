import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ReservationClient from '@/components/reservation/ReservationClient';
import { getRestaurantSettings, getTables } from '@/lib/db';

export const revalidate = false;

async function ReservationLoader() {
  const [tables, settings] = await Promise.all([getTables(), getRestaurantSettings()]);

  return (
    <ReservationClient
      initialTables={tables}
      isReservationsOpen={settings.isReservationsOpen}
    />
  );
}

function ReservationSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-8 space-y-6">
        <div className="h-44 rounded-3xl bg-white border border-stone-200" />
        <div className="h-72 rounded-3xl bg-white border border-stone-200" />
      </div>
      <div className="lg:col-span-4 h-80 rounded-3xl bg-white border border-stone-200" />
    </div>
  );
}

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Static Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#ea580c]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ea580c] font-bold">Book a Table</span>
          </nav>

          {/* Static Heading Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-2">
              WORLD-CLASS SEATING SELECTION
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#18181b] tracking-tight mb-4">
              Book Your Table at Flavoria
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Choose your exact table on our interactive 2D floor plan, customize celebration add-ons, and enjoy immediate confirmation backed by our live Neon PostgreSQL database.
            </p>
          </div>

          {/* Cached Neon DB Tables & Settings Loader */}
          <Suspense fallback={<ReservationSkeleton />}>
            <ReservationLoader />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
