import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AgeVerification from "@/components/AgeVerification";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "exxclusiveservicex | El Directorio VIP Más Exclusivo",
    template: "%s | exxclusiveservicex",
  },
  description:
    "Descubre los perfiles VIP más exclusivos. Conexiones reales, discreción absoluta y experiencias de alto nivel. El marketplace líder de compañía premium.",
  keywords: [
    "servicios vip",
    "citas exclusivas",
    "directorio premium",
    "encuentros discretos",
    "acompañantes de lujo",
    "exxclusiveservicex",
  ],
  authors: [
    {
      name: "exxclusiveservicex",
      url: "https://exxclusiveservicex.vercel.app",
    },
  ],
  creator: "exxclusiveservicex",
  publisher: "exxclusiveservicex",
  metadataBase: new URL("https://exxclusiveservicex.vercel.app"),
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    rating: "adult",
    "RTA-5042-1996-1400-1577-RTA": "adult",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://exxclusiveservicex.vercel.app",
    title: "exxclusiveservicex | Experiencias y Perfiles VIP",
    description:
      "El marketplace de lujo para servicios exclusivos. Seguridad, discreción y perfiles 100% verificados.",
    siteName: "exxclusiveservicex",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "exxclusiveservicex - Lujo y Discreción",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "exxclusiveservicex | Experiencias VIP",
    description:
      "El marketplace de lujo para servicios exclusivos y discretos.",
    creator: "@exxclusiveservicex",
    images: ["/og-image.jpg"],
  },
  appleWebApp: {
    capable: true,
    title: "exxclusiveservicex",
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AgeVerification />
        {children}
      </body>
    </html>
  );
}
