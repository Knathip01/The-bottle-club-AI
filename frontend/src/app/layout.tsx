import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "The Bottle Club - Premium Wine Delivery",
  description: "Shop curated red, white, rose, and sparkling wines from The Bottle Club with a modern member experience.",
};

import AIChat from "@/components/AIChat";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-stone-900`}
      >
        <LanguageProvider>
          {children}
          <AIChat />
        </LanguageProvider>
      </body>
    </html>
  );
}
