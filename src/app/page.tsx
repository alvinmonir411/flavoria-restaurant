import React, { Suspense } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ChefStory from '@/components/landing/ChefStory';
import MenuSection from '@/components/landing/MenuSection';
import ReservationSection from '@/components/landing/ReservationSection';
import Footer from '@/components/landing/Footer';
import { getMenuItems } from '@/lib/db';

export const revalidate = false;

async function PopularMenuLoader() {
  const allItems = await getMenuItems();
  const available = allItems.filter((item) => item.isAvailable && !item.isSoldOut);
  const signatures = available.filter((item) => item.isSignature);
  const popularDishes = (signatures.length >= 4 ? signatures : available).slice(0, 4);

  return <MenuSection dishes={popularDishes} />;
}

function PopularMenuSkeleton() {
  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-1">
            CHEF&apos;S SPECIAL
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181b] flex items-center gap-3">
            <span className="text-stone-300 font-light">—</span>
            <span>Our Popular Dishes</span>
            <span className="text-stone-300 font-light">—</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 rounded-3xl bg-stone-100 border border-stone-200" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1F2937] flex flex-col selection:bg-[#EA580C] selection:text-white">
      {/* Static First Render Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Static Hero Section */}
        <Hero />

        {/* Static About Us & Chef Craft Story */}
        <ChefStory />

        {/* Cached Neon DB Signature Dishes */}
        <Suspense fallback={<PopularMenuSkeleton />}>
          <PopularMenuLoader />
        </Suspense>

        {/* Static Reservation Invitation Section */}
        <ReservationSection />
      </main>

      {/* Static Editorial Footer */}
      <Footer />
    </div>
  );
}
