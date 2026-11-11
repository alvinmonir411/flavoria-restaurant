'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { StaffAuthProvider } from '@/context/StaffAuthContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import CartDrawer from '@/components/landing/CartDrawer';
import AISommelierWidget from '@/components/common/AISommelierWidget';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <StaffAuthProvider>
          <CustomerAuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <AISommelierWidget />
            </CartProvider>
          </CustomerAuthProvider>
        </StaffAuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
