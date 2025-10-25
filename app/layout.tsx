import type { Metadata } from "next";
import { Geist, Geist_Mono, Gloria_Hallelujah } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comicRelief = Gloria_Hallelujah({
  variable: "--font-comic-relief",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cursor KE",
  description: "Cursor KE Memories - Building the future with AI-powered development",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Cursor KE",
    description: "Join Kenya's premier AI-powered development community. Share memories from meetups and hackathons.",
    url: "https://cursor-ke.vercel.app",
    siteName: "Cursor KE",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Cursor KE Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursor KE",
    description: "Join Kenya's premier AI-powered development community.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comicRelief.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
