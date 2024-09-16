import "@/app/globals.css";
import Header from "@/components/custom/header/header";
import Footer from "@/components/custom/footer/footer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster"
import { BGGrid } from "@/components/custom/background/bg-grid";

import { Inter } from "next/font/google";
import LocalFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${calSans.variable}`}
      >
        <div className="flex min-h-screen flex-col">
          {/* Render SidebarWrapper to handle client-side logic */}
          <Header />
          <BGGrid>
            <main
              className={cn(
                "container border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] rounded-xl mx-auto flex min-h-screen flex-col gap-4 px-2 md:px-4"
              )}
            >
              <Toaster />
              {children}
            </main>
            <Footer />
          </BGGrid>
        </div>
      </body>
    </html>
  );
}
