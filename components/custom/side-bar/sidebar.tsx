"use client";

import Link from "next/link";
import { PanelsTopLeft, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/custom/side-bar/menu";
import { SidebarToggle } from "@/components/custom/side-bar/sidebar-toggle";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-20 h-screen lg:translate-x-0 transition-all ease-in-out duration-300",
                isOpen ? "w-72 opacity-100 visible" : "w-0 opacity-0 invisible"
            )}
        >
            <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
                <div className="flex justify-between items-center mb-4">
                    <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
                    <Button variant="ghost" size="icon">
                        <Upload className="w-5 h-5" />
                    </Button>
                </div>
                <Button
                    className="mb-4"
                    variant="link"
                    asChild
                >
                </Button>
                <Menu isOpen={isOpen} />
            </div>
        </aside>
    );
}