import type { Metadata } from "next";
import { Space_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerRail from "@/components/instruments/TickerRail";
import { SITE_URL } from "@/lib/site";
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
    // Kept ≲60 chars so Google doesn't truncate the SERP title.
    default: "Jayraj Jadeja — Backend & Distributed Systems",
    template: "%s | J. JADEJA",
  },
  description:
    "Backend and distributed-systems engineer who reads markets and distributed systems through the same lens — Temporal workflows, multi-region data movement, event-driven scaling, and the market structure underneath.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  // Declared explicitly because setting `icons` overrides Next's file-based
  // auto-detection wholesale. favicon.ico moved to public/ so its size is
  // stated accurately here (Next mis-inferred 256x256 from the .ico bytes).
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
    ],
    apple: { url: "/apple-icon", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "Jayraj Jadeja — Backend & Distributed Systems · Finance × Engineering",
    description: "Backend and distributed-systems engineer who reads markets and distributed systems through the same lens.",
    url: SITE_URL,
    siteName: "Jayraj Jadeja",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayraj Jadeja — Backend & Distributed Systems · Finance × Engineering",
    description: "Backend and distributed-systems engineer who reads markets and distributed systems through the same lens.",
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
      <body className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-sm font-mono text-sm"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  name: "Jayraj Jadeja",
                  url: SITE_URL,
                  jobTitle: "Software Engineer",
                  sameAs: [
                    "https://github.com/jayrajadeja",
                    "https://www.linkedin.com/in/jayrajadeja/",
                    "https://substack.com/@jayrajadeja",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: "Jayraj Jadeja",
                  url: SITE_URL,
                  publisher: { "@id": `${SITE_URL}/#person` },
                },
              ],
            }),
          }}
        />
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
