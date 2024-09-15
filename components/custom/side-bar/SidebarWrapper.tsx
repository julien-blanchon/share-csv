"use client";

import { Sidebar } from "@/components/custom/side-bar/sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Client-side state

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={cn(
          "container mx-auto flex min-h-screen flex-col gap-4 px-2 py-2 md:px-4 md:py-4",
          isSidebarOpen ? "lg:ml-72" : "lg:ml-[0px]"
        )}
      >
        {/* <SidebarToggle isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /> */}
        {children}
      </div>
    </div>
  );
};
