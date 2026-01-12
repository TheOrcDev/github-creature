import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import {
  Geist,
  Geist_Mono,
  Island_Moments,
  Nunito_Sans,
} from "next/font/google";

import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Footer } from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
const nunitoSans = Nunito_Sans({ variable: "--font-sans" });
const islandMoments = Island_Moments({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Creature - Summon the Creature Behind Your Code",
  description:
    "It's a fun way to showcase your skills and contributions to the open source community. Just enter your GitHub profile URL and get your inner creature.",
  icons: {
    icon: "/github-creature-logo.png",
  },
  openGraph: {
    images: [
      {
        url: "/github-creature-og.png",
        width: 1200,
        height: 630,
        alt: "GitHub Creature",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/github-creature-og.png"],
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
      className={`${nunitoSans.variable} ${islandMoments.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
