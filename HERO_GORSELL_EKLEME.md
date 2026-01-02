# Hero Bölümüne Görsel/Video Ekleme Rehberi

## 📁 Dosya Yerleştirme

### Görsel için:
1. Görselinizi `public/` klasörüne ekleyin
2. Örnek: `public/hero-image.jpg` veya `public/hero-background.png`

### Video için:
1. Video dosyanızı `public/` klasörüne ekleyin
2. Örnek: `public/hero-video.mp4`

## 🖼️ Görsel Kullanımı

### Adım 1: Görseli ekleyin
Görselinizi `public/` klasörüne kopyalayın.

### Adım 2: Hero.tsx dosyasını düzenleyin
`components/Hero.tsx` dosyasını açın ve 70. satırdaki `backgroundImage` satırını bulun:

```typescript
backgroundImage: "url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80)",
```

Bunu kendi görselinizle değiştirin:

```typescript
backgroundImage: "url(/hero-image.jpg)",
```

**Önemli:** Dosya adını tam olarak yazın (büyük/küçük harf duyarlı).

## 🎥 Video Kullanımı

### Adım 1: Video'yu ekleyin
Video dosyanızı `public/` klasörüne kopyalayın (örn: `hero-video.mp4`).

### Adım 2: Hero.tsx dosyasını düzenleyin
`components/Hero.tsx` dosyasında:

1. **Video'yu aktif edin:**
   ```typescript
   <video
     ref={videoRef}
     autoPlay
     loop
     muted
     playsInline
     style={{ display: "block" }}  // "none" yerine "block"
   >
     <source src="/hero-video.mp4" type="video/mp4" />
   </video>
   ```

2. **Background image'i kaldırın veya yorum satırı yapın:**
   ```typescript
   // backgroundImage: "url(/hero-image.jpg)",  // Video kullanıyorsanız bu satırı kaldırın
   ```

## 📝 Örnek Dosya Yapısı

```
public/
├── hero-image.jpg          # Görsel için
├── hero-video.mp4          # Video için
└── ...
```

## 💡 İpuçları

1. **Görsel boyutu:** Hero görseli için 1920x1080 veya daha büyük çözünürlük önerilir
2. **Video formatı:** MP4 formatı en iyi uyumluluk sağlar
3. **Dosya boyutu:** Büyük dosyalar yavaş yüklenebilir, optimize edin
4. **Dosya adı:** Türkçe karakter ve boşluk kullanmayın (örn: `hero-gorsel.jpg` ✅, `hero görsel.jpg` ❌)

## 🔄 Değişiklikleri Görmek

Dosyaları ekledikten ve kodu güncelledikten sonra:

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın ve değişiklikleri görün.

