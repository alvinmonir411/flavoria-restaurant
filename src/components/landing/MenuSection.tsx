'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MenuItem } from '@/types';

const POPULAR_DISHES: MenuItem[] = [
  {
    id: 'pop-1',
    name: 'Creamy Alfredo Pasta',
    category: 'Mains',
    description: 'Rich and creamy white sauce with mushrooms and fresh garden herbs.',
    price: 14.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ['Vegetarian', 'Italian'],
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pop-2',
    name: 'Grilled Ribeye Steak',
    category: 'Mains',
    description: 'Juicy grilled prime steak served with seasonal roasted vegetables.',
    price: 24.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ['GF', 'Chef Special'],
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pop-3',
    name: 'Quinoa & Avocado Salad',
    category: 'Starters & Caviar',
    description: 'Healthy organic quinoa, ripe avocado, cherry tomatoes and citrus greens.',
    price: 12.99,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Vegan', 'GF'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pop-4',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Warm dark chocolate cake with a rich gooey center and seasonal berries.',
    price: 8.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ['Vegetarian', 'Dessert'],
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export default function MenuSection() {
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
        
        {/* Header matching reference: "— Our Popular Dishes —" */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center sm:text-left">
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
            className="text-xs font-bold uppercase tracking-wider text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1.5 transition-colors"
          >
            <span>VIEW FULL MENU</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Cards Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DISHES.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Image Frame with circular plate feeling */}
              <div className="relative h-52 w-full overflow-hidden bg-stone-50 p-3">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Dish Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors mb-1.5">
                    {dish.name}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4 font-light">
                    {dish.description}
                  </p>
                </div>

                {/* Price & Green Circle Plus Button matching reference */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-bold text-[#ea580c] text-lg">
                    ${dish.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleAdd(dish)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      addedId === dish.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1a4231] hover:bg-[#122b20] text-white shadow-sm'
                    }`}
                    title="Add to table order"
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
