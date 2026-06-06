import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
});

// Absolute base for resolving og:image. Override per-environment via
// NEXT_PUBLIC_SITE_URL (e.g. the workers.dev or custom domain); falls back to
// the production domain so the social card resolves to an absolute URL.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hackdraft.com";
const TITLE = "HackDraft — 3 hackathon ideas in one click";
const DESCRIPTION =
  "Pick your available time and a topic, get 3 curated hackathon project ideas. Built for developers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "HackDraft",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "HackDraft — 3 hackathon ideas in one click",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
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
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
