// Exempel på hur du integrerar PermissionsProvider i din layout

'use client';

import { PermissionsProvider } from '@/providers/PermissionsProvider';
import { useAuth } from '@/your-auth-context'; // Din befintliga auth

export default function RootLayoutWithPermissions({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth(); // Din befintliga user context
  
  return (
    <PermissionsProvider user={user}>
      {children}
    </PermissionsProvider>
  );
}

// Eller wrap bara din huvudapp:
// function App() {
//   return (
//     <AuthProvider>
//       <PermissionsProvider user={user}>
//         <YourExistingApp />
//       </PermissionsProvider>
//     </AuthProvider>
//   );
// }
