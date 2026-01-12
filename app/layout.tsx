import type { Metadata, Viewport } from "next";
import { Great_Vibes } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
});

export const metadata: Metadata = {
  title: "Onuralp Başar | Video Prodüksiyon & Sosyal Medya Yönetimi",
  description: "Video prodüksiyon, tanıtım ve reklam videoları, sosyal medya yönetimi hizmetleri. Profesyonel çekim ve montaj süreçleri",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={greatVibes.variable}>
      <body>{children}</body>
    </html>
  );
}

