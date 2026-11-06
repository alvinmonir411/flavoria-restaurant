'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, Calendar, Leaf, ChefHat, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, CTAs, Features */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Tagline */}
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-3">
              GOOD FOOD | GOOD MOOD
            </span>

            {/* Headline matching reference image */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#18181b] tracking-tight leading-[1.1] mb-6">
              Delicious Food <br />
              for <span className="font-serif italic font-normal text-[#ea580c] text-5xl sm:text-6xl lg:text-7xl">Every Mood</span>
            </h1>

            {/* Description */}
            <p className="max-w-lg text-base text-stone-600 font-light leading-relaxed mb-8">
              Experience a perfect blend of taste, quality, and ambience. Every dish is crafted with love and passion to bring joy to your table.
            </p>

            {/* Two Action Buttons linking to separate pages */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                href="/menu"
                className="px-7 py-3.5 rounded-full btn-primary-orange text-xs tracking-wider uppercase font-bold flex items-center gap-2.5 shadow-md"
              >
                <Utensils className="w-4 h-4 text-white" />
                <span>EXPLORE MENU</span>
              </Link>

              <Link
                href="/reservation"
                className="px-7 py-3.5 rounded-full btn-outline-orange text-xs tracking-wider uppercase font-bold flex items-center gap-2.5"
              >
                <Calendar className="w-4 h-4 text-[#ea580c]" />
                <span>BOOK A TABLE</span>
              </Link>
            </div>

            {/* 3 Value Icons below buttons matching reference */}
            <div className="flex items-center gap-8 sm:gap-10 border-t border-stone-100 pt-6">
              <div className="flex items-center gap-2.5 text-stone-700">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-stone-800 leading-tight">
                  Fresh <br /> <span className="text-stone-500 font-normal">Ingredients</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-stone-700">
                <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ea580c]">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-stone-800 leading-tight">
                  Expert <br /> <span className="text-stone-500 font-normal">Chefs</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-stone-700">
                <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-stone-800 leading-tight">
                  Made with <br /> <span className="text-stone-500 font-normal">Love</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Giant Circular Gourmet Plate Visual + Floating Badge */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background subtle plate glow */}
            <div className="absolute inset-0 bg-orange-100/50 rounded-full blur-3xl transform scale-90 pointer-events-none" />

            {/* Circular Plate Image matching reference image */}
            <div className="relative w-80 sm:w-96 lg:w-[440px] h-80 sm:h-96 lg:h-[440px] rounded-full overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="Delicious Gourmet Dish Platter"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Floating Top-Right Circular Badge matching reference: "30+ Signature Dishes" */}
            <div className="absolute top-2 right-2 sm:right-6 bg-white rounded-full p-4 sm:p-5 shadow-xl border border-stone-200 flex flex-col items-center justify-center text-center w-24 h-24 sm:w-28 sm:h-28 z-20 animate-float-slow">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#ea580c] leading-none">
                30+
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-stone-700 uppercase tracking-tight mt-1 leading-tight">
                Signature <br /> Dishes
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
