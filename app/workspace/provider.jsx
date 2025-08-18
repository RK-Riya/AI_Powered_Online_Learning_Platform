"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import AppHeader from "./_components/AppHeader";
import AppSidebar from "./_components/AppSidebar";

function WorkspaceProvider({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Area */}
        <div className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 p-10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default WorkspaceProvider;
