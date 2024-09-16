'use client'; // Ensure this runs on the client side

import {
  Avatar as AvatarHolder,
} from "@/components/ui/avatar"
import {
  LifeBuoy,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../../ui/button"
import { createClient } from '@/utils/supabase/client'; // Use the client-side Supabase client
import { useRouter } from 'next/navigation'; // For client-side redirection
import { useState } from "react";
import Avatar from "boring-avatars";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { User as UserSupabase } from '@supabase/supabase-js';

export function AvatarDropdown({ user }: { user: UserSupabase }) {
  const [loading, setLoading] = useState(false); // To manage loading state
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const router = useRouter(); // Client-side router

  const signOut = async () => {
    setLoading(true); // Optional: Add loading state to prevent multiple clicks

    try {
      const supabase = createClient(); // Ensure client-side instance
      await supabase.auth.signOut(); // Call the sign-out method
      router.push('/'); // Client-side redirection after sign-out
    } catch (error) {
      console.error('Error signing out:', error); // Handle any error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading} className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"

          >
            <AvatarHolder>
              <Avatar name={user.id} />
              {/* <AvatarFallback>
                {user.email.slice(0, 1).toUpperCase()}
              </AvatarFallback> */}
            </AvatarHolder>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" sideOffset={5} align="end">
          <DropdownMenuLabel className="flex flex-col px-2 py-1.5 text-sm font-semibold">
            My Account
            <span className="text-xs text-gray-500">
              {user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/plan" scroll={true}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>My plan</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" scroll={true}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem onSelect={() => setIsContactDialogOpen(true)}>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Contact</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="flex items-center">
            <button
              onClick={signOut}
              className="flex items-center w-full px-2 py-1.5 text-sm font-semibold text-red-500"
              disabled={loading} // Disable button while signing out
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{loading ? 'Logging out...' : 'Logout'}</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Contact Us</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <p>Reach out to us at: jeremie.feron@gmail.com</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
