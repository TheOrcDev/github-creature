import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";
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
  subsets: ["latin"],
  variable: "--font-handwritten",
  weight: "400",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "It's a fun way to showcase your skills and contributions to the open source community. Just enter your GitHub profile URL and get your inner creature.",
  icons: {
    icon: "/github-creature-logo.png",
  },
  metadataBase: new URL("https://www.githubcreature.com"),
  openGraph: {
    images: [
      {
        alt: "GitHub Creature",
        height: 630,
        url: "/github-creature-og.png",
        width: 1200,
      },
    ],
  },
  title: "GitHub Creature - Summon the Creature Behind Your Code",
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
