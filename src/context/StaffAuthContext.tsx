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

function normalizeStoredRole(rawRole?: string): StaffRole | null {
  const r = (rawRole || '').trim().toLowerCase();
  if (r === 'admin' || r === 'owner / admin' || r === 'owner') return 'Admin';
  if (r === 'manager' || r === 'restaurant manager' || r === 'floor manager') return 'Manager';
  return null;
}

function findLocalStaffByEmail(email: string): StaffMember | undefined {
  const clean = email.trim().toLowerCase();
  const exact = INITIAL_STAFF.find(s => s.email?.toLowerCase() === clean);
  if (exact) return exact;
  if (clean === 'owner@flavoria.com') {
    return INITIAL_STAFF.find(s => s.role === 'Admin');
  }
  return undefined;
}

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on mount, normalizing legacy role labels and clearing removed roles
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validRole = parsed?.id ? normalizeStoredRole(parsed.role) : null;
        if (parsed && parsed.id && validRole) {
          const normalizedStaff: StaffMember = { ...parsed, role: validRole };
          setCurrentStaff(normalizedStaff);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedStaff));
          document.cookie = `flv_st_token=flv_st_${parsed.id}_active; path=/; max-age=86400; SameSite=Lax`;
        } else {
          localStorage.removeItem(STORAGE_KEY);
          document.cookie = 'flv_st_token=; path=/; max-age=0; SameSite=Lax';
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

  const getRedirectForRole = () => '/management';

  const loginWithPin = async (pin: string): Promise<{ success: boolean; error?: string; redirectUrl?: string; staff?: StaffMember }> => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();
      if (res.ok && data.success && data.staff) {
        saveSession(data.staff, data.token);
        return { success: true, redirectUrl: data.redirectUrl || getRedirectForRole(), staff: data.staff };
      }

      const localMatch = INITIAL_STAFF.find(s => s.pinCode === pin.trim());
      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(), staff: localMatch };
      }

      return { success: false, error: data.error || 'Invalid PIN. Please use Admin (1111) or Manager (2222).' };
    } catch {
      const localMatch = INITIAL_STAFF.find(s => s.pinCode === pin.trim());
      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(), staff: localMatch };
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
        return { success: true, redirectUrl: data.redirectUrl || getRedirectForRole(), staff: data.staff };
      }

      const localMatch = findLocalStaffByEmail(email);
      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(), staff: localMatch };
      }

      return { success: false, error: data.error || 'Account not found.' };
    } catch {
      const localMatch = findLocalStaffByEmail(email);
      if (localMatch) {
        saveSession(localMatch);
        return { success: true, redirectUrl: getRedirectForRole(), staff: localMatch };
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
    if (currentStaff.role === 'Admin') return true;
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
