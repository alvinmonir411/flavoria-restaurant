'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, LanguageCode } from '@/context/LanguageContext';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { CurrencyCode } from '@/types';
import { 
  MapPin, 
  Clock, 
  Phone, 
  ShoppingBag, 
  LayoutDashboard, 
  Menu as MenuIcon, 
  X, 
  UtensilsCrossed,
  Globe,
  QrCode,
  Crown,
  CalendarCheck,
  Sun,
  Moon,
  BellRing,
  User,
  ShieldCheck,
  ChefHat,
  Truck,
  ClipboardList,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currentStaff, isAuthenticated: isStaffAuthenticated, logout: logoutStaff } = useStaffAuth();
  const { customer, isCustomerLoggedIn, logoutCustomer } = useCustomerAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callTable, setCallTable] = useState('T-02');
  const [callType, setCallType] = useState<'assistance' | 'bill' | 'water'>('assistance');
  const [callSent, setCallSent] = useState(false);

  // Dynamic Role & Icon Mapping (Strictly Admin and Manager for Staff)
  const getRoleInfo = (role?: string) => {
    switch (role) {
      case 'Admin':
        return {
          label: 'Admin',
          icon: Crown,
          href: '/management',
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200'
        };
      case 'Manager':
        return {
          label: 'Manager',
          icon: ClipboardList,
          href: '/management',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200'
        };
      default:
        return {
          label: 'Admin / Manager',
          icon: ShieldCheck,
          href: '/staff-login',
          color: 'text-[#ea580c]',
          bg: 'bg-orange-50',
          border: 'border-orange-200'
        };
    }
  };

  const activeRole = getRoleInfo(currentStaff?.role);
  const ActiveRoleIcon = activeRole.icon;

  // Active User session (Supports both Staff and Customer accounts)
  const activeUser = isStaffAuthenticated && currentStaff
    ? {
        name: currentStaff.name,
        email: currentStaff.email || 'staff@flavoria.com',
        badge: currentStaff.role,
        isStaff: true,
        icon: activeRole.icon,
        href: activeRole.href,
        themeBg: activeRole.bg,
        themeColor: activeRole.color,
        themeBorder: activeRole.border
      }
    : isCustomerLoggedIn && customer
    ? {
        name: customer.name,
        email: customer.email,
        badge: customer.vipTier || 'VIP Member',
        isStaff: false,
        icon: User,
        href: '/account',
        themeBg: 'bg-orange-50',
        themeColor: 'text-[#ea580c]',
        themeBorder: 'border-orange-200'
      }
    : null;

  const handleSendCall = async () => {
    try {
      await fetch('/api/table-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber: callTable, type: callType, notes: 'Initiated from Navbar service button' })
      });
      setCallSent(true);
      setTimeout(() => {
        setCallSent(false);
        setCallModalOpen(false);
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="w-full bg-white z-50 sticky top-0 shadow-xs">
      {/* Top Bar matching reference */}
      <div className="bg-[#FAF8F5] border-b border-stone-200/80 px-4 sm:px-8 py-1.5 text-xs text-stone-600 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Address */}
          <div className="flex items-center gap-1.5 text-stone-600">
            <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Road 71, Block NW(B), Gulshan-2, Dhaka-1212</span>
          </div>

          {/* Timings */}
          <div className="flex items-center gap-1.5 text-stone-600">
            <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Mon - Sun: 11:00 AM - 11:30 PM (BST)</span>
          </div>

          {/* Currency Switcher & Language & Theme & Phone */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[11px] font-bold text-stone-700">
              <Globe className="w-3 h-3 text-[#ea580c]" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-[11px] font-bold focus:outline-none cursor-pointer text-stone-800"
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[11px] font-bold text-stone-700">
              <span className="text-[11px]">🌐</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-[11px] font-bold focus:outline-none cursor-pointer text-stone-800"
              >
                <option value="en">English (US)</option>
                <option value="bn">বাংলা (BN)</option>
                <option value="fr">Français (FR)</option>
                <option value="es">Español (ES)</option>
              </select>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full bg-white border border-stone-200 hover:border-orange-400 text-stone-700 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-stone-700" />}
            </button>

            {/* Table Call Service Trigger */}
            <button
              onClick={() => setCallModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition-colors"
            >
              <BellRing className="w-3 h-3 text-amber-600 animate-bounce" />
              <span>{t('requestAssistance')}</span>
            </button>

            <a href="tel:+8801711223344" className="flex items-center gap-1.5 text-stone-700 hover:text-[#ea580c] font-semibold">
              <Phone className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>+880 1711-223344</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="px-4 sm:px-8 py-3.5 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo with Chef Hat & Utensils */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ea580c]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#18181b] group-hover:text-[#ea580c] transition-colors leading-none">
                Flavoria
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#ea580c] uppercase font-bold mt-0.5">
                — RESTAURANT —
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden xl:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#3f3f46]">
            <Link href="/" className="hover:text-[#ea580c] transition-colors">
              HOME
            </Link>
            <Link href="/about" className="hover:text-[#ea580c] transition-colors">
              ABOUT US
            </Link>
            <Link href="/menu" className="hover:text-[#ea580c] transition-colors">
              MENU
            </Link>
            <Link href="/order" className="hover:text-[#ea580c] transition-colors flex items-center gap-1 text-[#ea580c]">
              <QrCode className="w-3.5 h-3.5" />
              <span>TABLE ORDER</span>
            </Link>
            <Link href="/reservation" className="hover:text-[#ea580c] transition-colors">
              RESERVATION
            </Link>
            <Link href="/loyalty" className="hover:text-[#ea580c] transition-colors flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>VIP CLUB</span>
            </Link>
            <Link href="/events" className="hover:text-[#ea580c] transition-colors">
              EVENTS
            </Link>
            <Link href="/contact" className="hover:text-[#ea580c] transition-colors">
              CONTACT
            </Link>
          </div>

          {/* Right Action Suite */}
          <div className="flex items-center gap-2.5">
            {/* Quick QR Table Order Pill on desktop */}
            <Link
              href="/order"
              className="hidden md:inline-flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#ea580c]"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Order</span>
            </Link>

            {/* Tasting Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-stone-50 border border-stone-200 hover:border-[#ea580c] text-stone-700 hover:text-[#ea580c] transition-all"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ea580c] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Book Table Button (Orange pill) */}
            <Link
              href="/reservation"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary-orange text-xs tracking-wider uppercase font-bold"
            >
              BOOK A TABLE
            </Link>

            {/* Unified Account & Workstations Dropdown (On the Account Icon) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                  activeUser
                    ? 'border-stone-200 bg-white hover:border-[#ea580c] shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:border-[#ea580c] text-stone-700 hover:text-[#ea580c]'
                }`}
                title={
                  activeUser
                    ? `Logged in as ${activeUser.name} (${activeUser.badge})`
                    : 'Account & Staff Workstations'
                }
                aria-label="Account and Operations Menu"
              >
                {activeUser ? (
                  <div className={`w-6 h-6 rounded-full ${activeUser.themeBg} ${activeUser.themeColor} border ${activeUser.themeBorder} flex items-center justify-center font-bold text-xs shrink-0`}>
                    {activeUser.name.charAt(0)}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
                
                {/* User Name displayed clearly on the navbar */}
                <span className="text-xs font-bold text-stone-900 hidden sm:inline max-w-[140px] truncate">
                  {activeUser ? activeUser.name : 'Sign In'}
                </span>

                {activeUser && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}

                <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
              </button>

              {/* Backdrop */}
              {accountMenuOpen && (
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setAccountMenuOpen(false)}
                />
              )}

              {/* Unified Dropdown Menu */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-stone-200 p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                  {activeUser ? (
                    <>
                      {/* Active Profile Header showing user's name prominently */}
                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                            {activeUser.isStaff ? 'Staff Workstation' : 'Verified Customer Profile'}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-2xl ${activeUser.themeBg} ${activeUser.themeColor} border ${activeUser.themeBorder} flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-xs`}>
                            {activeUser.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-stone-900 truncate leading-snug">
                              {activeUser.name}
                            </p>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {activeUser.badge}
                            </span>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {activeUser.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content based on Staff vs Customer */}
                      {activeUser.isStaff ? (
                        <>
                          <div className="space-y-1 mb-2.5">
                            <Link
                              href={activeUser.href}
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl btn-primary-orange text-xs font-bold shadow-xs group"
                            >
                              <div className="flex items-center gap-2">
                                <ActiveRoleIcon className="w-4 h-4" />
                                <span>Open {activeRole.label} Station</span>
                              </div>
                              <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                            </Link>
                          </div>

                          <div className="pt-2 border-t border-stone-100 mb-2">
                            <p className="px-2 text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                              Switch Operational Station
                            </p>
                            <div className="space-y-0.5">
                              <Link
                                href="/management"
                                onClick={() => setAccountMenuOpen(false)}
                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
                              >
                                <Crown className="w-3.5 h-3.5 text-amber-500" />
                                <span>Admin & Management Suite</span>
                              </Link>
                              <Link
                                href="/kitchen"
                                onClick={() => setAccountMenuOpen(false)}
                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
                              >
                                <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Kitchen Display (KDS)</span>
                              </Link>
                              <Link
                                href="/driver"
                                onClick={() => setAccountMenuOpen(false)}
                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
                              >
                                <Truck className="w-3.5 h-3.5 text-blue-600" />
                                <span>Driver Dispatch Fleet</span>
                              </Link>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-stone-100 mb-2">
                            <Link
                              href="/account"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-stone-400" />
                              <span>Customer Account & Loyalty</span>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1 mb-2.5">
                            <Link
                              href="/account"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl btn-primary-orange text-xs font-bold shadow-xs group"
                            >
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>My Account Dashboard</span>
                              </div>
                              <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                            </Link>

                            <Link
                              href="/account"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-[#ea580c]" />
                              <span>Order History & Reorder</span>
                            </Link>

                            <Link
                              href="/reservation"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
                            >
                              <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
                              <span>Table Reservations</span>
                            </Link>
                          </div>

                          <div className="pt-2 border-t border-stone-100 mb-2">
                            <Link
                              href="/staff-login"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-500 hover:text-[#ea580c] transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                              <span>Staff Portal Login</span>
                            </Link>
                          </div>
                        </>
                      )}

                      {/* Sign Out Button */}
                      <div className="pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            if (activeUser.isStaff) {
                              logoutStaff();
                            } else {
                              logoutCustomer();
                            }
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out ({activeUser.name})</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    // Completely logged out / Guest View
                    <>
                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 mb-2">
                        <p className="text-xs font-bold text-stone-900 mb-1">Customer Account</p>
                        <p className="text-[10px] text-stone-500 mb-3">Orders, reservations & VIP loyalty club.</p>
                        <Link
                          href="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full py-2.5 px-3 rounded-xl btn-primary-orange text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Sign In to Account</span>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <Link
                          href="/staff-login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-200 text-stone-700 hover:text-[#ea580c] text-xs font-bold transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
                            <span>Staff Portal Login</span>
                          </div>
                          <span className="text-[10px] text-stone-400 group-hover:text-[#ea580c] transition-colors">
                            Email & Password →
                          </span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-700 hover:text-black"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 p-4 rounded-2xl bg-white border border-stone-200 flex flex-col gap-2.5 text-sm shadow-xl">
            {/* Currency Selector Mobile */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs text-stone-500 font-medium">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-stone-50 border border-stone-200 px-3 py-1 rounded-lg text-xs font-bold text-stone-800"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-[#ea580c] font-bold hover:bg-orange-50"
            >
              HOME
            </Link>
            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
            >
              OUR MENU
            </Link>
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-[#ea580c] font-bold hover:bg-orange-50 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>DINE-IN TABLE ORDER</span>
            </Link>
            <Link
              href="/reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
            >
              TABLE RESERVATION
            </Link>
            <Link
              href="/loyalty"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50 flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>VIP LOYALTY CLUB & GIFTS</span>
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
            >
              PRIVATE EVENTS & BANQUETS
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
            >
              ABOUT US
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-stone-800 font-medium hover:bg-stone-50"
            >
              CONTACT
            </Link>

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <Link
                href="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-full btn-primary-orange text-xs uppercase font-bold"
              >
                BOOK A TABLE
              </Link>
              {/* Role-based mobile buttons (Replaces static "Access Staff Portal") */}
              {activeUser ? (
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 mt-1">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-200/60">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${activeUser.themeBg} ${activeUser.themeColor} flex items-center justify-center font-bold text-xs`}>
                        {activeUser.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block leading-tight">{activeUser.name}</span>
                        <span className="text-[10px] text-[#ea580c] font-bold">{activeUser.badge}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeUser.isStaff) {
                          logoutStaff();
                        } else {
                          logoutCustomer();
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800"
                    >
                      Sign Out
                    </button>
                  </div>
                  <Link
                    href={activeUser.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 rounded-xl btn-primary-orange text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>{activeUser.isStaff ? `Open ${activeRole.label} Station` : 'Go to My Account'}</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 mt-1">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Customer Account</span>
                  </Link>
                  <Link
                    href="/staff-login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-50 hover:bg-orange-50 border border-stone-200 text-stone-700 hover:text-[#ea580c] text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Staff Portal Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Table Call Service Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg">
                <BellRing className="w-5 h-5 text-[#ea580c]" />
                <span>Call Waiter / Assistance</span>
              </div>
              <button onClick={() => setCallModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {callSent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="font-bold text-stone-900">Request Sent to Host Stand!</h4>
                <p className="text-xs text-stone-500">A floor captain will attend Table {callTable} momentarily.</p>
              </div>
            ) : (
              <div className="pt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Select Your Table #</label>
                  <select
                    value={callTable}
                    onChange={(e) => setCallTable(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800"
                  >
                    {['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07', 'T-08', 'T-09', 'T-10'].map(t => (
                      <option key={t} value={t}>Table {t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Service Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'assistance', label: 'Call Waiter', icon: '🙋' },
                      { id: 'bill', label: 'Request Bill', icon: '💳' },
                      { id: 'water', label: 'Water Refill', icon: '💧' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setCallType(st.id as 'assistance' | 'bill' | 'water')}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                          callType === st.id ? 'bg-orange-50 border-[#ea580c] text-[#ea580c]' : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <div className="text-lg mb-1">{st.icon}</div>
                        <div>{st.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendCall}
                  className="w-full py-3 rounded-full btn-primary-orange text-xs uppercase font-bold tracking-wider shadow-md"
                >
                  Send Call to Floor Staff
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
