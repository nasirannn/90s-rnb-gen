import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { NavbarWrapper } from "@/components/layout/navbar-wrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreditsProvider } from "@/contexts/CreditsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "90s R&B Generator - AI-Powered Music Creation",
  description: "Create authentic 90s R&B music with AI. Generate professional-quality tracks in New Jack Swing, Hip-Hop Soul, Quiet Storm, and Neo-Soul genres.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning className="dark">
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <AuthProvider>
          <CreditsProvider>
            <ThemeProvider>
              <NavbarWrapper />

              {children}
            </ThemeProvider>
          </CreditsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
