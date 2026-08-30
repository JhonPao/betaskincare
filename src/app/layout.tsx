import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BetaSkinCare - K-Beauty Skincare Original | Tienda Online Perú",
  description: "BetaSkinCare: tienda peruana de skincare coreano original. Descubre protectores solares, maquillaje K-Beauty y más. Envíos a todo Perú.",
  keywords: ["k-beauty", "skincare coreano", "protector solar", "coreano", "maquillaje coreano", "betaskincare", "lima", "perú"],
  authors: [{ name: "BetaSkinCare" }],
  robots: "index, follow",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
