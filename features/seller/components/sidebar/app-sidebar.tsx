'use client';

import * as React from 'react';
import { Home, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Quản lý đo',
    icon: Home,
    url: '/seller',
  },
  {
    title: 'Khách hàng',
    icon: Users,
    url: '/seller/customers',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="!top-0 !h-screen !pt-24 border-r border-gray-200 bg-white"
      collapsible="icon">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map(item => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + '/');

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-200 border-0
                        ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }
                      `}
                      tooltip={item.title}>
                      <Link
                        className="flex items-center gap-3 w-full hover:no-underline"
                        href={item.url}>
                        <item.icon
                          className={`h-5 w-5 flex-shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-gray-500 group-hover:text-blue-600'
                          }`}
                        />
                        <span className="font-medium text-sm group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
