import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-heading-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = "https://www.mavenenterprise.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maven Enterprise Ltd | Premium Interior Supplies & Installation in Kenya",
    template: "%s | Maven Enterprise Ltd",
  },
  description:
    "Maven Enterprise Ltd supplies and installs premium interior décor, sanitary ware, kitchen fittings, flooring, lighting and plumbing products across Nairobi and Kenya. Trusted by homeowners, architects, contractors and developers.",
  keywords: [
    "Interior Supplies Kenya",
    "Interior Design Kenya",
    "Bathroom Fixtures Kenya",
    "Gypsum Installation Nairobi",
    "PVC Ceiling Kenya",
    "Wall Panels Kenya",
    "Flooring Installation Kenya",
    "Sanitary Ware Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Maven Enterprise Ltd",
    title: "Maven Enterprise Ltd | Premium Interior Supplies & Installation in Kenya",
    description:
      "Quality interior décor, plumbing fixtures, sanitary ware, finishing materials and expert installation services across Kenya.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Maven Enterprise Ltd | Premium Interior Supplies & Installation in Kenya",
    description:
      "Quality interior décor, plumbing fixtures, sanitary ware, finishing materials and expert installation services across Kenya.",
  },
  alternates: {
    canonical: "/",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
