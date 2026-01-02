# Onuralp Başar - Portföy Websitesi

Modern luxury tarzda video prodüksiyon ve sosyal medya yönetimi portföy sitesi.

## Özellikler

- 🎬 Video galeri (yatay ve dikey format desteği)
- 🏢 Referanslar bölümü (marka logoları)
- 📋 Hizmetler bölümü
- 🎥 Ekipmanlar bölümü
- 📧 İletişim formu
- 📱 Tam responsive tasarım
- ⚡ Next.js 14 ile yüksek performans

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
├── app/
│   ├── layout.tsx      # Ana layout
│   ├── page.tsx        # Ana sayfa
│   └── globals.css     # Global stiller
├── components/
│   ├── Navigation.tsx   # Navigasyon menüsü
│   ├── Hero.tsx        # Ana hero bölümü
│   ├── VideoGallery.tsx # Video galeri
│   ├── References.tsx   # Referanslar
│   ├── Services.tsx     # Hizmetler
│   ├── Equipment.tsx    # Ekipmanlar
│   └── Contact.tsx      # İletişim
└── public/              # Statik dosyalar (videolar, görseller)
```

## İçerik Güncelleme

### Videolar

`components/VideoGallery.tsx` dosyasındaki `videos` array'ini kendi videolarınızla güncelleyin:

```typescript
const videos: Video[] = [
  {
    id: "1",
    title: "Video Başlığı",
    thumbnail: "/video-thumb-1.jpg",
    videoUrl: "/video-1.mp4",
    orientation: "horizontal", // veya "vertical"
    description: "Video açıklaması",
  },
  // ...
];
```

Videoları `public/` klasörüne ekleyin.

### Referanslar

`components/References.tsx` dosyasındaki `brands` array'ini güncelleyin ve logoları `public/brands/` klasörüne ekleyin.

### Ekipmanlar

`components/Equipment.tsx` dosyasındaki `equipment` array'ini kendi ekipmanlarınızla güncelleyin.

### Hero Video

Ana sayfadaki hero bölümü için arka plan videosunu `public/hero-video.mp4` olarak ekleyin.

## Build

```bash
npm run build
npm start
```

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- React 18

## Lisans

Bu proje özel kullanım içindir.

