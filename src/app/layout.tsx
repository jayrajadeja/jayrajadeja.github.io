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
    default: "JAYRAJ JADEJA | Software Engineer",
    template: "%s | J. JADEJA",
  },
  description:
    "Backend & distributed systems engineer. I take systems apart to see how they tick — Temporal workflows, multi-region data movement, event-driven scaling, and the markets underneath.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jayraj Jadeja — Software Engineer",
    description: "Backend & distributed systems engineer. I take systems apart to see how they tick.",
    url: SITE_URL,
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&icon_names=code,description,edit_note,mail,north_east,work&display=block"
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  name: "Jayraj Jadeja",
                  url: SITE_URL,
                  jobTitle: "Software Engineer",
                  sameAs: [
                    "https://github.com/jayrajadeja",
                    "https://www.linkedin.com/in/jayrajadeja/",
                    "https://substack.com/@jayrajadeja",
                  ],
                },
                { "@type": "WebSite", name: "Jayraj Jadeja", url: SITE_URL },
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
