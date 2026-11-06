'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, ChefHat, Sparkles, Home, ArrowRight } from 'lucide-react';

export default function ChefStory() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Cozy Restaurant Interior Image + Experience Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[380px] sm:h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                alt="Cozy Restaurant Ambience"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Orange Experience Badge on bottom right matching reference */}
            <div className="absolute -bottom-6 -right-3 sm:right-4 bg-[#ea580c] text-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center w-28 sm:w-32">
              <span className="font-serif text-3xl font-bold leading-none">
                10+
              </span>
              <span className="text-[11px] font-bold uppercase tracking-tight mt-1 leading-tight">
                Years of <br /> Experience
              </span>
            </div>
          </div>

          {/* Center Column: Narrative & Signature */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-2">
              WELCOME TO FLAVORIA
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#18181b] tracking-tight leading-[1.15] mb-4">
              Good Food, <br />
              Good <span className="font-serif italic font-normal text-[#ea580c]">Life</span>
            </h2>

            <p className="text-stone-600 text-sm leading-relaxed mb-6 font-light">
              At Flavoria, we believe that great food brings people together. Our menu is inspired by global flavors and crafted with the freshest seasonal ingredients to create memorable dining moments.
            </p>

            {/* Signature Script matching reference */}
            <div className="font-serif italic text-2xl text-[#18181b] mb-8">
              Flavoria ♡
            </div>

            {/* Dark Green Pill Button matching reference */}
            <Link
              href="/about"
              className="px-6 py-3 rounded-full bg-[#1a4231] hover:bg-[#122b20] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-md transition-all"
            >
              <span>LEARN MORE ABOUT US</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>

          {/* Right Column: 3 Vertical Feature Cards matching reference */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Feature 1 */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-4 hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 leading-tight">
                  Quality Ingredients
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Fresh farm-to-table daily
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-4 hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 leading-tight">
                  Skilled Chefs
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Culinary mastery & passion
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-4 hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 leading-tight">
                  Cozy Ambience
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Warm, intimate atmosphere
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
