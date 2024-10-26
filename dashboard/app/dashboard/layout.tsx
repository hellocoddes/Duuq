// dashboard/layout.tsx
'use client'
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from 'next/navigation';
import routes from '../../routes'; // Import the routes from the routes file
import { Radio } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="m-4"></div>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  size="lg" 
                  onClick={() => router.push('/dashboard')}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Radio className="size-4" />
                  </div>
                  <span className="font-semibold">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.path}>
                  <SidebarMenuButton
                    onClick={() => router.push(route.path)}
                    className={pathname === route.path ? 'bg-muted' : ''}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
    </SidebarProvider>
  );
}
