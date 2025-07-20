import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/e_commerce/contexts/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Innovation Marketplace",
  description: "A marketplace for innovative products and services",
  icons: {
    icon: '/images/marketplace.png',
    shortcut: '/images/marketplace.png',
    apple: '/images/marketplace.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <CartProvider>
          {children}
         </CartProvider>
      </body>
    </html>
  );
}
