import type { Metadata } from "next";
import { Space_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerRail from "@/components/instruments/TickerRail";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JAYRAJ JADEJA | Software Engineer",
    template: "%s | J. JADEJA",
  },
  description:
    "Backend & distributed systems engineer. I take systems apart to see how they tick — Temporal workflows, multi-region data movement, event-driven scaling, and the markets underneath.",
  metadataBase: new URL("https://jayrajadeja.github.io"),
  openGraph: {
    title: "Jayraj Jadeja — Software Engineer",
    description: "Backend & distributed systems engineer. I take systems apart to see how they tick.",
    url: "https://jayrajadeja.github.io",
    siteName: "Jayraj Jadeja",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayraj Jadeja — Software Engineer",
    description: "Backend & distributed systems engineer. I take systems apart to see how they tick.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-sm font-mono text-sm"
        >
          Skip to content
        </a>
        <header className="fixed top-0 inset-x-0 z-50">
          <Navbar />
          <TickerRail />
        </header>
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
