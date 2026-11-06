'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Calendar, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

const FAQS = [
  {
    q: 'Do you cater to dietary restrictions and allergies?',
    a: 'Yes, absolutely. Our kitchen accommodates vegetarian, vegan, gluten-free, nut-free, and halal diets. Please notify your server or specify in your reservation notes.'
  },
  {
    q: 'Can I host a private event or corporate celebration?',
    a: 'Our Private Lounge accommodates up to 40 guests for seated dinners or cocktails. Contact our events coordinator via the form below or call directly.'
  },
  {
    q: 'Is there parking available on site?',
    a: 'Flavoria offers complimentary valet parking directly at 123 Food Street every day starting at 5:00 PM. Street parking is also plentiful.'
  },
  {
    q: 'Do I need a reservation for lunch?',
    a: 'While walk-ins are always welcomed for lunch and terrace drinks, we recommend reserving your table to guarantee immediate seating.'
  }
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 700);
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
            <span className="text-[#ea580c] font-bold">Contact Us</span>
          </nav>

          {/* Heading Banner */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-2">
              GET IN TOUCH
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#18181b] tracking-tight mb-4">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Have a question about our menu, private event booking, or catering? Reach out directly and our concierge team will respond promptly.
            </p>
          </div>

          {/* Top 4 Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            {/* Address */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-1">Our Location</h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                123 Food Street, <br /> Flavor Town, FT 56789
              </p>
            </div>

            {/* Phone */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-1">Direct Phone</h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                <a href="tel:+12345678900" className="hover:text-[#ea580c] font-medium">+1 234 567 8900</a> <br />
                Table & Event Bookings
              </p>
            </div>

            {/* Email */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-1">Email Inquiries</h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                <a href="mailto:info@flavoria.com" className="hover:text-[#ea580c] font-medium">info@flavoria.com</a> <br />
                events@flavoria.com
              </p>
            </div>

            {/* Opening Hours */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-1">Service Hours</h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Mon - Sun: 10:00 AM - 11:00 PM <br />
                Kitchen closes at 10:30 PM
              </p>
            </div>

          </div>

          {/* Form & Direct Reservation Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
            
            {/* Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-stone-500 font-light mb-6">
                Fill out the form below and we will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-emerald-900 mb-1">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 mb-4">
                    Thank you for reaching out. A Flavoria host will review your message shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-full btn-primary-orange text-xs font-bold uppercase"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                    >
                      <option>General Inquiry</option>
                      <option>Private Events & Catering</option>
                      <option>Chef Collaboration & Media</option>
                      <option>Dining Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your note, question or event details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>SEND INQUIRY</span>
                        <Send className="w-3.5 h-3.5 text-white" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Reservation Card & Map preview (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Quick Book Promo Box */}
              <div className="rounded-3xl bg-[#1a4231] text-white p-8 shadow-xl relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-[#fcd34d] block mb-2">
                  PLANNING DINNER TONIGHT?
                </span>
                <h3 className="font-serif text-2xl font-bold mb-3">
                  Instant Table Reservation
                </h3>
                <p className="text-xs text-emerald-100 font-light mb-6 leading-relaxed">
                  Skip the line and guarantee your table in our Main Dining Room or Garden Terrace with instant booking voucher.
                </p>

                <Link
                  href="/reservation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>BOOK A TABLE ONLINE</span>
                </Link>
              </div>

              {/* Map Location Card */}
              <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-3">
                  Find Us in Flavor Town
                </h4>
                <div className="relative rounded-2xl overflow-hidden h-48 bg-stone-100 mb-4 border border-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                    alt="Map Location Ambience"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-center shadow-lg border border-orange-200">
                      <span className="font-serif font-bold text-xs text-[#ea580c] block">Flavoria Restaurant</span>
                      <span className="text-[10px] text-stone-600">123 Food Street, Downtown</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-500 font-light leading-relaxed">
                  Located right in the culinary heart of Flavor Town. Accessible by transit with reserved customer valet parking at the front entrance.
                </div>
              </div>

            </div>

          </div>

          {/* Frequently Asked Questions */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-1">
                QUESTIONS & ANSWERS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181b]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs"
                >
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 mb-1 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-stone-500 font-light leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
