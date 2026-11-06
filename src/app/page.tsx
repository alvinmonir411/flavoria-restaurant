'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ChefStory from '@/components/landing/ChefStory';
import MenuSection from '@/components/landing/MenuSection';
import ReservationSection from '@/components/landing/ReservationSection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1F2937] flex flex-col selection:bg-[#EA580C] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Sections from Flavoria Reference */}
      <main className="flex-1">
        {/* Section 1: Hero with Circular Dish & "Delicious Food for Every Mood" */}
        <Hero />

        {/* Section 2: "Good Food, Good Life" About Us with 10+ Years Experience Badge */}
        <ChefStory />

        {/* Section 3: "— Our Popular Dishes —" Chef's Special 4-Dish Grid */}
        <MenuSection />

        {/* Section 4: Special Offer (20% Off) + Beverage + "Book Your Table" + Trust Bar */}
        <ReservationSection />
      </main>

      {/* Reference Footer with Newsletter & Quick Links */}
      <Footer />
    </div>
  );
}
