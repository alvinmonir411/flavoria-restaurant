'use client';

import React from 'react';
import { Clock, MapPin, Phone, Mail, Car, Shield, Sparkles } from 'lucide-react';

export default function LocationHours() {
  return (
    <section id="location" className="py-24 sm:py-32 bg-[#f4ede2] relative border-t border-[#b8860b]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#b8860b] mb-3 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finding Our Sanctuary</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#171512] tracking-tight mb-4">
            Hours & Concierge Information
          </h2>
          <p className="text-[#574e44] text-sm sm:text-base font-light">
            Nestled in the historic cultural quarter, offering private subterranean valet arrival.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Column 1: Opening Hours */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-white border border-stone-200 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
                <Clock className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#171512] mb-6">
                Service Timings
              </h3>

              <div className="space-y-5 text-xs">
                <div className="pb-4 border-b border-stone-100">
                  <div className="text-[#8a5e06] font-bold mb-1 uppercase tracking-wider">
                    Dinner Degustation
                  </div>
                  <div className="flex justify-between text-[#38332c] font-medium">
                    <span>Tuesday – Sunday</span>
                    <span className="font-mono text-[#b8860b] font-bold">18:30 – 23:30</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Last kitchen tasting seating: 21:00</p>
                </div>

                <div className="pb-4 border-b border-stone-100">
                  <div className="text-[#8a5e06] font-bold mb-1 uppercase tracking-wider">
                    Lunch Service
                  </div>
                  <div className="flex justify-between text-[#38332c] font-medium">
                    <span>Thursday – Sunday</span>
                    <span className="font-mono text-[#b8860b] font-bold">12:00 – 14:30</span>
                  </div>
                </div>

                <div className="pb-4 border-b border-stone-100">
                  <div className="text-[#8a5e06] font-bold mb-1 uppercase tracking-wider">
                    The Sommelier Cellar Bar
                  </div>
                  <div className="flex justify-between text-[#38332c] font-medium">
                    <span>Tuesday – Sunday</span>
                    <span className="font-mono text-[#b8860b] font-bold">17:00 – Midnight</span>
                  </div>
                </div>

                <div>
                  <div className="text-stone-400 font-bold uppercase tracking-wider">
                    Monday
                  </div>
                  <div className="text-[#574e44]">
                    Closed for culinary research, farm harvests & private buyouts
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-[#574e44]">
              <Shield className="w-4 h-4 text-[#b8860b]" />
              <span>Reservations recommended at least 2 weeks in advance.</span>
            </div>
          </div>

          {/* Column 2: Location & Contact */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-white border border-stone-200 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
                <MapPin className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#171512] mb-6">
                Arrival & Address
              </h3>

              <div className="space-y-5 text-xs text-[#38332c]">
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block mb-1 font-semibold">Sanctuary Address</span>
                  <p className="font-bold text-[#171512] text-sm">
                    742 Grand Avenue, Nocturne Promenade, Suite 100
                  </p>
                  <p className="text-[#574e44]">Metropolitan Cultural District, NY 10021</p>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="text-stone-500 uppercase tracking-wider block mb-1 font-semibold">Direct Concierge</span>
                  <a
                    href="tel:+15550192834"
                    className="flex items-center gap-2 text-[#8a5e06] font-mono text-sm hover:text-[#b8860b] font-bold"
                  >
                    <Phone className="w-4 h-4 text-[#b8860b]" />
                    <span>+1 (555) 019-2834</span>
                  </a>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="text-stone-500 uppercase tracking-wider block mb-1 font-semibold">Maître d&apos; Inquiries</span>
                  <a
                    href="mailto:concierge@laura-etoile.com"
                    className="flex items-center gap-2 text-[#8a5e06] text-xs hover:text-[#b8860b] font-medium"
                  >
                    <Mail className="w-4 h-4 text-[#b8860b]" />
                    <span>concierge@laura-etoile.com</span>
                  </a>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-start gap-2.5 text-xs text-[#574e44]">
                  <Car className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
                  <span>
                    Complimentary white-glove valet parking is located at the private courtyard gate.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="#reserve"
                className="w-full py-3.5 block text-center rounded-xl gold-button text-xs uppercase tracking-wider font-bold shadow-md"
              >
                Book Table For Tonight
              </a>
            </div>
          </div>

          {/* Column 3: Visual Location Card */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-stone-200 overflow-hidden relative shadow-md min-h-[350px] flex flex-col">
            <div className="relative flex-1 bg-stone-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                alt="L'Aura Interior Ambiance"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#b8860b]/40 text-[10px] text-[#785307] tracking-wider uppercase font-bold shadow-sm">
                Valet Gate Open
              </div>

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-md">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#171512] mb-1">
                  <MapPin className="w-4 h-4 text-[#b8860b]" />
                  <span>Historic Promenade Gate</span>
                </div>
                <p className="text-[11px] text-[#574e44]">
                  Private entrance behind the landscaped fountain gardens. Security & valet attendant on duty throughout evening service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
