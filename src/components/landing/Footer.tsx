'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UtensilsCrossed, LayoutDashboard } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#FFFFFF] border-t border-stone-200 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1: Brand Info matching reference */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ea580c]">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-[#18181b]">
                  Flavoria
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#ea580c] uppercase font-bold">
                  — RESTAURANT —
                </span>
              </div>
            </Link>

            <p className="text-stone-500 leading-relaxed mb-4 text-xs font-light">
              Good food, good mood! Visit us and enjoy an unforgettable dining experience.
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-3 text-stone-600 text-xs">
              <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center hover:bg-orange-50 hover:text-[#ea580c] cursor-pointer">f</span>
              <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center hover:bg-orange-50 hover:text-[#ea580c] cursor-pointer">📷</span>
              <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center hover:bg-orange-50 hover:text-[#ea580c] cursor-pointer">🐦</span>
              <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center hover:bg-orange-50 hover:text-[#ea580c] cursor-pointer">📌</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col space-y-2">
            <h4 className="font-serif font-bold text-stone-900 uppercase tracking-wider text-xs mb-1">
              QUICK LINKS
            </h4>
            <Link href="/about" className="hover:text-[#ea580c] transition-colors">About Us</Link>
            <Link href="/menu" className="hover:text-[#ea580c] transition-colors">Menu</Link>
            <Link href="/reservation" className="hover:text-[#ea580c] transition-colors">Reservation</Link>
            <Link href="/about" className="hover:text-[#ea580c] transition-colors">Gallery</Link>
            <Link href="/contact" className="hover:text-[#ea580c] transition-colors">Contact Us</Link>
          </div>

          {/* Col 3: Our Menu */}
          <div className="flex flex-col space-y-2">
            <h4 className="font-serif font-bold text-stone-900 uppercase tracking-wider text-xs mb-1">
              OUR MENU
            </h4>
            <Link href="/menu?category=Breakfast" className="hover:text-[#ea580c] transition-colors">Breakfast</Link>
            <Link href="/menu?category=Lunch" className="hover:text-[#ea580c] transition-colors">Lunch</Link>
            <Link href="/menu?category=Dinner" className="hover:text-[#ea580c] transition-colors">Dinner</Link>
            <Link href="/menu?category=Desserts" className="hover:text-[#ea580c] transition-colors">Desserts</Link>
            <Link href="/menu?category=Drinks" className="hover:text-[#ea580c] transition-colors">Drinks</Link>
            <Link href="/menu?category=Chef's Special" className="hover:text-[#ea580c] transition-colors">Chef&apos;s Special</Link>
          </div>

          {/* Col 4: Contact Info */}
          <div className="flex flex-col space-y-2">
            <h4 className="font-serif font-bold text-stone-900 uppercase tracking-wider text-xs mb-1">
              CONTACT INFO
            </h4>
            <span className="text-stone-600">📍 Road 71, Block NW(B), Gulshan-2, Dhaka-1212</span>
            <span className="text-stone-600">📞 +880 1711-223344</span>
            <span className="text-stone-600">✉️ info@flavoria.com.bd</span>
          </div>

          {/* Col 5: Newsletter */}
          <div className="flex flex-col space-y-2">
            <h4 className="font-serif font-bold text-stone-900 uppercase tracking-wider text-xs mb-1">
              NEWSLETTER
            </h4>
            <p className="text-stone-500 text-xs mb-2">
              Subscribe to get the latest updates and offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs flex-1 focus:outline-none focus:border-[#ea580c]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl btn-primary-orange text-white font-bold text-xs shrink-0"
              >
                {subscribed ? 'Joined!' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Flavoria Restaurant. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#ea580c]">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#ea580c]">Terms & Conditions</a>
            <span>•</span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ea580c] font-bold hover:bg-orange-100 transition-colors"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Dashboard Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
