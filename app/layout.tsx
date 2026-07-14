import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Noto_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { BoxProvider } from "@/context/BoxContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const notoSans = Noto_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CashingTech — Sell Your Phone, Tablet, or Laptop for Cash",
  description:
    "Turn clutter into cash. Sell your used electronics in minutes with instant quotes, free shipping, and fast payments.",
  icons: {
    icon: [
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
    ],
  },
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
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${notoSans.variable}`}
      >
        <body className="antialiased bg-cream text-ink font-sans">
          <ThemeProvider>
            <LocaleProvider>
              <BoxProvider>
                <Header />
                <main>{children}</main>
                <Footer />
              </BoxProvider>
            </LocaleProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
