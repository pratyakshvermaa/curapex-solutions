import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollMotion from "@/components/ScrollMotion";
import SmoothScroll from "@/components/SmoothScroll";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const display = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Curapex Solutions — Pharmaceutical Catalog",
    template: "%s | Curapex Solutions",
  },
  description:
    "Curapex Solutions supplies pharmaceutical tablets, capsules, injections, and specialty medicines for wholesale and export enquiries.",
  metadataBase: new URL("https://curapex-solutions.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-teal focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="min-h-[70vh]">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
        <SmoothScroll />
        <ScrollMotion />
      </body>
    </html>
  );
}
