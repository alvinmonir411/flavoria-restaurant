'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  vipTier: string;
}

export const DEFAULT_CUSTOMER: CustomerUser = {
  id: 'cust-alvin',
  name: 'Alvin Monir',
  email: 'alvin@example.com',
  phone: '+880 1712-345678',
  vipTier: 'VIP Club Member'
};

export function formatNameFromEmail(email: string): string {
  if (!email) return 'Guest Customer';
  if (email.toLowerCase().includes('alvin')) return 'Alvin Monir';
  const handle = email.split('@')[0] || 'Guest';
  const clean = handle.replace(/[^a-zA-Z0-9]/g, ' ').trim();
  if (!clean) return 'Guest Customer';
  return clean
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const STORAGE_KEY = 'flavoria_customer_session';
const REGISTRY_KEY = 'flavoria_customer_registry';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isCustomerLoggedIn: boolean;
  loginCustomer: (email: string, name?: string, phone?: string) => void;
  logoutCustomer: () => void;
  updateCustomerProfile: (updated: Partial<CustomerUser>) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  // Seamlessly initialize as logged in customer so profile and navbar are always in sync
  const [customer, setCustomer] = useState<CustomerUser | null>(DEFAULT_CUSTOMER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        if (saved === 'null') {
          setCustomer(null);
        } else {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name) {
            setCustomer(parsed);
          }
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOMER));
        setCustomer(DEFAULT_CUSTOMER);
      }
    } catch {
      setCustomer(DEFAULT_CUSTOMER);
    }
  }, []);

  const loginCustomer = (email: string, name?: string, phone?: string) => {
    const normalizedEmail = (email || 'alvin@example.com').trim().toLowerCase();
    
    // Look up in persistent registry
    let existingProfile: CustomerUser | null = null;
    try {
      const reg = localStorage.getItem(REGISTRY_KEY);
      if (reg) {
        const users = JSON.parse(reg);
        if (users && users[normalizedEmail]) {
          existingProfile = users[normalizedEmail];
        }
      }
    } catch {}

    const resolvedName = name?.trim() || existingProfile?.name || formatNameFromEmail(normalizedEmail);
    const resolvedPhone = phone?.trim() || existingProfile?.phone || (normalizedEmail.includes('alvin') ? '+880 1712-345678' : '+880 1700-123456');
    const resolvedTier = existingProfile?.vipTier || (normalizedEmail.includes('alvin') ? 'VIP Club Member' : 'Member');

    const user: CustomerUser = {
      id: existingProfile?.id || `cust-${Date.now()}`,
      name: resolvedName,
      email: normalizedEmail,
      phone: resolvedPhone,
      vipTier: resolvedTier
    };

    setCustomer(user);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      const reg = localStorage.getItem(REGISTRY_KEY);
      const users = reg ? JSON.parse(reg) : {};
      users[normalizedEmail] = user;
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    try {
      localStorage.setItem(STORAGE_KEY, 'null');
    } catch (e) {
      console.error(e);
    }
  };

  const updateCustomerProfile = (updated: Partial<CustomerUser>) => {
    setCustomer(prev => {
      const next = prev ? { ...prev, ...updated } : { ...DEFAULT_CUSTOMER, ...updated };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        const reg = localStorage.getItem(REGISTRY_KEY);
        const users = reg ? JSON.parse(reg) : {};
        if (next.email) {
          users[next.email.toLowerCase()] = next;
          localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
        }
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isCustomerLoggedIn: Boolean(customer),
        loginCustomer,
        logoutCustomer,
        updateCustomerProfile
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
}
