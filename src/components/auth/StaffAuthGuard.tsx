'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStaffAuth, getDashboardPathForRole } from '@/context/StaffAuthContext';
import {
  Lock,
  ShieldAlert,
  LogOut,
  ArrowRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  UtensilsCrossed,
  ArrowLeft,
} from 'lucide-react';

interface StaffAuthGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  portalName: string;
}

export default function StaffAuthGuard({ children, allowedRoles, portalName }: StaffAuthGuardProps) {
  const { currentStaff, isAuthenticated, isLoading, loginWithEmail, logout, canAccess } = useStaffAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    const result = await loginWithEmail(email.trim(), password.trim());
    setSubmitting(false);

    if (result.success && result.staff) {
      const targetPath = result.redirectUrl || getDashboardPathForRole(result.staff.role);
      router.replace(targetPath);
    } else {
      setErrorMsg(result.error || 'Invalid email or password.');
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

  // CASE 1: Unauthenticated -> Email & Password Login Portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#EA580C] selection:text-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#18181b] block leading-none">
                Flavoria
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#ea580c] uppercase font-bold">
                Role Dashboard Portal
              </span>
            </div>
          </Link>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-9 px-6 sm:px-10 rounded-3xl border border-stone-200 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ea580c] mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-stone-900">
                Dashboard Sign In
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Sign in with your email and password to open your role-based dashboard for <strong className="text-stone-800">{portalName}</strong>.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea580c] transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl btn-primary-orange text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all mt-2 disabled:opacity-60"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

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

  // CASE 2: Authenticated but Role Unauthorized -> 403 Forbidden Screen
  const hasAccess = canAccess(allowedRoles);
  if (!hasAccess) {
    const homeDashboard = getDashboardPathForRole(currentStaff?.role);
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 selection:bg-[#EA580C] selection:text-white">
        <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-stone-900 mb-1">
            Access Restricted (403)
          </h2>
          <p className="text-xs text-stone-500 font-light leading-relaxed mb-6">
            You are signed in as <strong className="text-stone-900 font-bold">{currentStaff?.name}</strong> (
            <span className="text-[#ea580c] font-bold">{currentStaff?.role}</span>).
            Your role does not have authorization to access <strong className="text-stone-800">{portalName}</strong>.
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href={homeDashboard}
              className="w-full py-2.5 rounded-xl btn-primary-orange text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Open My {currentStaff?.role} Dashboard</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.replace('/dashboard');
              }}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign In with Different Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: Authenticated & Authorized -> Render Content with Staff Top Bar
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="sticky top-0 z-40 bg-[#18181b] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs border-b border-stone-800 shadow-md">
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
              <span>Authenticated Session</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={getDashboardPathForRole(currentStaff?.role)}
            className="hidden md:inline-flex items-center gap-1.5 text-stone-300 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800/70 transition-colors text-[11px] font-semibold"
          >
            <LayoutDashboard className="w-3 h-3 text-[#ea580c]" />
            <span>{currentStaff?.role} Dashboard</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.replace('/dashboard');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 hover:bg-rose-950 hover:text-rose-400 text-stone-300 border border-stone-700 hover:border-rose-800 transition-colors text-[11px] font-bold"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
