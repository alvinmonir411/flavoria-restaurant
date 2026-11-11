'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StaffAuthGuard from '@/components/auth/StaffAuthGuard';
import { useStaffAuth, getDashboardPathForRole } from '@/context/StaffAuthContext';

export default function DashboardEntryPage() {
  const { currentStaff, isAuthenticated, isLoading } = useStaffAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && currentStaff) {
      router.replace(getDashboardPathForRole(currentStaff.role));
    }
  }, [isLoading, isAuthenticated, currentStaff, router]);

  return (
    <StaffAuthGuard
      portalName="Admin & Manager Dashboard"
      allowedRoles={['Admin', 'Manager']}
    >
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-stone-600 uppercase tracking-widest">
            Opening your role dashboard...
          </p>
        </div>
      </div>
    </StaffAuthGuard>
  );
}
