"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NavigationSidebar from "@/components/NavigationSidebar";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  
  // Sidor som inte ska ha sidebar
  const publicPages = ['/', '/login', '/register'];
  const showSidebar = !publicPages.includes(pathname);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NavigationSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
