import { requireAdmin } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PermissionsProvider } from '@/providers/PermissionsProvider';

export default async function AdminPage() {
  // Kräv admin-behörighet
  const user = await requireAdmin();
  
  return (
    <PermissionsProvider user={user}>
      <AdminDashboard />
    </PermissionsProvider>
  );
}
