'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useCurrency } from '@/context/CurrencyContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Utensils, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  Download,
  Wine,
  Cake,
  GlassWater,
  Grid
} from 'lucide-react';
import { Reservation, DiningTable } from '@/types';
import { INITIAL_TABLES } from '@/lib/seed-data';

const TIME_SLOTS = {
  lunch: ['11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM'],
  dinner: ['05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM']
};

const SEATING_AREAS = [
  {
    id: 'Main Dining Room',
    name: 'Main Dining Room',
    desc: 'Warm terracotta ambience, elegant chandeliers and plush banquettes',
    badge: 'Popular'
  },
  {
    id: 'Garden Terrace',
    name: 'Garden Terrace',
    desc: 'Lush botanical al fresco dining with heated canopy & fairy lights',
    badge: 'Romantic'
  },
  {
    id: "Chef's Counter",
    name: "Chef's Counter",
    desc: 'Front-row view of the live kitchen craft and signature plate finishing',
    badge: 'Chef Experience'
  },
  {
    id: 'Private Lounge',
    name: 'Private Lounge',
    desc: 'Dedicated private dining suite for family or corporate celebrations',
    badge: 'VIP'
  }
];

export default function ReservationPage() {
  const { formatPrice } = useCurrency();
  const [todayStr, setTodayStr] = useState('2026-11-05');
  const [date, setDate] = useState('2026-11-05');
  const [timeSlot, setTimeSlot] = useState('07:00 PM');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState('Main Dining Room');
  const [selectedTableId, setSelectedTableId] = useState<string>('tbl-2');
  const [viewMode, setViewMode] = useState<'plan' | 'list'>('plan');
  const [occasion, setOccasion] = useState('Casual Dining');
  
  // Experience Add-ons
  const [addChampagne, setAddChampagne] = useState(false);
  const [addCake, setAddCake] = useState(false);
  const [addWineFlight, setAddWineFlight] = useState(false);

  // Guest details
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const current = new Date().toISOString().split('T')[0];
    setTodayStr(current);
    setDate(current);
  }, []);

  const handleQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name and contact phone number.');
      return;
    }

    setLoading(true);

    const addOnsList = [
      addChampagne ? 'Chilled Champagne on Arrival (+$75)' : '',
      addCake ? 'Celebration Cake (+$35)' : '',
      addWineFlight ? `Sommelier Wine Flight for ${guests} guests` : ''
    ].filter(Boolean).join(', ');

    const combinedNotes = [
      occasion !== 'Casual Dining' ? `[Occasion: ${occasion}]` : '',
      addOnsList ? `[Add-ons: ${addOnsList}]` : '',
      specialRequests
    ].filter(Boolean).join(' ').trim();

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          email: email.trim() || 'guest@flavoria.com',
          phone,
          guests: Number(guests),
          date,
          timeSlot,
          area,
          specialRequests: combinedNotes
        })
      });

      const data = await res.json();
      if (res.ok && data.reservation) {
        setConfirmedReservation(data.reservation);
      } else {
        setErrorMsg(data.error || 'Failed to confirm reservation. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again or call our host directly.');
    } finally {
      setLoading(false);
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
            <span className="text-[#ea580c] font-bold">Book a Table</span>
          </nav>

          {/* Heading Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-2">
              WORLD-CLASS SEATING SELECTION
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#18181b] tracking-tight mb-4">
              Book Your Table at Flavoria
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Choose your exact table on our interactive 2D floor plan, customize celebration add-ons, and enjoy immediate confirmation backed by our live Neon cloud database.
            </p>
          </div>

          {confirmedReservation ? (
            /* Confirmation Voucher Card */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-2xl p-8 sm:p-12 text-center animate-fade-in print:shadow-none print:border-none">
              <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center mx-auto mb-6 text-[#ea580c]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-[#ea580c]">
                RESERVATION CONFIRMED
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1 mb-2">
                We Can&apos;t Wait to Host You!
              </h2>
              <p className="text-xs text-stone-500 mb-8 font-light">
                Recorded live in Flavoria Host Stand system. Present this pass upon arrival.
              </p>

              {/* Booking Reference Ticket */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-orange-200/80 text-left space-y-4 mb-8 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Booking Reference</span>
                    <span className="font-mono text-xl font-bold text-[#ea580c]">
                      {confirmedReservation.code}
                    </span>
                  </div>
                  <div className="w-14 h-14 bg-white border border-stone-200 rounded-xl p-1 flex items-center justify-center text-center">
                    <span className="text-[9px] font-mono font-bold text-stone-600 leading-tight">
                      [QR-PASS]<br />FLV-VIP
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 block mb-0.5">Guest Name</span>
                    <span className="font-bold text-stone-800">{confirmedReservation.guestName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-0.5">Contact</span>
                    <span className="font-bold text-stone-800">{confirmedReservation.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-0.5">Date & Time</span>
                    <span className="font-bold text-stone-800">{confirmedReservation.date} at {confirmedReservation.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-0.5">Party Size & Area</span>
                    <span className="font-bold text-stone-800">{confirmedReservation.guests} Guests ({confirmedReservation.area})</span>
                  </div>
                </div>

                {confirmedReservation.specialRequests && (
                  <div className="pt-2 border-t border-stone-200 text-xs">
                    <span className="text-stone-400 block mb-0.5">Requests & Add-ons:</span>
                    <p className="text-stone-700 italic">{confirmedReservation.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>
                <button
                  onClick={() => {
                    setConfirmedReservation(null);
                    setGuestName('');
                    setPhone('');
                    setSpecialRequests('');
                  }}
                  className="px-6 py-3 rounded-full btn-outline-orange text-xs font-bold uppercase tracking-wider"
                >
                  Book Another Table
                </button>
                <Link
                  href="/order"
                  className="px-6 py-3 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Pre-Order Dishes
                </Link>
              </div>
            </div>
          ) : (
            /* Reservation Booking Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Column (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: Party Size */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-[#ea580c]" />
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        1. Select Party Size
                      </label>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                            guests === num
                              ? 'bg-[#ea580c] text-white shadow-md'
                              : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-orange-300'
                          }`}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Date Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#ea580c]" />
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          2. Select Date
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleQuickDate(0)}
                          className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-[#ea580c] font-medium"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDate(1)}
                          className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-[#ea580c] font-medium"
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>

                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  {/* Step 3: Service Time */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-[#ea580c]" />
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        3. Choose Service Time
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                          Lunch Service
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {TIME_SLOTS.lunch.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                                timeSlot === slot
                                  ? 'bg-[#1a4231] text-white shadow-sm'
                                  : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-emerald-300'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                          Dinner Service
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {TIME_SLOTS.dinner.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                                timeSlot === slot
                                  ? 'bg-[#ea580c] text-white shadow-md'
                                  : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-orange-300'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Interactive 2D Visual Floor Plan */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        4. Interactive Seating & Table Map
                      </label>
                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setViewMode('plan')}
                          className={`px-2.5 py-1 rounded-lg font-bold ${
                            viewMode === 'plan' ? 'bg-[#ea580c] text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          2D Floor Map
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('list')}
                          className={`px-2.5 py-1 rounded-lg font-bold ${
                            viewMode === 'list' ? 'bg-[#ea580c] text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          Area Cards
                        </button>
                      </div>
                    </div>

                    {viewMode === 'plan' ? (
                      /* 2D Visual Floor Plan Canvas */
                      <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-4">
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pb-2 border-b border-stone-200">
                          <span className="font-semibold text-stone-700">Click any table below to select your spot:</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" /> Selected</span>
                          </div>
                        </div>

                        {/* Interactive Tables Layout */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {INITIAL_TABLES.map(table => {
                            const isSelected = selectedTableId === table.id;
                            return (
                              <div
                                key={table.id}
                                onClick={() => {
                                  setSelectedTableId(table.id);
                                  setArea(table.area);
                                }}
                                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-[#ea580c] bg-orange-50 shadow-md ring-2 ring-[#ea580c]'
                                    : 'border-stone-200 bg-white hover:border-orange-300'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono font-bold text-xs text-stone-900">{table.tableNumber}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
                                    {table.capacity}p
                                  </span>
                                </div>
                                <h5 className="font-bold text-[11px] text-stone-800 line-clamp-1">{table.name}</h5>
                                <span className="text-[10px] text-stone-500 block mt-0.5">{table.area}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* Area List Cards */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SEATING_AREAS.map((a) => (
                          <div
                            key={a.id}
                            onClick={() => setArea(a.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              area === a.id
                                ? 'border-[#ea580c] bg-orange-50/40 shadow-xs ring-1 ring-[#ea580c]'
                                : 'border-stone-200 bg-white hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-xs text-stone-900">{a.name}</h4>
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c]">
                                {a.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 font-light leading-snug">
                              {a.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                    {/* Step 5: Celebration Add-Ons Suite (Halal / Bangladesh Compliant) */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-3">
                        5. Celebration & Dining Add-Ons (Optional)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div
                          onClick={() => setAddChampagne(!addChampagne)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            addChampagne ? 'border-[#ea580c] bg-orange-50/60' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <Wine className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-xs text-stone-900">Sparkling Royal Mocktail</strong>
                            <span className="text-[10px] text-stone-500 block">Artisanal berry & elderflower fizz</span>
                            <span className="text-xs font-bold text-[#ea580c] mt-1 block">+{formatPrice(4.00)}</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setAddCake(!addCake)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            addCake ? 'border-[#ea580c] bg-orange-50/60' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <Cake className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-xs text-stone-900">Custom Celebration Cake</strong>
                            <span className="text-[10px] text-stone-500 block">With custom icing & sparkler</span>
                            <span className="text-xs font-bold text-[#ea580c] mt-1 block">+{formatPrice(10.00)}</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setAddWineFlight(!addWineFlight)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            addWineFlight ? 'border-[#ea580c] bg-orange-50/60' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <Sparkles className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-xs text-stone-900">Curated Beverage Flight</strong>
                            <span className="text-[10px] text-stone-500 block">3-course craft mocktail pairing</span>
                            <span className="text-xs font-bold text-[#ea580c] mt-1 block">+{formatPrice(6.00)}/guest</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Step 6: Guest Contact & Notes */}
                  <div className="pt-4 border-t border-stone-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-3">
                      6. Guest Information
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sarah Jenkins"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 234 567 8900"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                          Email (For Voucher Receipt)
                        </label>
                        <input
                          type="email"
                          placeholder="sarah@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                          Occasion
                        </label>
                        <select
                          value={occasion}
                          onChange={(e) => setOccasion(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                        >
                          <option>Casual Dining</option>
                          <option>Birthday Celebration</option>
                          <option>Anniversary</option>
                          <option>Romantic Date</option>
                          <option>Business Dinner</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Dietary Notes & Seating Preferences
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Window alcove requested, dairy allergy, high chair needed..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>CONFIRM TABLE RESERVATION</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Sidebar Info & Trust Badges (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Live Reservation Summary Card */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                    Booking Snapshot
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center text-stone-600">
                      <span>Guests:</span>
                      <span className="font-bold text-stone-900">{guests} People</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-600">
                      <span>Date:</span>
                      <span className="font-bold text-stone-900">{date}</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-600">
                      <span>Time:</span>
                      <span className="font-bold text-stone-900">{timeSlot}</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-600">
                      <span>Ambience Area:</span>
                      <span className="font-bold text-[#ea580c]">{area}</span>
                    </div>
                    {(addChampagne || addCake || addWineFlight) && (
                      <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                        <span className="font-bold text-stone-800 block mb-1">Add-Ons Selected:</span>
                        {addChampagne && <div className="text-emerald-700">✓ Chilled Champagne ({formatPrice(75)})</div>}
                        {addCake && <div className="text-emerald-700">✓ Celebration Cake ({formatPrice(35)})</div>}
                        {addWineFlight && <div className="text-emerald-700">✓ Sommelier Flight ({formatPrice(45 * guests)})</div>}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant Confirmation via Neon Cloud PostgreSQL</span>
                  </div>
                </div>

                {/* Restaurant Policies Card */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm text-xs space-y-4 text-stone-600">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Hospitality Standards
                  </h3>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-800 block">15-Min Holding Policy</strong>
                      Tables are held for 15 minutes past booking time before releasing to waitlist.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-800 block">Smart Casual Dress Code</strong>
                      Welcoming dining ambience suitable for romantic, business, or family occasions.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-800 block">VIP Concierge Line</strong>
                      For parties larger than 10, reach our event coordinator at <a href="tel:+12345678900" className="text-[#ea580c] font-bold">+1 234 567 8900</a>.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
