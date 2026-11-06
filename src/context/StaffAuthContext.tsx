'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffMember, StaffRole } from '@/types';
import { INITIAL_STAFF } from '@/lib/seed-data';

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

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          setCurrentStaff(parsed);
          document.cookie = `flv_st_token=flv_st_${parsed.id}_active; path=/; max-age=86400; SameSite=Lax`;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved staff session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (staff: StaffMember, token?: string) => {
    setCurrentStaff(staff);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
      const authToken = token || `flv_st_${staff.id}_${Date.now()}`;
      document.cookie = `flv_st_token=${authToken}; path=/; max-age=86400; SameSite=Lax`;
    } catch (e) {
      console.error(e);
    }
  };

  const getRedirectForRole = (role: string) => {
    const roleLower = role.toLowerCase();
    if (
      roleLower.includes('chef') ||
      roleLower.includes('kitchen') ||
      roleLower.includes('cook') ||
      roleLower.includes('pastry') ||
      roleLower.includes('bartender') ||
      roleLower.includes('sommelier')
    ) {
      return '/kitchen';
    } else if (roleLower.includes('driver') || roleLower.includes('delivery')) {
      return '/driver';
    }
    return '/management';
  };

  const loginWithPin = async (pin: string): Promise<{ success: boolean; error?: string; redirectUrl?: string }> => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();
      if (res.ok && data.success && data.staff) {
        saveSession(data.staff, data.token);
        return { success: true, redirectUrl: data.redirectUrl || getRedirectForRole(data.staff.role) };
      }

      // Local fallback if API fails
      const localMatch = INITIAL_STAFF.find(s => s.pinCode === pin.trim());
      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(localMatch.role) };
      }

      return { success: false, error: data.error || 'Invalid staff PIN. Please try again.' };
    } catch {
      // Local fallback on network failure
      const localMatch = INITIAL_STAFF.find(s => s.pinCode === pin.trim());
      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(localMatch.role) };
      }
      return { success: false, error: 'Network error verifying credentials.' };
    }
  };

  const loginWithEmail = async (email: string, password?: string): Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }> => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success && data.staff) {
        saveSession(data.staff, data.token);
        return { success: true, redirectUrl: data.redirectUrl || getRedirectForRole(data.staff.role), staff: data.staff };
      }

      const clean = email.trim().toLowerCase();
      let localMatch = INITIAL_STAFF.find(s => s.email?.toLowerCase() === clean);
      if (!localMatch) {
        if (clean === 'owner@flavoria.com') localMatch = INITIAL_STAFF.find(s => s.role === 'Owner / Admin');
        else if (clean === 'finance@flavoria.com') localMatch = INITIAL_STAFF.find(s => s.role === 'Accountant');
        else if (clean === 'orders@flavoria.com') localMatch = INITIAL_STAFF.find(s => s.role === 'Order Manager');
      }

      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(localMatch.role), staff: localMatch };
      }

      return { success: false, error: data.error || 'Staff member not found.' };
    } catch {
      const clean = email.trim().toLowerCase();
      let localMatch = INITIAL_STAFF.find(s => s.email?.toLowerCase() === clean);
      if (!localMatch) {
        if (clean === 'owner@flavoria.com') localMatch = INITIAL_STAFF.find(s => s.role === 'Owner / Admin');
        else if (clean === 'finance@flavoria.com') localMatch = INITIAL_STAFF.find(s => s.role === 'Accountant');
        else if (clean === 'orders@flavoria.com') localMatch = INITIAL_STAFF.find(s => s.role === 'Order Manager');
      }
      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(localMatch.role), staff: localMatch };
      }
      return { success: false, error: 'Network error verifying credentials.' };
    }
  };

  const quickLoginAs = async (role: StaffRole): Promise<boolean> => {
    const localMatch = INITIAL_STAFF.find(s => s.role === role) || INITIAL_STAFF[0];
    saveSession(localMatch);
    return true;
  };

  const logout = () => {
    setCurrentStaff(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = 'flv_st_token=; path=/; max-age=0; SameSite=Lax';
    } catch (e) {
      console.error(e);
    }
  };

  const canAccess = (allowedRoles: string[]): boolean => {
    if (!currentStaff) return false;
    if (currentStaff.role === 'Owner / Admin') return true; // Super admin always has access
    return allowedRoles.some(
      r => r.toLowerCase() === currentStaff.role.toLowerCase() ||
           currentStaff.permissions?.includes(r.toLowerCase()) ||
           currentStaff.permissions?.includes('all')
    );
  };

  return (
    <StaffAuthContext.Provider
      value={{
        currentStaff,
        isAuthenticated: Boolean(currentStaff),
        isLoading,
        loginWithPin,
        loginWithEmail,
        quickLoginAs,
        logout,
        canAccess
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
}
