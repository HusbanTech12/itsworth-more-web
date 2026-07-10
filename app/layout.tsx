import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { BoxProvider } from "@/context/BoxContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "ItsWorthMore — Sell Your Phone, Tablet, or Laptop for Cash",
  description:
    "Turn clutter into cash. Sell your used electronics in minutes with instant quotes, free shipping, and fast payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      } as any}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <body className="antialiased bg-white text-zinc-900 font-sans">
          <LocaleProvider>
            <BoxProvider>
              <AnnouncementBar />
              <Header />
              <main>{children}</main>
              <Footer />
            </BoxProvider>
          </LocaleProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
