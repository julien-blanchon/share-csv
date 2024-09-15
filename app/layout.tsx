import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/custom/header/header";
import { cn } from "@/lib/utils";

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
          <Header />
          <main
            className={cn(
              "container mx-auto flex min-h-screen flex-col gap-4 px-2 md:px-4"
            )}
          >
            {children}
          </main>
          <footer>
            {/* Add your footer content here */}
          </footer>
        </div>
      </body>
    </html>
  );
}
