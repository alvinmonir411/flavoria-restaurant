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

const STORAGE_KEY = 'flavoria_customer_session';

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
    const user: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name || (email.toLowerCase().includes('alvin') ? 'Alvin Monir' : email.split('@')[0]),
      email: email || 'alvin@example.com',
      phone: phone || '+880 1712-345678',
      vipTier: 'VIP Club Member'
    };
    setCustomer(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
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
