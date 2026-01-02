/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export sadece production build için
  // Development'ta API route'ları çalışması için kaldırıldı
  // Production'da static export yapmak isterseniz: output: "export"
  images: {
    unoptimized: true
  }
};

export default nextConfig;