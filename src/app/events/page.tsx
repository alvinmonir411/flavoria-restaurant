'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useCurrency } from '@/context/CurrencyContext';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  Wine, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Send,
  Building,
  GlassWater
} from 'lucide-react';
import { EventInquiry } from '@/types';

const PACKAGES = [
  {
    tier: 'Classic Elegance',
    pricePerGuest: 85,
    tagline: 'Refined 3-course private luncheon or relaxed celebratory dinner',
    features: [
      '3-course farm-to-table seasonal menu',
      'Welcome sparkling mocktail on arrival',
      'Dedicated private floor captain',
      'Customized printed menus with company/family logo'
    ]
  },
  {
    tier: 'Gourmet Gold',
    pricePerGuest: 145,
    tagline: 'Our premier 5-course banquet with private lounge buyout',
    features: [
      '5-course signature menu featuring A5 Wagyu & Lobster',
      'Sommelier curated wine pairing with each course',
      'Full private lounge or terrace garden exclusive access',
      'Artisan celebration cake and personalized gift boxes'
    ]
  },
  {
    tier: 'Royal Gastronomy',
    pricePerGuest: 245,
    tagline: 'The ultimate bespoke culinary spectacle hosted by Chef Marco Rossi',
    features: [
      '7-course blind tasting odyssey with live kitchen show',
      'Imperial Ossetra Caviar and Vintage Champagne reception',
      'Grand Cru allocated cellar pairings',
      'Full restaurant buyout availability & live music coordination'
    ]
  }
];

export default function EventsPage() {
  const { formatPrice } = useCurrency();
  const [guestCount, setGuestCount] = useState(25);
  const [selectedTier, setSelectedTier] = useState<string>('Gourmet Gold');
  const [openBar, setOpenBar] = useState(true);

  // Form
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState<'Corporate Gala' | 'Wedding Reception' | 'Birthday Celebration' | 'VIP Wine Tasting'>('Corporate Gala');
  const [preferredDate, setPreferredDate] = useState('2026-12-15');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [confirmedInquiry, setConfirmedInquiry] = useState<EventInquiry | null>(null);

  const currentPkg = PACKAGES.find(p => p.tier === selectedTier) || PACKAGES[1];
  const barPricePerGuest = openBar ? 40 : 0;
  const estimatedTotal = (currentPkg.pricePerGuest + barPricePerGuest) * guestCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !email) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName,
          email,
          phone,
          eventType,
          guestCount,
          preferredDate,
          packageTier: selectedTier,
          estimatedBudget: estimatedTotal,
          notes: `${openBar ? '[Open Luxury Bar Included] ' : ''}${notes}`.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.inquiry) {
        setConfirmedInquiry(data.inquiry);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#ea580c]">Home</Link>
            <span>/</span>
            <span className="text-[#ea580c] font-bold">Private Dining & Events</span>
          </nav>

          {/* Heading Banner */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#ea580c] text-xs font-bold uppercase mb-2">
              <Building className="w-3.5 h-3.5" />
              <span>PRIVATE GATHERINGS & CELEBRATIONS</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight mb-4">
              Private Dining & Banquets
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              From intimate corporate galas to dream wedding receptions, our dedicated events team and executive kitchen deliver unparalleled hospitality.
            </p>
          </div>

          {/* 3 Packages Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {PACKAGES.map((pkg) => {
              const isSelected = selectedTier === pkg.tier;
              return (
                <div
                  key={pkg.tier}
                  onClick={() => setSelectedTier(pkg.tier)}
                  className={`p-8 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-white border-[#ea580c] shadow-2xl ring-2 ring-[#ea580c] -translate-y-1'
                      : 'bg-white/80 border-stone-200 hover:border-orange-300 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase font-bold tracking-wider text-[#ea580c]">
                        Package
                      </span>
                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-[10px] font-bold">
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
                      {pkg.tier}
                    </h3>
                    <p className="text-xs text-stone-500 font-light mb-6">
                      {pkg.tagline}
                    </p>

                    <div className="mb-6 pb-6 border-b border-stone-100">
                      <span className="font-serif text-3xl font-bold text-[#ea580c]">
                        {formatPrice(pkg.pricePerGuest)}
                      </span>
                      <span className="text-xs text-stone-500 font-medium"> / guest</span>
                    </div>

                    <div className="space-y-3 text-xs text-stone-600">
                      {pkg.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-light">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-stone-100">
                    <button
                      type="button"
                      className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors ${
                        isSelected
                          ? 'btn-primary-orange text-white shadow-md'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {isSelected ? 'Tier Selected' : 'Choose This Tier'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Event Budget Estimator & Inquiry Form Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Interactive Budget Estimator (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                  Instant Budget Calculator
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  Tailor your guest count and beverage package to receive a live estimate.
                </p>
              </div>

              {/* Guest Count Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-stone-800 mb-2">
                  <span>Party Size (Guests):</span>
                  <span className="text-base text-[#ea580c] font-serif">{guestCount} Guests</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                  <span>10 Guests (Alcove)</span>
                  <span>35 Guests (Lounge)</span>
                  <span>60 Guests (Full Terrace)</span>
                </div>
              </div>

              {/* Open Bar Toggle */}
              <div 
                onClick={() => setOpenBar(!openBar)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  openBar ? 'border-[#ea580c] bg-orange-50/50' : 'border-stone-200 bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wine className="w-5 h-5 text-[#ea580c]" />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Include Premium Open Bar</h5>
                    <span className="text-[11px] text-stone-500 font-light">
                      Cocktails, vintage wines & reserve spirits (+{formatPrice(40)}/guest)
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={openBar}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#ea580c]"
                />
              </div>

              {/* Estimate Summary */}
              <div className="p-6 rounded-2xl bg-[#1a4231] text-white space-y-2">
                <span className="text-[11px] uppercase font-bold text-emerald-200 block">
                  Estimated Banquet Total
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-3xl font-bold text-white">
                    {formatPrice(estimatedTotal)}
                  </span>
                  <span className="text-xs text-emerald-100">
                    ({formatPrice(estimatedTotal / guestCount)} / guest)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 font-light pt-2 border-t border-emerald-800">
                  Includes private room hire, dedicated service staff, and table dressings.
                </p>
              </div>
            </div>

            {/* Right: Booking Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Submit Event Request
              </h3>
              <p className="text-xs text-stone-500 font-light mb-6">
                Our Private Dining Director will respond within 24 hours to coordinate customized menus.
              </p>

              {confirmedInquiry ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-emerald-900 mb-1">
                    Event Inquiry Confirmed!
                  </h4>
                  <p className="text-xs text-emerald-700 mb-6 font-light">
                    Reference ID: <strong className="font-mono text-sm text-[#ea580c]">{confirmedInquiry.id}</strong>. Our director has recorded your date ({confirmedInquiry.preferredDate}) in the database.
                  </p>
                  <button
                    onClick={() => setConfirmedInquiry(null)}
                    className="px-6 py-2.5 rounded-full btn-primary-orange text-xs font-bold uppercase"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Victoria Sterling"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="victoria@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Occasion Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as EventInquiry['eventType'])}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      >
                        <option>Corporate Gala</option>
                        <option>Wedding Reception</option>
                        <option>Birthday Celebration</option>
                        <option>VIP Wine Tasting</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Event Details & Custom Menu Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. A/V projector required for keynote speech, 3 guests vegetarian, floral arrangements..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>SUBMIT PRIVATE DINING REQUEST</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
