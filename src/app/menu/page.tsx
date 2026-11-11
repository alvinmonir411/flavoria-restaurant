import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import MenuClient from '@/components/menu/MenuClient';
import { getMenuItems } from '@/lib/db';

export const revalidate = false;

async function MenuLoader() {
  const items = await getMenuItems();
  return <MenuClient initialItems={items} />;
}

function MenuSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-wrap justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-9 w-24 rounded-full bg-stone-200/80" />
          ))}
        </div>
        <div className="h-9 w-64 rounded-full bg-stone-200/80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-96 rounded-3xl bg-white border border-stone-200 p-6" />
        ))}
      </div>
    </div>
  );
}

export default function MenuPage() {
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
            <span className="text-[#ea580c] font-bold">Our Menu</span>
          </nav>

          {/* Static Page Banner */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-2">
              DISCOVER OUR MENU
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#18181b] tracking-tight mb-4">
              Delicious Food For Every Taste
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Filter through Breakfast, Lunch, Dinner, Desserts, Drinks, or Chef&apos;s Special creations—all handcrafted with farm-fresh organic ingredients.
            </p>
          </div>

          {/* Cached Neon DB Menu Loader */}
          <Suspense fallback={<MenuSkeleton />}>
            <MenuLoader />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
