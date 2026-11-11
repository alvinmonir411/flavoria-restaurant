'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { CurrencyCode } from '@/types';

interface CurrencyContextType {
  currency: CurrencyCode;
  symbol: string;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

/** Fixed USD formatting — currency switcher removed by specification. */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const convertPrice = (amountInUSD: number) => Number(amountInUSD || 0);
  const formatPrice = (amountInUSD: number) => `$${Number(amountInUSD || 0).toFixed(2)}`;

  return (
    <CurrencyContext.Provider value={{ currency: 'USD', symbol: '$', formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
