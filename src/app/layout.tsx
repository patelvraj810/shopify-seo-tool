import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopify SEO Tool — Simple, Affordable SEO for Shopify Stores",
  description: "A $29/mo alternative to Ahrefs built for Shopify. Keyword tracking, competitor gaps, broken link scanning, and one-click fixes — all in one dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-[var(--card-border)] py-8 text-center text-sm text-[var(--muted)]">
          <p>© {new Date().getFullYear()} Shopify SEO Tool — Simple SEO for Shopify Stores</p>
        </footer>
      </body>
    </html>
  );
}