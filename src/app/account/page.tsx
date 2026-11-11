'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { Order, Reservation } from '@/types';
import { 
  User, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Star,
  Receipt,
  LogOut,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  area: string;
  deliveryInstructions?: string;
  isDefault: boolean;
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { customer, isCustomerLoggedIn, loginCustomer, logoutCustomer, updateCustomerProfile } = useCustomerAuth();
  const { loginWithEmail: loginStaffWithEmail } = useStaffAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'reservations'>('orders');

  // Unified Auth State
  const [authStatusMessage, setAuthStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Customer Profile State
  const [customerName, setCustomerName] = useState('Alvin Monir');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [email, setEmail] = useState('alvin@example.com');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);

      const normEmail = customer.email.toLowerCase();
      try {
        const saved = localStorage.getItem(`flavoria_addresses_${normEmail}`);
        if (saved) {
          setAddresses(JSON.parse(saved));
        } else if (normEmail.includes('alvin')) {
          const defaultAlvinAddresses: SavedAddress[] = [
            {
              id: 'addr-1',
              label: 'Home (Gulshan)',
              recipientName: 'Alvin Monir',
              phone: '+880 1712-345678',
              addressLine: 'House 14, Road 71, Block NW(B)',
              area: 'Gulshan-2, Dhaka',
              deliveryInstructions: 'Call at security gate; 4th floor Apt 4A',
              isDefault: true
            },
            {
              id: 'addr-2',
              label: 'Office (Banani)',
              recipientName: 'Alvin Monir',
              phone: '+880 1712-345678',
              addressLine: 'Level 8, Tower 52, Road 11',
              area: 'Banani, Dhaka',
              deliveryInstructions: 'Leave with reception floor captain',
              isDefault: false
            }
          ];
          setAddresses(defaultAlvinAddresses);
          localStorage.setItem(`flavoria_addresses_${normEmail}`, JSON.stringify(defaultAlvinAddresses));
        } else {
          setAddresses([]);
        }
      } catch {
        setAddresses([]);
      }
    }
  }, [customer]);

  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('Gulshan-1');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Orders and Reservations State
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchAccountData() {
      if (!customer) {
        setOrders([]);
        setReservations([]);
        setLoadingOrders(false);
        return;
      }

      setLoadingOrders(true);
      try {
        const [ordRes, resRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/reservations')
        ]);
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          const allOrders: Order[] = ordData.orders || [];
          
          const normEmail = customer.email.toLowerCase();
          const normName = customer.name.toLowerCase();

          // Filter orders for this specific customer
          const myOrders = allOrders.filter(o => {
            if (normEmail.includes('alvin')) {
              return true; // Demo VIP account view
            }
            const ordCustEmail = ((o as Order & { customerEmail?: string }).customerEmail || '').toLowerCase();
            const ordCustName = (o.customerName || '').toLowerCase();
            const ordPhone = o.customerPhone || '';

            return (
              ordCustEmail === normEmail ||
              ordCustName === normName ||
              (normName.length > 2 && ordCustName.includes(normName)) ||
              (customer.phone && ordPhone === customer.phone)
            );
          });
          setOrders(myOrders);
        }
        if (resRes.ok) {
          const resData = await resRes.json();
          const allReservations: Reservation[] = resData.reservations || [];
          
          const normEmail = customer.email.toLowerCase();
          const normName = customer.name.toLowerCase();

          const myReservations = allReservations.filter(r => {
            if (normEmail.includes('alvin')) {
              return true;
            }
            const resEmail = ((r.email || (r as Reservation & { guestEmail?: string }).guestEmail || '')).toLowerCase();
            const resName = (r.guestName || '').toLowerCase();
            return resEmail === normEmail || resName.includes(normName);
          });
          setReservations(myReservations);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchAccountData();
  }, [customer]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({ name: customerName, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine || !customer) return;
    const addr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel || 'Other',
      recipientName: customerName || customer.name,
      phone: phone || customer.phone,
      addressLine: newAddrLine,
      area: newAddrArea,
      isDefault: addresses.length === 0
    };
    const updated = [...addresses, addr];
    setAddresses(updated);
    try {
      localStorage.setItem(`flavoria_addresses_${customer.email.toLowerCase()}`, JSON.stringify(updated));
    } catch {}
    setNewAddrLine('');
    setNewAddrLabel('');
    setShowAddAddress(false);
  };

  const handleRemoveAddress = (id: string) => {
    if (!customer) return;
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    try {
      localStorage.setItem(`flavoria_addresses_${customer.email.toLowerCase()}`, JSON.stringify(updated));
    } catch {}
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      // Re-add to cart
      addToCart({
        id: item.menuItemId,
        name: item.name,
        category: 'Mains',
        description: 'Re-ordered favorite item',
        price: item.price,
        isAvailable: true,
        isSignature: false,
        dietaryTags: [],
        imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date().toISOString()
      }, item.quantity);
    });
  };

  const handleSmartLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthStatusMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    setAuthStatusMessage(null);
    setIsAuthenticating(true);

    try {
      // Step 1: Check if this email is an enterprise staff / admin account
      const staffResult = await loginStaffWithEmail(cleanEmail, loginPassword);
      if (staffResult.success && staffResult.staff) {
        setAuthStatusMessage({ 
          type: 'success', 
          text: `✓ Verified as ${staffResult.staff.role}! Opening ${staffResult.staff.name}'s workstation...` 
        });
        setTimeout(() => {
          router.push(staffResult.redirectUrl || '/dashboard');
        }, 600);
        return;
      }

      // If someone enters an Admin/Manager email with an invalid password, do NOT log them in as customer!
      if (
        staffResult.error &&
        (cleanEmail === 'admin@gmail.com' || cleanEmail === 'manager@gamil.com')
      ) {
        setAuthStatusMessage({ type: 'error', text: staffResult.error });
        return;
      }

      // Step 2: Authenticate as Customer
      loginCustomer(cleanEmail, loginName || undefined);
      setAuthStatusMessage({ 
        type: 'success', 
        text: `✓ Welcome to your personal customer account!` 
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setAuthStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Navbar />

      {!isCustomerLoggedIn ? (
        // -------------------------------------------------------------
        // Smart Unified Login Portal (Admin, Staff & Customer)
        // -------------------------------------------------------------
        <main className="max-w-xl mx-auto w-full px-4 py-12 sm:py-16 flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ea580c] mx-auto mb-4 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5">
              Customer Sign In
            </h1>
            <p className="text-xs text-stone-500 mb-6 font-light max-w-md mx-auto">
              Sign in with your email and password to manage your dining reservations, active orders, and saved delivery addresses.
            </p>

            {authStatusMessage && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-bold flex items-center justify-center gap-2 border ${
                authStatusMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {authStatusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{authStatusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSmartLogin} className="space-y-3.5 text-left mb-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea580c] transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-stone-400 font-normal lowercase">(for new customer signups)</span>
                </label>
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="e.g. Rahim Ahmed, Sara Khan"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Customer Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Admin or Manager Portal?</span>
              <Link href="/dashboard" className="text-[#ea580c] font-bold hover:underline">
                Go to Dashboard Login →
              </Link>
            </div>

          </div>
        </main>
      ) : (
        // -------------------------------------------------------------
        // Logged-in State: Full Customer VIP Dashboard
        // -------------------------------------------------------------
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1">
          {/* Account Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C] text-2xl font-serif font-bold">
                {customerName.charAt(0) || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-bold text-stone-900">{customerName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase border border-amber-200">
                    {customer?.vipTier || 'Member'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">{phone} • {email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/menu"
                className="px-5 py-2.5 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider"
              >
                Order Food Now
              </Link>

              <button
                onClick={logoutCustomer}
                className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                title="Sign out of customer account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
          {[
            { id: 'orders', label: 'Order History', icon: ShoppingBag, count: orders.length },
            { id: 'addresses', label: 'Delivery Addresses', icon: MapPin, count: addresses.length },
            { id: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.length },
            { id: 'profile', label: 'Profile Details', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1A4231] text-white shadow-md'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="p-12 text-center text-stone-400">Loading order records...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">No orders yet</h3>
                <p className="text-xs text-stone-500 mb-6">Explore our curated menu and enjoy fresh culinary creations delivered to your doorstep.</p>
                <Link href="/menu" className="px-6 py-2.5 rounded-full btn-primary-orange text-xs font-bold uppercase">
                  Browse Menu
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-stone-900">#{order.orderCode}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#EA580C] text-[10px] font-bold uppercase">
                        {order.orderType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 font-mono">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {order.items.map((it, i) => (
                        <span key={i} className="text-xs bg-stone-100 px-2 py-0.5 rounded-md text-stone-700">
                          {it.quantity}x {it.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Cash Total</span>
                      <strong className="text-lg font-bold text-[#EA580C]">
                        {formatPrice(order.totalAmount)}
                      </strong>
                    </div>

                    <button
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 text-xs font-bold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Saved Delivery Addresses</h3>
                <p className="text-xs text-stone-500">Fast 1-click address selection during delivery checkout.</p>
              </div>

              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl btn-primary-orange text-xs font-bold uppercase"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-stone-900">Add New Delivery Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Home, Office, Gym"
                      value={newAddrLabel}
                      onChange={(e) => setNewAddrLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Delivery Area / Zone</label>
                    <select
                      value={newAddrArea}
                      onChange={(e) => setNewAddrArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
                    >
                      <option value="Gulshan-1">Gulshan-1 (Zone 1)</option>
                      <option value="Gulshan-2">Gulshan-2 (Zone 1)</option>
                      <option value="Banani">Banani (Zone 2)</option>
                      <option value="Baridhara DOHS">Baridhara DOHS (Zone 2)</option>
                      <option value="Dhanmondi">Dhanmondi (Zone 3)</option>
                      <option value="Uttara">Uttara (Zone 4)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">Detailed Address Line</label>
                  <input
                    type="text"
                    placeholder="House number, road number, apartment details..."
                    value={newAddrLine}
                    onChange={(e) => setNewAddrLine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-primary-orange text-xs font-bold uppercase"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#EA580C]" />
                        <h4 className="font-bold text-sm text-stone-900">{addr.label}</h4>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-700 font-medium mb-1">{addr.addressLine}</p>
                    <p className="text-xs text-stone-500">{addr.area}</p>
                    {addr.deliveryInstructions && (
                      <p className="text-[11px] text-stone-400 italic mt-2">
                        Note: {addr.deliveryInstructions}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Reservations */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Table Bookings &amp; History</h3>
                <p className="text-xs text-stone-500">Live confirmations for fine dining experiences.</p>
              </div>

              <Link
                href="/reservation"
                className="px-5 py-2.5 rounded-full btn-primary-orange text-xs font-bold uppercase"
              >
                Book a Table
              </Link>
            </div>

            {reservations.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">No upcoming reservations</h3>
                <p className="text-xs text-stone-500 mb-6">Experience our signature tasting menu in an atmosphere of warmth and elegance.</p>
                <Link href="/reservation" className="px-6 py-2.5 rounded-full btn-primary-orange text-xs font-bold uppercase">
                  Reserve a Table
                </Link>
              </div>
            ) : (
              reservations.map(res => (
                <div key={res.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-stone-900">{res.code}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {res.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-700 font-bold">
                      {res.date} • {res.timeSlot} • {res.guests} Guests
                    </div>
                    <div className="text-xs text-stone-500">
                      Seating: {res.area} {res.tableNumber ? `(Table ${res.tableNumber})` : ''}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Guest</span>
                    <span className="text-sm font-bold text-stone-900">{res.guestName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Profile Details */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Customer Account Profile</h3>

            {savedSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Mobile Number (Bangladesh)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium"
                required
              />
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </main>
      )}

      <Footer />
    </div>
  );
}
