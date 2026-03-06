import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import SiteShell from "../components/SiteShell";
import Cursor from "../components/Cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Emara",
  description: "Resume and professional projects",
  icons: {
    icon: [{ url: "/icon.jpg", type: "image/jpg" }],
    shortcut: ["/icon.jpg"],
    apple: [{ url: "/icon.jpg", sizes: "180x180", type: "image/jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased custom-cursor`}>
        <Cursor />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
