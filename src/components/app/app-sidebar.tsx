import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "../ui/sidebar";
import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Image, 
  Users, 
  FileText,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="h-full w-64 bg-muted border-r flex flex-col">
      <Sidebar collapsible="icon">
        <SidebarHeader>
        <h2 className="text-lg font-bold tracking-tight group cursor-default">
          <span className="transition-colors duration-200 group-hover:text-black text-primary">SNAPSYNC</span>
          <span className="transition-colors duration-200 group-hover:text-primary"> DASHBOARD</span>
        </h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                className="group transition-all duration-200 hover:pl-4"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <Home className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="transition-all duration-200 group-hover:font-medium">Home</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                className="group transition-all duration-200 hover:pl-4"
              >
                <Link href="/dashboard/events" className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="transition-all duration-200 group-hover:font-medium">Events</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                className="group transition-all duration-200 hover:pl-4"
              >
                <Link href="/dashboard/images" className="flex items-center gap-3">
                  <Image className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="transition-all duration-200 group-hover:font-medium">Images</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                className="group transition-all duration-200 hover:pl-4"
              >
                <Link href="/dashboard/users" className="flex items-center gap-3">
                  <Users className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="transition-all duration-200 group-hover:font-medium">Users</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                className="group transition-all duration-200 hover:pl-4"
              >
                <Link href="/dashboard/logs" className="flex items-center gap-3">
                  <FileText className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="transition-all duration-200 group-hover:font-medium">Logs</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <Button 
            onClick={onLogout} 
            variant="destructive" 
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
