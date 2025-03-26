import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/ui/app-sidebar";

// filepath: d:\Projects\Development\snapsync_admin\src\app\dashboard\layout.tsx

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
}
