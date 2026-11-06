'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Users, 
  Truck, 
  CreditCard, 
  Tag, 
  Headphones, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';
import { Reservation } from '@/types';

export default function ReservationSection() {
  const [today, setToday] = useState('2026-11-05');
  const [date, setDate] = useState('2026-11-05');
  const [timeSlot, setTimeSlot] = useState('19:00');
  const [guests, setGuests] = useState('2');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const current = new Date().toISOString().split('T')[0];
    setToday(current);
    setDate(current);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName || 'Walk-in Guest',
          email: 'guest@flavoria.com',
          phone: phone || '+1 234 567 8900',
          guests: Number(guests),
          date,
          timeSlot,
          area: 'Main Dining Room',
          specialRequests: 'Booked via Quick Table Widget'
        })
      });

      const data = await res.json();
      if (res.ok && data.reservation) {
        setConfirmedReservation(data.reservation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservation" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid: Special Offer Banner (Left) + Beverage Image (Center) + Book Your Table (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-20">
          
          {/* Left: Dark Green Special Offer Banner matching reference */}
          <div className="lg:col-span-5 rounded-3xl bg-[#1a4231] p-8 sm:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[340px]">
            {/* Background Artisan Pizza Image */}
            <div 
              className="absolute -right-10 -bottom-10 w-64 h-64 bg-cover bg-center rounded-full opacity-40 sm:opacity-70 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80')`
              }}
            />

            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fcd34d] block mb-2">
                SPECIAL OFFER
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-3">
                Get 20% Off <br />
                On Your First Order
              </h3>
              <p className="text-xs text-emerald-100 max-w-xs font-light">
                Sign up for our newsletter or book your table today to unlock our exclusive seasonal welcome treat.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-[#1a4231] text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                <span>ORDER NOW</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1a4231]" />
              </Link>
            </div>
          </div>

          {/* Center: Refreshing Beverage Card matching reference */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden shadow-xl min-h-[340px] relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
              alt="Refreshing Signature Beverage"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Right: "Book Your Table" Form Card matching reference */}
          <div className="lg:col-span-4 rounded-3xl bg-white p-7 sm:p-8 border border-stone-200 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#18181b] mb-1">
                Book Your Table
              </h3>
              <p className="text-xs text-stone-500 mb-6 font-light">
                Reserve your favorite spot instantly with confirmation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Select Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Select Time
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#ea580c]"
                    >
                      {['12:00 PM', '01:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'].map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Number of People */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Number of People
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#ea580c]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Guest Name / Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                {/* Orange FIND A TABLE Button matching reference */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>FIND A TABLE</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/reservation"
                    className="text-[11px] font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Need specific seating or large group? Go to Full Reservation Page</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* Value Proposition Bar matching reference image bottom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-stone-200/80">
          {/* Prop 1 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900 leading-tight">
                Free Delivery
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                On orders over $30
              </p>
            </div>
          </div>

          {/* Prop 2 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900 leading-tight">
                Easy Payment
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                100% secure payment
              </p>
            </div>
          </div>

          {/* Prop 3 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900 leading-tight">
                Best Offers
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Get best deals
              </p>
            </div>
          </div>

          {/* Prop 4 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900 leading-tight">
                Support 24/7
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                We are always here
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-stone-200 shadow-2xl text-center">
            <button
              onClick={() => setConfirmedReservation(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-4 text-[#ea580c]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
              Table Reserved!
            </h3>

            <p className="text-xs text-stone-500 mb-6">
              Your table booking code is <strong className="text-[#ea580c] font-mono text-sm">{confirmedReservation.code}</strong>.
            </p>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Time:</span>
                <span className="font-bold text-stone-800">{confirmedReservation.date} at {confirmedReservation.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Party Size:</span>
                <span className="font-bold text-stone-800">{confirmedReservation.guests} Guests</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedReservation(null)}
              className="w-full py-3 rounded-full btn-primary-orange text-xs uppercase font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
