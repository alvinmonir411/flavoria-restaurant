'use client';

import StaffAuthGuard from '@/components/auth/StaffAuthGuard';
import OperationsDashboard from '@/components/dashboard/OperationsDashboard';

export default function AdminDashboardPage() {
  return (
    <StaffAuthGuard
      portalName="Admin Control Center"
      allowedRoles={['Admin']}
    >
      <OperationsDashboard portalRole="Admin" />
    </StaffAuthGuard>
  );
}
