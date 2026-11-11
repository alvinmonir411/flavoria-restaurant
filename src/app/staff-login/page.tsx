'use client';

import React from 'react';
import StaffAuthGuard from '@/components/auth/StaffAuthGuard';
import Link from 'next/link';
import { LayoutDashboard, ChefHat, Truck } from 'lucide-react';

export default function StaffLoginPage() {
  return (
    <StaffAuthGuard
      portalName="Admin & Manager Access"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="min-h-screen bg-[#FAF8F5] p-6 sm:p-12 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">
            Staff Authentication Verified
          </h1>
          <p className="text-sm text-stone-600 mb-8 font-light">
            You are securely logged into the Flavoria Operational Management System. Select your destination below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link
              href="/management"
              className="p-5 rounded-2xl bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-300 flex flex-col items-center justify-center gap-2 group transition-all"
            >
              <LayoutDashboard className="w-6 h-6 text-[#ea580c]" />
              <span className="font-bold text-xs text-stone-900 group-hover:text-[#ea580c]">Admin Ops</span>
              <span className="text-[10px] text-stone-500">15 Modules</span>
            </Link>

            <Link
              href="/kitchen"
              className="p-5 rounded-2xl bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-300 flex flex-col items-center justify-center gap-2 group transition-all"
            >
              <ChefHat className="w-6 h-6 text-[#ea580c]" />
              <span className="font-bold text-xs text-stone-900 group-hover:text-[#ea580c]">Kitchen KDS</span>
              <span className="text-[10px] text-stone-500">Prep Station</span>
            </Link>

            <Link
              href="/driver"
              className="p-5 rounded-2xl bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-300 flex flex-col items-center justify-center gap-2 group transition-all"
            >
              <Truck className="w-6 h-6 text-[#ea580c]" />
              <span className="font-bold text-xs text-stone-900 group-hover:text-[#ea580c]">Driver Portal</span>
              <span className="text-[10px] text-stone-500">Cash & Delivery</span>
            </Link>
          </div>

          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-[#ea580c] font-bold uppercase tracking-wider"
          >
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </StaffAuthGuard>
  );
}
