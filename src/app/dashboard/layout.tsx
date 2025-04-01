"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/app-sidebar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      router.push("/");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col p-4">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
