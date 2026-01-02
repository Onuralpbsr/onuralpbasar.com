# Video Kapak Fotoğrafları Ekleme Rehberi

Bu rehber, videolar bölümündeki kapak fotoğraflarını (thumbnail) nasıl ekleyeceğinizi adım adım açıklar.

## 📸 Adım 1: Kapak Fotoğraflarını Hazırlama

1. Her video için bir kapak fotoğrafı hazırlayın
2. **Önerilen format:** JPG veya PNG
3. **Önerilen boyutlar:**
   - Yatay videolar için: 1920x1080 piksel (16:9 oran)
   - Dikey videolar için: 1080x1920 piksel (9:16 oran)
4. Fotoğrafları kaliteli ve net olmalı, videonun içeriğini yansıtmalı

## 📁 Adım 2: Dosyaları Public Klasörüne Ekleme

1. Projenizin `public/` klasörünü açın
2. Kapak fotoğraflarınızı bu klasöre kopyalayın
3. Dosya isimlerini dikkatli seçin (Türkçe karakter ve boşluk kullanmaktan kaçının)

### Örnek Dosya Yapısı:

```
public/
├── Nikopolis_Otel_p 2.jpg          ✅ Mevcut
├── Video-thumb-2.jpg               ✅ Mevcut
├── video-thumb-3.jpg               ❌ Eklenecek
├── video-thumb-4.jpg               ❌ Eklenecek
├── video-thumb-5.jpg               ❌ Eklenecek
├── video-thumb-6.jpg               ❌ Eklenecek
├── video-thumb-7.jpg               ❌ Eklenecek
└── video-thumb-8.jpg               ❌ Eklenecek
```

## 🔧 Adım 3: VideoGallery.tsx Dosyasını Güncelleme

1. `components/VideoGallery.tsx` dosyasını açın
2. 15-80 satırları arasındaki `videos` array'ini bulun
3. Her video için `thumbnail` alanını güncelleyin

### Örnek:

```typescript
const videos: Video[] = [
  {
    id: "1",
    title: "Nikopolis Otel Yılbaşı Videosu",
    thumbnail: "/Nikopolis_Otel_p 2.jpg",  // ✅ Zaten ekli
    videoUrl: "/Nikopolis Otel.mp4",
    orientation: "vertical",
    description: "Sosyal Medya videosu",
  },
  {
    id: "3",
    title: "Tanıtım Videosu 2",
    thumbnail: "/video-thumb-3.jpg",  // ⬅️ Buraya ekleyin
    videoUrl: "/video-3.mp4",
    orientation: "horizontal",
    description: "Ürün tanıtım videosu",
  },
  // ... diğer videolar
];
```

## ⚠️ Önemli Notlar

### Dosya Yolu Formatı:
- Dosya yolu her zaman `/` ile başlamalı (örn: `/video-thumb-3.jpg`)
- Dosya adında boşluk varsa, dosya yolunda da boşluk olmalı (örn: `/Nikopolis_Otel_p 2.jpg`)
- Türkçe karakterler kullanılabilir, ancak önerilmez

### Dosya Adlandırma Önerileri:
✅ İyi örnekler:
- `video-thumb-3.jpg`
- `nikopolis-otel-thumb.jpg`
- `tekin-yapi-thumb.jpg`

❌ Kötü örnekler:
- `Video Thumb 3.jpg` (boşluklar sorun çıkarabilir)
- `video_thumb_3.jpg` (alt çizgi yerine tire kullanın)

## 🎨 Kapak Fotoğrafı İpuçları

1. **Videodan bir kare yakalayın:** Video oynatıcıdan en iyi anı yakalayıp ekran görüntüsü alın
2. **Net ve parlak olmalı:** Bulanık veya karanlık görseller kullanmayın
3. **Videoyu yansıtmalı:** Kapak fotoğrafı videonun içeriğini doğru şekilde temsil etmeli
4. **Boyut optimizasyonu:** Dosya boyutunu küçük tutun (100-500 KB arası ideal)

## ✅ Kontrol Listesi

Kapak fotoğraflarını ekledikten sonra:

- [ ] Tüm kapak fotoğrafları `public/` klasörüne eklendi
- [ ] `VideoGallery.tsx` dosyasındaki `thumbnail` alanları güncellendi
- [ ] Dosya yolları doğru yazıldı (`/` ile başlıyor)
- [ ] `npm run dev` ile test edildi
- [ ] Tarayıcıda kapak fotoğrafları görünüyor

## 🚀 Test Etme

1. Terminal'de proje klasörüne gidin:
```bash
cd /Users/onuralpbasar/Desktop/Portföy
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın
4. "Videolar" bölümüne scroll yapın
5. Kapak fotoğraflarının göründüğünü kontrol edin

## 🔍 Sorun Giderme

### Kapak fotoğrafı görünmüyor:
1. Dosya yolunun doğru olduğundan emin olun (`/` ile başlamalı)
2. Dosya adının birebir eşleştiğini kontrol edin (büyük/küçük harf duyarlı)
3. Dosyanın `public/` klasöründe olduğundan emin olun
4. Tarayıcı konsolunda (F12) hata mesajlarını kontrol edin

### Görsel bozuk görünüyor:
1. Görsel formatının JPG veya PNG olduğundan emin olun
2. Görsel boyutlarının uygun olduğunu kontrol edin
3. Dosyanın bozuk olmadığını kontrol edin

---

**Not:** Kapak fotoğrafları artık otomatik olarak gösterilecek. Eğer bir video için kapak fotoğrafı yoksa, sadece play butonu görünecektir.

