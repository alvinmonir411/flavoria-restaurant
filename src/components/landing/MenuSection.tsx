'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MenuItem } from '@/types';

interface MenuSectionProps {
  dishes: MenuItem[];
}

export default function MenuSection({ dishes }: MenuSectionProps) {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c] block mb-1">
              CHEF&apos;S SPECIAL
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181b] flex items-center justify-center sm:justify-start gap-3">
              <span className="text-stone-300 font-light">—</span>
              <span>Our Popular Dishes</span>
              <span className="text-stone-300 font-light">—</span>
            </h2>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] hover:text-[#c2410c] transition-colors self-center sm:self-auto"
          >
            <span>VIEW FULL MENU</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {dish.isSignature && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold uppercase tracking-wider text-[#ea580c] shadow-xs">
                    Signature
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-1.5 group-hover:text-[#ea580c] transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4 font-light">
                    {dish.description}
                  </p>
                </div>

                {/* Price & Green Circle Plus Button */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-bold text-[#ea580c] text-lg">
                    ${dish.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleAdd(dish)}
                    aria-label={`Add ${dish.name} to cart`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      addedId === dish.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1a4231] hover:bg-[#122b20] text-white shadow-sm'
                    }`}
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
      </div>
    </section>
  );
}
