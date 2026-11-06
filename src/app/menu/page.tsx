'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useCart } from '@/context/CartContext';
import { MenuItem } from '@/types';
import { INITIAL_MENU_ITEMS } from '@/lib/seed-data';
import { 
  Search, 
  Plus, 
  Check, 
  Star, 
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Cake,
  GlassWater,
  Flame,
  ArrowRight 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Desserts',
  'Drinks',
  "Chef's Special"
] as const;

type CategoryType = typeof CATEGORIES[number];

function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'Breakfast':
      return <Coffee className="w-3.5 h-3.5" />;
    case 'Lunch':
      return <Sun className="w-3.5 h-3.5" />;
    case 'Dinner':
      return <Moon className="w-3.5 h-3.5" />;
    case 'Desserts':
      return <Cake className="w-3.5 h-3.5" />;
    case 'Drinks':
      return <GlassWater className="w-3.5 h-3.5" />;
    case "Chef's Special":
      return <Flame className="w-3.5 h-3.5" />;
    default:
      return <Sparkles className="w-3.5 h-3.5" />;
  }
}

function MenuList() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Sync with URL query parameter ?category=Breakfast / Lunch etc.
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === catParam.toLowerCase() ||
               (catParam.toLowerCase().includes('special') && c === "Chef's Special")
      );
      if (match) {
        setActiveCategory(match);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setItems(data.items);
          }
        }
      } catch (e) {
        console.warn('API menu fallback:', e);
      }
    }
    loadMenu();
  }, []);

  const handleAdd = (dish: MenuItem) => {
    addToCart(dish, 1);
    setAddedId(dish.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filteredItems = items.filter((dish) => {
    let matchCat = false;
    if (activeCategory === 'All') {
      matchCat = true;
    } else if (activeCategory === "Chef's Special") {
      matchCat = 
        dish.category === "Chef's Special" || 
        dish.isSignature === true || 
        dish.dietaryTags.some(t => 
          t.toLowerCase().includes('chef') || 
          t.toLowerCase().includes('special') || 
          t.toLowerCase().includes('signature')
        );
    } else if (activeCategory === 'Drinks') {
      matchCat = dish.category === 'Drinks' || dish.category === 'Fine Wines & Cocktails';
    } else {
      matchCat = dish.category.toLowerCase() === activeCategory.toLowerCase();
    }

    const q = searchQuery.toLowerCase();
    const matchSearch = 
      !q ||
      dish.name.toLowerCase().includes(q) ||
      dish.description.toLowerCase().includes(q) ||
      dish.dietaryTags.some(t => t.toLowerCase().includes(q));

    return matchCat && matchSearch;
  });

  const getCount = (cat: string) => {
    if (cat === 'All') return items.length;
    if (cat === "Chef's Special") {
      return items.filter(
        i => i.category === "Chef's Special" || 
             i.isSignature || 
             i.dietaryTags.some(t => t.toLowerCase().includes('chef') || t.toLowerCase().includes('special'))
      ).length;
    }
    if (cat === 'Drinks') {
      return items.filter(i => i.category === 'Drinks' || i.category === 'Fine Wines & Cocktails').length;
    }
    return items.filter(i => i.category.toLowerCase() === cat.toLowerCase()).length;
  };

  return (
    <div>
      {/* Category Filter Pills Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm mb-10 space-y-4">
        
        {/* Top: Search Input & Current Filter Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by dish name, ingredient, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#ea580c] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-900 font-bold">{filteredItems.length}</strong> {activeCategory === 'All' ? 'Total Dishes' : `${activeCategory} Items`}
          </div>
        </div>

        {/* Bottom: Filter Badges matching requested: Breakfast, Lunch, Dinner, Desserts, Drinks, Chef's Special */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs pt-1">
          {CATEGORIES.map((cat) => {
            const count = getCount(cat);
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/90 hover:border-orange-200'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#ea580c]'}>
                  {getCategoryIcon(cat)}
                </span>
                <span>{cat === 'All' ? 'All Dishes' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-stone-200/80 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-xs p-8">
          <p className="font-serif text-xl text-stone-800 mb-2">No dishes match your selection.</p>
          <p className="text-xs text-stone-500 mb-6 font-light">
            Try resetting your search query or picking a different category filter above.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="px-6 py-2.5 rounded-full btn-outline-orange text-xs font-bold uppercase tracking-wider"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredItems.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className="relative h-52 w-full overflow-hidden bg-stone-100 p-3">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Category Pill on Image */}
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-stone-800 border border-stone-200 shadow-xs">
                  {dish.category}
                </div>

                {/* Chef Special Badge */}
                {(dish.isSignature || dish.dietaryTags.some(t => t.toLowerCase().includes('special') || t.toLowerCase().includes('chef'))) && (
                  <div className="absolute top-5 left-5 px-2.5 py-1 rounded-full bg-[#ea580c] text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Chef&apos;s Special</span>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors mb-1.5 leading-snug">
                    {dish.name}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-3 font-light">
                    {dish.description}
                  </p>

                  {/* Dietary Tags */}
                  {dish.dietaryTags && dish.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dish.dietaryTags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Green Plus Button */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-bold text-[#ea580c] text-xl">
                    ${dish.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleAdd(dish)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      addedId === dish.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1a4231] hover:bg-[#122b20] text-white shadow-sm'
                    }`}
                    title="Add to table tasting order"
                  >
                    {addedId === dish.id ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Table Booking CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#1a4231] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="max-w-xl text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-[#fcd34d] font-bold block mb-1">
            JOIN US AT FLAVORIA
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
            Want to enjoy these freshly made at your table?
          </h3>
          <p className="text-xs text-emerald-100">
            Book your table online in seconds with instant seat selection and booking confirmation.
          </p>
        </div>

        <Link
          href="/reservation"
          className="px-8 py-3.5 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md shrink-0"
        >
          BOOK A TABLE NOW
        </Link>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#ea580c]">Home</Link>
            <span>/</span>
            <span className="text-[#ea580c] font-bold">Our Menu</span>
          </nav>

          {/* Page Banner */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-2">
              DISCOVER OUR MENU
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#18181b] tracking-tight mb-4">
              Delicious Food For Every Taste
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Filter through Breakfast, Lunch, Dinner, Desserts, Drinks, or Chef&apos;s Special creations—all handcrafted with farm-fresh organic ingredients.
            </p>
          </div>

          <Suspense fallback={
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-stone-500 font-medium">Loading delicious dishes...</p>
            </div>
          }>
            <MenuList />
          </Suspense>

        </div>
      </main>

      <Footer />
    </div>
  );
}
