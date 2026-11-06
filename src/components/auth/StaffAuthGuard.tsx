'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { 
  Lock, 
  ShieldAlert, 
  Mail, 
  KeyRound, 
  LogOut, 
  ArrowRight,
  Eye,
  EyeOff,
  ChefHat,
  Truck,
  LayoutDashboard,
  UtensilsCrossed,
  ArrowLeft
} from 'lucide-react';

interface StaffAuthGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  portalName: string;
}

export default function StaffAuthGuard({ children, allowedRoles, portalName }: StaffAuthGuardProps) {
  const { currentStaff, isAuthenticated, isLoading, loginWithPin, loginWithEmail, logout, canAccess } = useStaffAuth();
  
  // Default to standard Enterprise Email & Password Login
  const [authMode, setAuthMode] = useState<'credentials' | 'pin'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Email / Password Form Submit
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your staff email or employee ID.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    
    // Backend confirms profile and role based on email and password
    const result = await loginWithEmail(email.trim(), password.trim());
    setSubmitting(false);

    if (result.success) {
      if (pathname === '/staff-login' && result.redirectUrl) {
        router.push(result.redirectUrl);
      }
    } else {
      setErrorMsg(result.error || 'Invalid credentials. Please verify your email and try again.');
    }
  };

  // Terminal PIN Keypad Submit
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setErrorMsg('Please enter your 4-digit staff passcode.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    
    const result = await loginWithPin(pin);
    setSubmitting(false);

    if (result.success) {
      if (pathname === '/staff-login' && result.redirectUrl) {
        router.push(result.redirectUrl);
      }
    } else {
      setErrorMsg(result.error || 'Incorrect passcode. Access denied.');
      setPin('');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pin.length < 4) {
      const next = pin + val;
      setPin(next);
      setErrorMsg('');
      if (next.length === 4) {
        triggerAutoPin(next);
      }
    }
  };

  const triggerAutoPin = async (p: string) => {
    setSubmitting(true);
    const result = await loginWithPin(p);
    setSubmitting(false);
    if (result.success) {
      if (pathname === '/staff-login' && result.redirectUrl) {
        router.push(result.redirectUrl);
      }
    } else {
      setErrorMsg(result.error || 'Incorrect passcode. Access denied.');
      setPin('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-stone-600 uppercase tracking-widest">
            Verifying Security Session...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 1: Unauthenticated -> Real Enterprise Authentication Screen
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#EA580C] selection:text-white">
        
        {/* Top Branding Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#18181b] block leading-none">
                Flavoria
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#ea580c] uppercase font-bold">
                Operations Console
              </span>
            </div>
          </Link>

          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Staff & Management Login
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Access restricted to authorized personnel for <strong className="text-stone-800">{portalName}</strong>
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-stone-200 shadow-xl">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-2xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('credentials'); setErrorMsg(''); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'credentials'
                    ? 'bg-white text-[#ea580c] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email & Password</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('pin'); setErrorMsg(''); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'pin'
                    ? 'bg-white text-[#ea580c] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Terminal PIN</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mode 1: Professional Email & Password Login */}
            {authMode === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Staff Email or Employee ID
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@flavoria.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea580c] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Security Password
                    </label>
                    <span className="text-[11px] text-stone-500 hover:text-[#ea580c] cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea580c] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded border-stone-300 text-[#ea580c] focus:ring-[#ea580c]"
                    />
                    <span>Remember terminal session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl btn-primary-orange text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all mt-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Terminal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Mode 2: Clean POS / KDS Passcode Keypad */
              <form onSubmit={handlePinSubmit} className="space-y-5">
                <div className="text-center">
                  <span className="text-xs text-stone-500 font-medium">Enter your 4-digit staff passcode</span>
                  <div className="flex justify-center items-center gap-3 mt-3">
                    {[0, 1, 2, 3].map((idx) => {
                      const filled = pin.length > idx;
                      return (
                        <div
                          key={idx}
                          className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                            filled
                              ? 'bg-[#ea580c] border-[#ea580c] scale-110 shadow-sm'
                              : 'border-stone-300 bg-stone-100'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Clean Passcode Keypad */}
                <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="h-11 rounded-xl bg-stone-50 hover:bg-orange-50 hover:text-[#ea580c] border border-stone-200 font-bold text-base text-stone-800 active:scale-95 transition-all flex items-center justify-center shadow-xs"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setPin(''); setErrorMsg(''); }}
                    className="h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold active:scale-95 transition-all flex items-center justify-center"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="h-11 rounded-xl bg-stone-50 hover:bg-orange-50 hover:text-[#ea580c] border border-stone-200 font-bold text-base text-stone-800 active:scale-95 transition-all flex items-center justify-center shadow-xs"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setPin(prev => prev.slice(0, -1))}
                    className="h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold active:scale-95 transition-all flex items-center justify-center"
                  >
                    ⌫
                  </button>
                </div>
              </form>
            )}

            {/* Back link */}
            <div className="mt-6 pt-4 border-t border-stone-100 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#ea580c] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Guest Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: Authenticated but Role Unauthorized -> 403 Forbidden Screen
  // =========================================================================
  const hasAccess = canAccess(allowedRoles);
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center p-6 selection:bg-[#EA580C] selection:text-white">
        <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-stone-900 mb-1">
            Access Restricted (403)
          </h2>
          <p className="text-xs text-stone-500 font-light leading-relaxed mb-6">
            You are signed in as <strong className="text-stone-900 font-bold">{currentStaff?.name}</strong> (<span className="text-[#ea580c] font-bold">{currentStaff?.role}</span>). 
            Your role does not have authorization to view <strong className="text-stone-800">{portalName}</strong>.
          </p>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs font-semibold text-stone-700 mb-6 flex flex-wrap gap-1.5 justify-center">
            {allowedRoles.map((role) => (
              <span key={role} className="px-2.5 py-0.5 bg-white rounded-full border border-stone-200 text-[11px]">
                {role}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl btn-primary-orange text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign In with Different Account</span>
            </button>

            <Link
              href="/"
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold tracking-wider uppercase text-center transition-colors"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 3: Authenticated & Authorized -> Render Content with Staff Top Bar
  // =========================================================================
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top Persistent Staff Session Bar */}
      <div className="sticky top-0 z-40 bg-[#18181b] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs border-b border-stone-800 shadow-md">
        
        {/* Left: Staff Identity */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#ea580c] flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {currentStaff?.name.charAt(0)}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-100">{currentStaff?.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-stone-800 text-[10px] font-bold text-[#ea580c] border border-stone-700">
              {currentStaff?.role}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Shift: {currentStaff?.shift} (Active)</span>
            </span>
          </div>
        </div>

        {/* Right: Portal Shortcuts & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/management"
            className="hidden md:inline-flex items-center gap-1 text-stone-400 hover:text-white px-2 py-1 rounded-lg hover:bg-stone-800 transition-colors text-[11px]"
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>Admin</span>
          </Link>
          <Link
            href="/kitchen"
            className="hidden md:inline-flex items-center gap-1 text-stone-400 hover:text-white px-2 py-1 rounded-lg hover:bg-stone-800 transition-colors text-[11px]"
          >
            <ChefHat className="w-3 h-3" />
            <span>KDS</span>
          </Link>
          <Link
            href="/driver"
            className="hidden md:inline-flex items-center gap-1 text-stone-400 hover:text-white px-2 py-1 rounded-lg hover:bg-stone-800 transition-colors text-[11px]"
          >
            <Truck className="w-3 h-3" />
            <span>Driver</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 hover:bg-rose-950 hover:text-rose-400 text-stone-300 border border-stone-700 hover:border-rose-800 transition-colors text-[11px] font-bold"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Protected Portal Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
