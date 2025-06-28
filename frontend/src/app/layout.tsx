import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/provider/providers";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthModalProviderWrapper } from "@/components/auth/AuthModalProviderWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Modern Blog - Human stories & ideas",
  description: "A place to read, write, and deepen your understanding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <AuthModalProviderWrapper>
            <Providers>{children}</Providers>
          </AuthModalProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
