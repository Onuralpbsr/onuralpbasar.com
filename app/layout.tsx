import type { Metadata, Viewport } from "next";
import { Great_Vibes } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
});

export const metadata: Metadata = {
  title: "ONR Dijital Medya Ajansı | Video Prodüksiyon & Sosyal Medya Yönetimi",
  description:
    "Adana, Mersin ve Gaziantep'te profesyonel video prodüksiyon, drone çekimi, sosyal medya yönetimi ve dijital pazarlama hizmetleri. ONR Dijital Medya Ajansı.",
  keywords: [
    "video prodüksiyon",
    "sosyal medya yönetimi",
    "drone çekimi",
    "dijital pazarlama",
    "reklam filmi",
    "tanıtım filmi",
    "reels",
    "Adana video prodüksiyon",
    "Mersin dijital medya",
    "Gaziantep sosyal medya",
    "ONR Dijital",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo-dark-bg.svg",
    shortcut: "/logo-dark-bg.svg",
    apple: "/logo-dark-bg.svg",
  },
  openGraph: {
    title: "ONR Dijital Medya Ajansı | Video Prodüksiyon & Sosyal Medya",
    description:
      "Adana, Mersin ve Gaziantep'te profesyonel video prodüksiyon, drone çekimi ve sosyal medya yönetimi.",
    url: "https://onuralpbasar.com",
    siteName: "ONR Dijital Medya Ajansı",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://onuralpbasar.com/logo-dark-bg.svg",
        width: 1200,
        height: 630,
        alt: "ONR Dijital Medya Ajansı — Video Prodüksiyon & Sosyal Medya Yönetimi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONR Dijital Medya Ajansı | Video Prodüksiyon",
    description:
      "Profesyonel video prodüksiyon, drone çekimi ve sosyal medya yönetimi. Adana · Mersin · Gaziantep",
    images: ["https://onuralpbasar.com/logo-dark-bg.svg"],
  },
  alternates: {
    canonical: "https://onuralpbasar.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f89821",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://onuralpbasar.com/#business",
  name: "ONR Dijital Medya Ajansı",
  alternateName: "Onuralp Başar Dijital Medya",
  description:
    "Profesyonel video prodüksiyon, drone çekimi, sosyal medya yönetimi ve dijital pazarlama ajansı. Adana, Mersin ve Gaziantep hizmet bölgesi.",
  url: "https://onuralpbasar.com",
  logo: "https://onuralpbasar.com/logo-dark-bg.svg",
  image: "https://onuralpbasar.com/logo-dark-bg.svg",
  telephone: "+905050392886",
  email: "info@onuralpbsr.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Adana",
    addressRegion: "Adana",
    addressCountry: "TR",
  },
  areaServed: [
    { "@type": "City", name: "Adana" },
    { "@type": "City", name: "Mersin" },
    { "@type": "City", name: "Gaziantep" },
  ],
  priceRange: "₺₺-₺₺₺₺",
  sameAs: [
    "https://www.instagram.com/onuralpbsr",
    "https://www.linkedin.com/in/onuralpbasar/",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dijital Medya Hizmetleri",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Video Prodüksiyon" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Drone Çekimi" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Sosyal Medya Yönetimi" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Dijital Pazarlama" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Meta Ads & Google Ads" },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={greatVibes.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
