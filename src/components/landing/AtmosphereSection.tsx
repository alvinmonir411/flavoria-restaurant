'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Eye, ArrowRight } from 'lucide-react';

const SALONS = [
  {
    id: 'grand-salon',
    title: 'The Crystal Grand Salon',
    subtitle: 'Intimate Sanctuary',
    capacity: '10 Tables • 24 Guests Maximum',
    lighting: 'Soft Amber Candelabras & Baccarat Crystal',
    description: 'Enveloped in acoustic velvet drapery and hand-polished charcoal walnut. Each table is spaced with extreme architectural discretion to preserve conversation intimacy.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Acoustic Privacy', 'Formal Attire', 'Dinner Degustation']
  },
  {
    id: 'cellar-vault',
    title: 'The Sommelier Reserve Vault',
    subtitle: 'Historic Cellar Enclave',
    capacity: '6 to 10 Guests (Exclusive Buyout)',
    lighting: 'Subterranean Soft Sconce & Illuminated Vintage Wall',
    description: 'A subterranean treasure room enclosed behind vintage 19th-century French iron gates. Dine enveloped by 2,400 rare grand crus with dedicated Head Sommelier service.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Dedicated Sommelier', 'Prestige Pairings', 'Private Dining']
  },
  {
    id: 'chef-atelier',
    title: "Executive Chef's Atelier",
    subtitle: 'Culinary Theater Pass',
    capacity: '4 Guests Only (Single Seating Per Service)',
    lighting: 'Warm Directional Pass Lighting',
    description: 'An elevated black granite counter facing the synchronous artistry of Executive Chef Jean-Luc Fontaine and his brigade. Plates are finished directly before your eyes.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Interactive Plating', 'Chef Dialogue', 'Omakase Style']
  },
  {
    id: 'starlight-conservatory',
    title: 'The Starlight Conservatory',
    subtitle: 'Botanical Glass Pavilion',
    capacity: 'Up to 20 Guests',
    lighting: 'Nocturnal Starlight & Landscaped Fountain Reflections',
    description: 'A curved glass conservatory enveloped by botanical orchids, Japanese maples, and the rhythmic murmurs of our illuminated courtyard fountains.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    tags: ['Panoramic Glass', 'Private Receptions', 'Garden Views']
  }
];

export default function AtmosphereSection() {
  const [activeSalon, setActiveSalon] = useState(SALONS[0]);

  return (
    <section id="sanctuary" className="py-28 sm:py-36 bg-[#f4ede2] relative overflow-hidden border-t border-[#b8860b]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#b8860b] mb-3 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atmospheric Enclaves</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#171512] tracking-tight mb-4">
            The Sanctuary Spaces
          </h2>
          <p className="text-[#574e44] text-sm sm:text-base font-light">
            Every dining salon within L&apos;Aura Étoile has been architecturally choreographed to awaken sensory serenity and unmatched privacy.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {SALONS.map((salon) => (
            <button
              key={salon.id}
              onClick={() => setActiveSalon(salon)}
              className={`p-4 rounded-2xl text-left transition-all ${
                activeSalon.id === salon.id
                  ? 'bg-white border-2 border-[#b8860b] shadow-lg shadow-amber-500/10'
                  : 'bg-white/60 border border-stone-200 hover:border-[#b8860b]/40 shadow-xs'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider block font-bold ${
                activeSalon.id === salon.id ? 'text-[#b8860b]' : 'text-stone-500'
              }`}>
                {salon.subtitle}
              </span>
              <h4 className="font-serif font-bold text-[#171512] text-sm sm:text-base mt-1">
                {salon.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Hero Visual Card for Selected Salon */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-[#b8860b]/30 shadow-2xl min-h-[500px] flex flex-col justify-end p-8 sm:p-12">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-102"
            style={{ backgroundImage: `url('${activeSalon.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

          {/* Salon Overlay Content */}
          <div className="relative z-10 max-w-2xl text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              {activeSalon.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#b8860b]/40 text-[11px] text-[#f5e6a3] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {activeSalon.title}
            </h3>

            <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed mb-6">
              {activeSalon.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/20 mb-8 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#dfb235]" />
                <span><strong>Capacity:</strong> {activeSalon.capacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#dfb235]" />
                <span><strong>Atmosphere:</strong> {activeSalon.lighting}</span>
              </div>
            </div>

            <a
              href="#reserve"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-button text-xs font-bold uppercase tracking-wider shadow-xl"
            >
              <span>Reserve Table in this Salon</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
