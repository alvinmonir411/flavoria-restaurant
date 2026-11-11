'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StaffMember, StaffRole } from '@/types';

interface StaffAuthContextType {
  currentStaff: StaffMember | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPin: (pin: string) => Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }>;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }>;
  quickLoginAs: (role: StaffRole) => Promise<boolean>;
  logout: () => void;
  canAccess: (allowedRoles: string[]) => boolean;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'flavoria_staff_session';
const TOKEN_STORAGE_KEY = 'flavoria_staff_token';

export function getStaffRequestHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) headers['x-staff-token'] = token;
    } catch {
      // ignore storage errors
    }
  }
  return headers;
}

function normalizeStoredRole(rawRole?: string): StaffRole | null {
  if (!rawRole) return null;
  const r = rawRole.toLowerCase();
  if (r === 'admin') return 'Admin';
  if (r === 'manager') return 'Manager';
  return null;
}

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StaffMember;
        const normalizedRole = normalizeStoredRole(parsed?.role);
        if (normalizedRole) {
          const normalizedStaff = { ...parsed, role: normalizedRole };
          setCurrentStaff(normalizedStaff);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedStaff));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistStaff = (staff: StaffMember, token?: string) => {
    setCurrentStaff(staff);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    } catch {
      // ignore storage errors
    }
  };

  const getRedirectForRole = () => '/management';

  const loginWithPin = async (
    pin: string
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }> => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.staff) {
        persistStaff(data.staff, data.token);
        return { success: true, redirectUrl: data.redirectUrl || getRedirectForRole(), staff: data.staff };
      }

      return { success: false, error: data.error || 'Invalid PIN. Please use Admin (1111) or Manager (2222).' };
    } catch {
      return { success: false, error: 'Database authentication error. Please try again.' };
    }
  };

  const loginWithEmail = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }> => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.staff) {
        persistStaff(data.staff, data.token);
        return { success: true, redirectUrl: data.redirectUrl || getRedirectForRole(), staff: data.staff };
      }

      return { success: false, error: data.error || 'Staff account not found in database.' };
    } catch {
      return { success: false, error: 'Database authentication error. Please try again.' };
    }
  };

  const quickLoginAs = async (role: StaffRole): Promise<boolean> => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.staff) {
        persistStaff(data.staff, data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentStaff(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
    fetch('/api/staff/login', { method: 'DELETE' }).catch(() => {});
  };

  const canAccess = (allowedRoles: string[]): boolean => {
    if (!currentStaff) return false;
    if (currentStaff.role === 'Admin') return true;
    return allowedRoles.includes(currentStaff.role);
  };

  return (
    <StaffAuthContext.Provider
      value={{
        currentStaff,
        isAuthenticated: !!currentStaff,
        isLoading,
        loginWithPin,
        loginWithEmail,
        quickLoginAs,
        logout,
        canAccess,
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return ctx;
}
