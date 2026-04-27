import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "The Bottle Club - ร้านไวน์ออนไลน์ระดับพรีเมียม",
  description: "he Bottle Club – เลือกซื้อไวน์คุณภาพเยี่ยม ไวน์แดง ไวน์ขาว ไวน์โรเซ่ และสปาร์คกลิ้ง จัดส่งทั่วประเทศไทย",
};

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
        {children}
      </body>
    </html>
  );
}
