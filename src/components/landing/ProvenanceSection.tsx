'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Shield, Wine } from 'lucide-react';

interface TerroirItem {
  id: string;
  name: string;
  origin: string;
  category: string;
  description: string;
  harvestMethod: string;
  sommelierPairing: string;
  image: string;
}

const TERROIR_ITEMS: TerroirItem[] = [
  {
    id: 'wagyu',
    name: 'A5 Miyazaki Wagyu Tenderloin',
    origin: 'Miyakonojo, Miyazaki Prefecture, Japan',
    category: 'Viande Prestige',
    description: 'Certified 100% Kuroge Washu black cattle raised with mineral spring water and bespoke roasted grain feed. Imparts unparalleled silkiness and an oleic marbling score of BMS 11+.',
    harvestMethod: 'Single-estate certified humane raising, aged 28 days in himalayan salt chambers.',
    sommelierPairing: 'Château Margaux 2005 (Premier Grand Cru Classé)',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'lobster',
    name: 'Brittany Blue Lobster (Homard Bleu)',
    origin: 'Saint-Malo Bay, Brittany, France',
    category: 'Merveille Maritime',
    description: 'Caught in the frigid, rocky Atlantic swells of Saint-Malo by artisanal day-boat fishers using heritage wicker traps. Yields sweet, crystalline flesh with unforgettable mineral depth.',
    harvestMethod: 'Single-day dive boats, zero trawling, immediate cold-salt transit.',
    sommelierPairing: 'Meursault 1er Cru Charmes 2018 (Domaine des Comtes Lafon)',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'truffle',
    name: 'Wild White Alba Truffle (Tuber Magnatum Pico)',
    origin: 'Piedmont & Monferrato Hills, Italy',
    category: 'Or Terrestre',
    description: 'Unearthed at midnight under ancient hazel and white willow roots by certified truffieri and Lagotto Romagnolo hounds. Shaved tableside forty-eight hours post-harvest.',
    harvestMethod: 'Foraged by scent hound in native subterranean soil without mechanized tools.',
    sommelierPairing: 'Barolo Monfortino Riserva 2013 (Giacomo Conterno)',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'caviar',
    name: 'Imperial Ossetra Caviar (Acipenser Gueldenstaedtii)',
    origin: 'Caspian Basin Mineral Springs, Private Reserve',
    category: 'Perles Noires',
    description: 'Golden-amber large pearls boasting a buttery walnut finish and delicate oceanic brine. Matured with pure sea salt according to centuries-old Astrakhan traditions.',
    harvestMethod: 'Sustainably farmed ancient sturgeon stock in pristine artesian glacier water.',
    sommelierPairing: 'Krug Clos du Mesnil Champagne 2008',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80'
  }
];

export default function ProvenanceSection() {
  const [selectedItem, setSelectedItem] = useState<TerroirItem>(TERROIR_ITEMS[0]);

  return (
    <section id="terroir" className="py-28 sm:py-36 bg-[#faf7f2] relative overflow-hidden border-t border-[#b8860b]/20">
      {/* Background soft glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-400/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#b8860b] mb-3 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Terroir & Traceability</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#171512] tracking-tight mb-4">
            Uncompromising Provenance
          </h2>
          <p className="text-[#574e44] text-sm sm:text-base font-light">
            Every creation on our degustation menu begins with singular ingredients cultivated by multigenerational artisans across the globe.
          </p>
        </div>

        {/* Interactive Selector Chips */}
        <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {TERROIR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2.5 ${
                selectedItem.id === item.id
                  ? 'gold-button shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-white border border-stone-200 text-[#474139] hover:text-[#b8860b] hover:border-[#b8860b]/50 shadow-xs'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.name.split('(')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Active Provenance Card Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel rounded-3xl p-6 sm:p-10 gold-glow relative overflow-hidden">
          {/* Left Column: Image with Luxury Framing */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-[#b8860b]/30 shadow-xl">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#b8860b]/40 text-xs text-[#785307] font-bold flex items-center gap-2 shadow-sm">
                <Shield className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>100% Direct Estate Traceability</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-md">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-semibold">Harvest Location</span>
                <span className="text-xs font-bold text-[#171512] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#b8860b]" />
                  {selectedItem.origin}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Details */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#b8860b] font-bold">
                {selectedItem.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171512] mt-1 mb-3">
                {selectedItem.name}
              </h3>
              <p className="text-[#453e37] text-sm sm:text-base font-light leading-relaxed mb-6">
                {selectedItem.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200">
                <span className="text-[10px] uppercase tracking-wider text-[#b8860b] font-bold block mb-1">
                  Artisanal Harvest Discipline
                </span>
                <p className="text-xs text-[#453e37]">
                  {selectedItem.harvestMethod}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f4ede2] border border-[#b8860b]/30 flex items-center gap-3">
                <Wine className="w-5 h-5 text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#785307] font-bold block">
                    Sommelier Pairing Allocation
                  </span>
                  <span className="text-xs font-serif font-bold text-[#171512]">
                    {selectedItem.sommelierPairing}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
