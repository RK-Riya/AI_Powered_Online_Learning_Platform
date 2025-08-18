"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PencilRulerIcon, Book, Compass, LayoutDashboard, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SideBarOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/workspace",
  },
  {
    title: "My Learning",
    icon: Book,
    path: "/workspace/my-courses",
  },
  {
    title: "Explore Courses",
    icon: Compass,
    path: "/workspace/explore",
  },
  {
    title: "AI Tools",
    icon: PencilRulerIcon,
    path: "/workspace/ai-tools",
  },
  {
    title: "Profile",
    icon: UserCircle,
    path: "/workspace/profile",
  },
];

function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className={'p-5'}>
        <Image src={"/logo.svg"} alt="logo" width={120} height={50} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <Button>Create New Course</Button>
        <SidebarGroup />

        <SidebarGroupContent>
          <SidebarMenu>
            {SideBarOptions.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild className="p-5">
                  <Link
                    href={item.path}
                    className={`text-[18px] flex gap-2 items-center ${
                      path.includes(item.path) ? "text-primary bg-purple-500" : ""
                    }`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
