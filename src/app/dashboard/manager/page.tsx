'use client';

import StaffAuthGuard from '@/components/auth/StaffAuthGuard';
import OperationsDashboard from '@/components/dashboard/OperationsDashboard';

export default function ManagerDashboardPage() {
  return (
    <StaffAuthGuard
      portalName="Manager Operations Portal"
      allowedRoles={['Manager', 'Admin']}
    >
      <OperationsDashboard portalRole="Manager" />
    </StaffAuthGuard>
  );
}
