'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffMember, StaffRole } from '@/types';

export interface StaffAuthContextType {
  currentStaff: StaffMember | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }>;
  logout: () => void;
  canAccess: (allowedRoles: string[]) => boolean;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'flavoria_staff_session';
const TOKEN_STORAGE_KEY = 'flavoria_staff_token';

/** Returns headers carrying the current staff token for protected admin/manager API mutations. */
export function getStaffRequestHeaders(extra: Record<string, string> = {}): Record<string, string> {
  if (typeof window === 'undefined') return extra;
  const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  return savedToken ? { ...extra, Authorization: `Bearer ${savedToken}` } : extra;
}

export function getDashboardPathForRole(role?: StaffRole | string): string {
  return role === 'Admin' ? '/dashboard/admin' : '/dashboard/manager';
}

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (saved && savedToken) {
          const parsed = JSON.parse(saved) as StaffMember;
          if (parsed && (parsed.role === 'Admin' || parsed.role === 'Manager')) {
            setCurrentStaff(parsed);
            setToken(savedToken);
          } else {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const persistSession = (staff: StaffMember, nextToken: string) => {
    setCurrentStaff(staff);
    setToken(nextToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }> => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.staff && data.token) {
        persistSession(data.staff, data.token);
        const redirectUrl = data.redirectUrl || getDashboardPathForRole(data.staff.role);
        return { success: true, redirectUrl, staff: data.staff };
      }
      return { success: false, error: data.error || 'Invalid email or password.' };
    } catch {
      return { success: false, error: 'Network connection error.' };
    }
  };

  const logout = () => {
    setCurrentStaff(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    fetch('/api/staff/login', { method: 'DELETE' }).catch(() => {});
  };

  const canAccess = (allowedRoles: string[]): boolean => {
    if (!currentStaff) return false;
    if (currentStaff.role === 'Admin' || currentStaff.permissions?.includes('all')) {
      return true;
    }
    return allowedRoles.some(
      (r) => r.toLowerCase() === currentStaff.role.toLowerCase()
    );
  };

  return (
    <StaffAuthContext.Provider
      value={{
        currentStaff,
        token,
        isAuthenticated: !!currentStaff && !!token,
        isLoading,
        loginWithEmail,
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
    throw new Error('useStaffAuth must be used within StaffAuthProvider');
  }
  return ctx;
}
