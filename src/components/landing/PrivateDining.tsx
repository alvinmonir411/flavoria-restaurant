'use client';

import React from 'react';
import { Sparkles, Users, Wine, CalendarCheck, ShieldCheck } from 'lucide-react';

export default function PrivateDining() {
  return (
    <section id="private-dining" className="py-24 sm:py-32 bg-[#f4ede2] relative border-t border-[#b8860b]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#b8860b] mb-3 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Enclaves</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#171512] tracking-tight mb-4">
            Private Salons & Bespoke Banquets
          </h2>
          <p className="text-[#574e44] text-sm sm:text-base font-light">
            Host intimate family milestones, executive state dinners, or sommelier-guided masterclasses within our secluded private dining enclaves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: The Wine Vault */}
          <div className="rounded-3xl bg-white border border-stone-200 overflow-hidden flex flex-col group hover:border-[#b8860b] transition-all shadow-md">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80"
                alt="Private Wine Vault Dining"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#b8860b]/40 text-[11px] text-[#785307] font-bold flex items-center gap-1.5 shadow-sm">
                <Wine className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>The Sommelier Vault</span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#171512] mb-2">
                  The Historic Reserve Cellar
                </h3>
                <p className="text-xs text-[#574e44] leading-relaxed mb-6 font-light">
                  Secluded behind vintage wrought iron and French oak racks holding 2,400 rare allocated vintages. Accommodates up to 10 guests for custom wine flights and private chef consultations.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-[#453e37] mb-6 font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#b8860b]" />
                    <span>Capacity: 6–10 Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#b8860b]" />
                    <span>Dedicated Sommelier</span>
                  </div>
                </div>
              </div>

              <a
                href="#reserve"
                className="py-3 text-center rounded-xl gold-outline-button text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                Inquire For Vault Booking
              </a>
            </div>
          </div>

          {/* Card 2: The Conservatory Terrace */}
          <div className="rounded-3xl bg-white border border-stone-200 overflow-hidden flex flex-col group hover:border-[#b8860b] transition-all shadow-md">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="The Glass Pavilion Terrace"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#b8860b]/40 text-[11px] text-[#785307] font-bold flex items-center gap-1.5 shadow-sm">
                <CalendarCheck className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>The Glass Pavilion</span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#171512] mb-2">
                  The Starlight Glass Conservatory
                </h3>
                <p className="text-xs text-[#574e44] leading-relaxed mb-6 font-light">
                  Surrounded by botanical garden greenery and open skylights under starlight. Ideal for cocktail receptions, product unveils, and wedding rehearsal banquets.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-[#453e37] mb-6 font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#b8860b]" />
                    <span>Capacity: Up to 24 Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#b8860b]" />
                    <span>Private Outdoor Pergola</span>
                  </div>
                </div>
              </div>

              <a
                href="#reserve"
                className="py-3 text-center rounded-xl gold-outline-button text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                Inquire For Conservatory
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
