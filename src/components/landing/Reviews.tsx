'use client';

import React from 'react';
import { Star, Sparkles, Quote } from 'lucide-react';

const CRITIC_REVIEWS = [
  {
    source: 'The Michelin Guide',
    quote: "A theatrical triumph of contemporary French gastronomy. Chef Fontaine's Brittany langoustine velouté and dry-aged Challans duck are pure transcendental poetry.",
    rating: 'Three Michelin Stars',
    year: '2026 Selection'
  },
  {
    source: 'The New York Times',
    quote: "Dining here feels less like a meal and more like being granted entry into a nocturnal reverie where every aroma, texture, and ceramic piece vibrates with intention.",
    rating: '★★★★ Critic Pick',
    year: 'Pete Wells Review'
  },
  {
    source: 'Forbes Travel Guide',
    quote: "Flawless sommelier intuition and an architectural interior that envelops guests in luxurious warmth. One of the undisputed apex dining destinations in the world.",
    rating: 'Five-Star Award Winner',
    year: 'Global Luxury Award'
  }
];

const GUEST_TESTIMONIALS = [
  {
    name: 'Sir Jonathan & Lady Claire Croft',
    event: 'Anniversary Dinner',
    comment: 'The 7-course tasting odyssey was the finest meal of our lives. The Miyazaki Wagyu melted like silk, and the sommelier made each vintage reveal a new secret.'
  },
  {
    name: 'Lord Richard Sterling',
    event: 'Private Cellar Tasting',
    comment: 'Impeccable service. When our guest mentioned an allergy, the kitchen substituted an entire tailored course in minutes without missing a beat.'
  },
  {
    name: 'Dr. Vivienne Moreau',
    event: 'Chef Counter Seating',
    comment: 'Sitting at the Chef’s Counter and watching the synchronized precision of the kitchen line was like watching the Paris Opera Ballet. Exquisite.'
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 sm:py-32 bg-[#faf7f2] relative border-t border-[#b8860b]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#b8860b] mb-3 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Critical Acclaim</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#171512] tracking-tight mb-4">
            Words of Reverence
          </h2>
          <p className="text-[#574e44] text-sm sm:text-base font-light">
            Honored by international gastronomic critics and cherished by those who seek unforgettable hospitality.
          </p>
        </div>

        {/* Critic Acclaims */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {CRITIC_REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-stone-200 relative flex flex-col justify-between hover:border-[#b8860b] transition-all shadow-md"
            >
              <Quote className="w-8 h-8 text-[#b8860b]/30 mb-4" />
              <p className="text-[#3a352f] text-sm italic font-serif leading-relaxed mb-6">
                &ldquo;{rev.quote}&rdquo;
              </p>
              <div className="pt-4 border-t border-stone-100">
                <div className="font-bold text-[#171512] text-sm">{rev.source}</div>
                <div className="flex items-center justify-between text-xs text-[#8a5e06] font-semibold mt-1">
                  <span>{rev.rating}</span>
                  <span className="text-stone-400 font-normal">{rev.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guest Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
          {GUEST_TESTIMONIALS.map((g, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="flex items-center gap-1 text-[#b8860b] mb-3">
                {[...Array(5)].map((_, starIdx) => (
                  <Star key={starIdx} className="w-3.5 h-3.5 fill-[#b8860b]" />
                ))}
              </div>
              <p className="text-xs text-[#453e37] leading-relaxed mb-4">
                &ldquo;{g.comment}&rdquo;
              </p>
              <div>
                <div className="font-bold text-[#171512] text-xs">{g.name}</div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">{g.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
