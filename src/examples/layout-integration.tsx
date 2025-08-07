// Exempel på hur du integrerar PermissionsProvider i din layout

'use client';

import { PermissionsProvider } from '@/providers/PermissionsProvider';
// import { useAuth } from '@/contexts/AuthContext'; // Ersätt med din befintliga auth context

export default function RootLayoutWithPermissions({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user } = useAuth(); // Uncomment när din auth context är klar
  const user = null; // Tillfällig fallback
  
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
