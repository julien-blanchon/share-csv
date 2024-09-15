import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/custom/header";
import { SidebarWrapper } from "@/components/custom/side-bar/SidebarWrapper"; // Import new Sidebar wrapper
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster"


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          {/* Render SidebarWrapper to handle client-side logic */}
          <SidebarWrapper>
            <Header />
            <main
              className={cn(
                "container mx-auto flex min-h-screen flex-col gap-4 px-2 md:px-4"
              )}
            >
              {children}
            </main>
          </SidebarWrapper>
          <Toaster />
          <footer>
            {/* Add your footer content here */}
          </footer>
        </div>
      </body>
    </html>
  );
}
