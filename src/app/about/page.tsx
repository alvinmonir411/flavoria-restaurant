'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { 
  Leaf, 
  ChefHat, 
  Heart, 
  Award, 
  Sparkles, 
  Clock, 
  ArrowRight,
  UtensilsCrossed,
  Users
} from 'lucide-react';

const TEAM = [
  {
    name: 'Marco Rossi',
    role: 'Executive Chef & Founder',
    bio: 'Over 18 years mastering Mediterranean and contemporary cuisine across Rome and Paris.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Elena Rostova',
    role: 'Master Pastry Chef',
    bio: 'Crafts our beloved chocolate lava cakes and delicate artisanal desserts with pure Swiss cocoa.',
    image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'David Chen',
    role: 'Head Grill & Meat Specialist',
    bio: 'Specialist in prime aged steaks and binchotan wood grilling for the past 12 years.',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Sophia Laurent',
    role: 'Head Sommelier',
    bio: 'Curates our award-winning cellar of 350+ sustainable wines and crafted mocktails.',
    image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80'
  }
];

const GALLERY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    title: 'Main Dining Ambience'
  },
  {
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    title: 'Open Kitchen Artistry'
  },
  {
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    title: 'Botanical Garden Terrace'
  },
  {
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    title: 'Fresh Plating Passion'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#ea580c]">Home</Link>
            <span>/</span>
            <span className="text-[#ea580c] font-bold">About Us</span>
          </nav>

          {/* Hero Story Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-2">
                OUR STORY & HERITAGE
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#18181b] tracking-tight leading-[1.15] mb-6">
                Good Food, <br />
                Crafted with <span className="font-serif italic font-normal text-[#ea580c]">Heart</span>
              </h1>
              <p className="text-stone-600 text-sm leading-relaxed mb-6 font-light">
                Flavoria began in 2014 with a singular mission: to create a dining haven where food celebrates warmth, flavor, and human connection. We believe that great meals don’t just satisfy hunger—they build memories.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed mb-8 font-light">
                From our farm-sourced organic greens to our artisanal slow-cooked sauces and prime grilled steaks, every ingredient is treated with respect and culinary enthusiasm.
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href="/menu"
                  className="px-7 py-3 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Explore Our Menu
                </Link>
                <Link
                  href="/reservation"
                  className="px-7 py-3 rounded-full btn-outline-orange text-xs font-bold uppercase tracking-wider"
                >
                  Book a Table
                </Link>
              </div>
            </div>

            {/* Visual with 10+ badge */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-96 sm:h-[460px]">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                  alt="Flavoria Culinary Team in Kitchen"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 sm:left-6 bg-[#ea580c] text-white p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center w-32">
                <span className="font-serif text-3xl font-bold leading-none">10+</span>
                <span className="text-[11px] font-bold uppercase tracking-tight mt-1 leading-tight">
                  Years of <br /> Culinary Craft
                </span>
              </div>
            </div>
          </div>

          {/* Our Core Values / Pillars */}
          <div className="mb-24">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-1">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181b]">
                What Defines Flavoria
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] mx-auto mb-5">
                  <Leaf className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  Farm-to-Table Fresh
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-light">
                  We partner directly with organic family farms for crisp produce, heirloom herbs, and free-range dairy delivered fresh daily.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] mx-auto mb-5">
                  <ChefHat className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  Passionate Artistry
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-light">
                  Every sauce is simmered in-house from scratch. Every steak is precision grilled over aromatic binchotan charcoal coals.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c] mx-auto mb-5">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  Genuine Warmth
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-light">
                  From the moment you step through our doors, our concierge and waitstaff treat every diner like cherished family.
                </p>
              </div>
            </div>
          </div>

          {/* Master Culinary Team */}
          <div className="mb-24">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-1">
                MEET THE CHEFS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181b]">
                The Culinary Masters Behind Flavoria
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="h-64 overflow-hidden bg-stone-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      {member.name}
                    </h4>
                    <span className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider block mb-2">
                      {member.role}
                    </span>
                    <p className="text-stone-500 text-xs leading-relaxed font-light">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Ambience Gallery */}
          <div className="mb-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-1">
                OUR SPACE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181b]">
                Experience The Atmosphere
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GALLERY_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden h-64 group shadow-md"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold tracking-wide">
                      {img.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Table Booking CTA */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#1a4231] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-[#fcd34d] font-bold block mb-1">
                COME DINE WITH US
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                Ready to Taste the Flavoria Difference?
              </h3>
              <p className="text-xs text-emerald-100">
                Book your table today or drop by during lunch or dinner service.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/reservation"
                className="px-7 py-3.5 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md"
              >
                BOOK A TABLE
              </Link>
              <Link
                href="/menu"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20"
              >
                VIEW MENU
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
