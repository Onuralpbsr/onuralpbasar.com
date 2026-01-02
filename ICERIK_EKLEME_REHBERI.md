# İçerik Ekleme Rehberi

Bu rehber, portföy sitenize video, resim, referans, hizmet, ekipman ve iletişim bilgileri ekleme konusunda adım adım talimatlar içermektedir.

---

## 📁 Dosya Yapısı

Tüm medya dosyaları (videolar, resimler, logolar) `public/` klasörüne eklenmelidir.

```
public/
├── videolar/
│   ├── video-ismi.mp4
│   └── ...
├── brands/
│   ├── brand-1.png
│   └── ...
└── ...
```

---

## 🎬 1. Video Galeri - Video Ekleme

### Dosya Konumu
`components/VideoGallery.tsx`

### Adımlar

1. **Video dosyasını ekleyin:**
   - Video dosyanızı `public/` klasörüne kopyalayın
   - Örnek: `public/Yeni_Video.mp4`

2. **Kapak fotoğrafını ekleyin:**
   - Kapak fotoğrafını `public/` klasörüne kopyalayın
   - Örnek: `public/Yeni_Video_p 2.png` veya `Yeni_Video_thumbnail.jpg`

3. **Video verisini ekleyin:**
   - `VideoGallery.tsx` dosyasını açın
   - `videos` dizisini bulun (yaklaşık 74. satır)
   - Yeni bir video objesi ekleyin:

```typescript
{
  id: "12", // Benzersiz bir ID (sıradaki numara)
  title: "Video Başlığı", // Video başlığı
  thumbnail: "/Yeni_Video_p 2.png", // Kapak fotoğrafı yolu (public/ ile başlamadan)
  videoUrl: "/Yeni_Video.mp4", // Video dosyası yolu (public/ ile başlamadan)
  orientation: "vertical", // "vertical" veya "horizontal"
  description: "Video açıklaması", // Opsiyonel açıklama
}
```

### Örnek

```typescript
const videos: Video[] = [
  // ... mevcut videolar
  {
    id: "12",
    title: "Yeni Proje",
    thumbnail: "/Yeni_Proje_p 2.png",
    videoUrl: "/Yeni_Proje.mp4",
    orientation: "vertical",
    description: "Tanıtım Videosu",
  },
];
```

### Önemli Notlar

- **ID**: Her video için benzersiz bir ID kullanın (string formatında)
- **Orientation**: 
  - `"vertical"` → Dikey videolar (Instagram Stories, TikTok formatı)
  - `"horizontal"` → Yatay videolar (YouTube, Facebook formatı)
- **Dosya yolları**: `public/` klasöründeki dosyalara `/dosya-adi.mp4` şeklinde erişilir
- **Kapak fotoğrafı**: Video kartında görünecek görsel. Eğer yoksa, video ilk karesi gösterilir

---

## 🏢 2. Referanslar - Marka/Logo Ekleme

### Dosya Konumu
`components/References.tsx`

### Adımlar

1. **Logo dosyasını ekleyin:**
   - Logo dosyanızı `public/brands/` klasörüne kopyalayın
   - Örnek: `public/brands/yeni-marka-logo.png`

2. **Marka verisini ekleyin:**
   - `References.tsx` dosyasını açın
   - `brands` dizisini bulun (yaklaşık 13. satır)
   - Yeni bir marka objesi ekleyin:

```typescript
{
  id: "7", // Benzersiz bir ID
  name: "Marka Adı", // Marka ismi (tıklanabilir link metni)
  logo: "/brands/yeni-marka-logo.png", // Logo dosyası yolu
  website: "https://marka-websitesi.com", // Opsiyonel: Marka web sitesi
}
```

### Örnek

```typescript
const brands: Brand[] = [
  // ... mevcut markalar
  {
    id: "7",
    name: "Yeni Marka",
    logo: "/brands/yeni-marka-logo.png",
    website: "https://yeni-marka.com",
  },
];
```

### Önemli Notlar

- **Logo formatı**: PNG, JPG, SVG gibi formatlar desteklenir
- **Website**: Eğer `website` belirtilmezse, marka ismi sadece metin olarak görünür (tıklanamaz)
- **Logo boyutu**: Logolar otomatik olarak kutucuk içine sığacak şekilde ölçeklenir
- **Logo önerileri**: 
  - Şeffaf arka planlı PNG kullanın
  - Beyaz veya açık renkli logolar tercih edilir (karanlık arka plan için)

---

## 🛠️ 3. Hizmetler - Hizmet Ekleme

### Dosya Konumu
`components/Services.tsx`

### Adımlar

1. **Hizmet verisini ekleyin:**
   - `Services.tsx` dosyasını açın
   - `services` dizisini bulun (yaklaşık 11. satır)
   - Yeni bir hizmet objesi ekleyin:

```typescript
{
  id: "5", // Benzersiz bir ID
  title: "Hizmet Başlığı", // Hizmet başlığı
  description: "Hizmet açıklaması. Detaylı bilgi buraya yazılabilir.", // Hizmet açıklaması
}
```

### Örnek

```typescript
const services: Service[] = [
  // ... mevcut hizmetler
  {
    id: "5",
    title: "Animasyon Videoları",
    description: "2D ve 3D animasyon teknikleri ile marka hikayelerinizi görselleştiriyorum.",
  },
];
```

### Önemli Notlar

- Hizmetler otomatik olarak numaralandırılır (01, 02, 03...)
- Her hizmet kartında sol tarafta dekoratif bir çizgi ve sağ üstte numara badge'i bulunur
- Hover efekti ile kartlar vurgulanır

---

## 📦 4. Ekipmanlar - Ekipman Ekleme

### Dosya Konumu
`components/Equipment.tsx`

### Adımlar

1. **Ekipman verisini ekleyin:**
   - `Equipment.tsx` dosyasını açın
   - `equipment` dizisini bulun (yaklaşık 16. satır)
   - Yeni bir ekipman objesi ekleyin:

```typescript
{
  id: "7", // Benzersiz bir ID
  name: "Ekipman Adı", // Ekipman ismi
  category: "Kategori Adı", // Kategori (mevcut kategorilerden biri veya yeni)
  description: "Ekipman açıklaması", // Opsiyonel açıklama
}
```

2. **Yeni kategori eklemek isterseniz:**
   - `categories` dizisini bulun (yaklaşık 55. satır)
   - Yeni kategoriyi ekleyin:

```typescript
const categories = [
  "Tümü",
  "Çekim Ekipmanları",
  "Ses Ekipmanları",
  "Işıklandırma",
  "Yazılım",
  "Yeni Kategori", // Yeni kategori buraya eklenir
];
```

### Örnek

```typescript
const equipment: EquipmentItem[] = [
  // ... mevcut ekipmanlar
  {
    id: "7",
    name: "4K Monitör",
    category: "Yazılım",
    description: "Yüksek çözünürlüklü renk kalibrasyonlu monitör",
  },
];
```

### Önemli Notlar

- **Kategoriler**: Ekipmanlar kategoriye göre filtrelenebilir
- **Mevcut kategoriler**: 
  - Çekim Ekipmanları
  - Ses Ekipmanları
  - Işıklandırma
  - Yazılım
- Ekipmanlar grid düzeninde gösterilir ve kategori filtresine göre dinamik olarak güncellenir

---

## 📞 5. İletişim - İletişim Bilgileri Güncelleme

### Dosya Konumu
`components/Contact.tsx`

### Adımlar

1. **Telefon numarası güncelleme:**
   - `Contact.tsx` dosyasını açın
   - Telefon numarasını bulun (yaklaşık 187. satır)
   - Güncelleyin:

```typescript
<a
  href="tel:+905050392886" // Telefon numarası (uluslararası format)
  className="..."
>
  +90 505 039 28 86 // Görünen telefon numarası
</a>
```

2. **E-posta adresi güncelleme:**
   - E-posta adreslerini bulun (yaklaşık 198-209. satırlar)
   - Güncelleyin:

```typescript
<a
  href="mailto:info@onuralpbsr.com" // E-posta adresi
  className="..."
>
  info@onuralpbsr.com // Görünen e-posta
</a>
```

3. **Konum bilgisi güncelleme:**
   - Konum bilgisini bulun (yaklaşık 216. satır)
   - Güncelleyin:

```typescript
<div className="text-white/80 font-normal">
  Adana, Turkey // Konum bilgisi
</div>
```

4. **Web sitesi güncelleme:**
   - Web sitesi linkini bulun (yaklaşık 224. satır)
   - Güncelleyin:

```typescript
<a
  href="https://onuralpbasar.com" // Web sitesi URL'i
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  onuralpbasar.com // Görünen web sitesi
</a>
```

5. **Sosyal medya linkleri güncelleme:**
   - Instagram linkini bulun (yaklaşık 242. satır)
   - LinkedIn linkini bulun (yaklaşık 257. satır)
   - Güncelleyin:

```typescript
<a
  href="https://www.instagram.com/onuralpbsr?..." // Instagram URL'i
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  {/* Instagram SVG ikonu */}
</a>
```

### Önemli Notlar

- Tüm linkler yeni sekmede açılır (`target="_blank"`)
- Telefon numaraları `tel:` protokolü ile tıklanabilir hale getirilir
- E-posta adresleri `mailto:` protokolü ile tıklanabilir hale getirilir

---

## 🎥 6. Arka Plan Videoları - Bölümlere Video Ekleme

### Hero Bölümü (Ana Sayfa)

**Dosya Konumu:** `components/Hero.tsx`

**Video dosyası:** `public/videographer.mp4`

**Değiştirme:**
1. Yeni video dosyasını `public/` klasörüne ekleyin
2. `Hero.tsx` dosyasını açın
3. Video kaynağını bulun (yaklaşık 150. satır):

```typescript
<source src="/videographer.mp4" type="video/mp4" />
```

4. Dosya adını güncelleyin:

```typescript
<source src="/yeni-video.mp4" type="video/mp4" />
```

### Hizmetler Bölümü

**Dosya Konumu:** `components/Services.tsx`

**Video dosyası:** `public/Videographer_2.mp4`

**Değiştirme:**
1. Yeni video dosyasını `public/` klasörüne ekleyin
2. `Services.tsx` dosyasını açın
3. Video kaynağını bulun (yaklaşık 94. satır):

```typescript
<source src="/Videographer_2.mp4" type="video/mp4" />
```

4. Dosya adını güncelleyin

### Video Galeri Bölümü

**Dosya Konumu:** `components/VideoGallery.tsx`

**Video dosyası:** `public/Editor.mp4`

**Değiştirme:**
1. Yeni video dosyasını `public/` klasörüne ekleyin
2. `VideoGallery.tsx` dosyasını açın
3. Video kaynağını bulun (video referansını arayın)
4. Dosya adını güncelleyin

### Ekipmanlar Bölümü

**Dosya Konumu:** `components/Equipment.tsx`

**Video dosyası:** `public/Drone.mp4`

**Değiştirme:**
1. Yeni video dosyasını `public/` klasörüne ekleyin
2. `Equipment.tsx` dosyasını açın
3. Video kaynağını bulun (video referansını arayın)
4. Dosya adını güncelleyin

**Not:** Equipment bölümünde şu anda video yok gibi görünüyor. Video eklemek için `Equipment.tsx` dosyasına video elementi eklemeniz gerekebilir.

### İletişim Bölümü

**Dosya Konumu:** `components/Contact.tsx`

**Video dosyası:** `public/Natural_Videgrapher.mp4`

**Değiştirme:**
1. Yeni video dosyasını `public/` klasörüne ekleyin
2. `Contact.tsx` dosyasını açın
3. Video kaynağını bulun (yaklaşık 161. satır):

```typescript
<source src="/Natural_Videgrapher.mp4" type="video/mp4" />
```

4. Dosya adını güncelleyin

### Önemli Notlar

- Tüm arka plan videoları otomatik olarak oynatılır (muted, loop)
- Videolar sayfa görünümünden çıktığında otomatik olarak duraklatılır (performans için)
- Hero ve Contact bölümlerinde "fade to black" efekti vardır (video sonunda kararır, başta açılır)
- Video opacity ayarları:
  - Hero: %85 opacity + blur(3px)
  - Services: %50 opacity
  - Video Gallery: %50 opacity + blur(2px)
  - Contact: %50 opacity + fade effect

---

## 🖼️ 7. Resimler - Kapak Fotoğrafları ve Logolar

### Video Kapak Fotoğrafları

**Konum:** `public/` klasörü

**Format:** JPG, PNG

**Önerilen isimlendirme:**
- Video dosyası: `Proje_Adi.mp4`
- Kapak fotoğrafı: `Proje_Adi_p 2.png` veya `Proje_Adi_thumbnail.jpg`

**Eklemek için:**
1. Kapak fotoğrafını `public/` klasörüne kopyalayın
2. `VideoGallery.tsx` dosyasında video objesine `thumbnail` özelliğini ekleyin:

```typescript
{
  id: "12",
  title: "Proje Adı",
  thumbnail: "/Proje_Adi_p 2.png", // Kapak fotoğrafı yolu
  videoUrl: "/Proje_Adi.mp4",
  orientation: "vertical",
}
```

### Marka Logoları

**Konum:** `public/brands/` klasörü

**Format:** PNG (şeffaf arka planlı önerilir), JPG, SVG

**Eklemek için:**
1. Logo dosyasını `public/brands/` klasörüne kopyalayın
2. `References.tsx` dosyasında marka objesine `logo` özelliğini ekleyin:

```typescript
{
  id: "7",
  name: "Marka Adı",
  logo: "/brands/marka-logo.png", // Logo yolu
  website: "https://marka.com",
}
```

### Önemli Notlar

- **Kapak fotoğrafları**: Video kartlarında görünecek görseller. Eğer belirtilmezse, video ilk karesi gösterilir
- **Logo boyutları**: Logolar otomatik olarak kutucuk içine sığacak şekilde ölçeklenir
- **Logo önerileri**: 
  - Şeffaf arka planlı PNG kullanın
  - Beyaz veya açık renkli logolar tercih edilir
  - Yüksek çözünürlüklü logolar kullanın (en az 200x200px)

---

## 🔧 8. Genel İpuçları ve Sorun Giderme

### Dosya Yolları

- Tüm dosya yolları `public/` klasöründen başlar
- `public/` yazmadan, sadece `/dosya-adi.mp4` şeklinde yazın
- Örnek: `public/video.mp4` → `/video.mp4`

### Video Formatları

- **Desteklenen formatlar:** MP4, WebM, OGG
- **Önerilen format:** MP4 (H.264 codec)
- **Optimizasyon:** Videoları web için optimize edin (düşük dosya boyutu, yüksek kalite)

### Resim Formatları

- **Desteklenen formatlar:** JPG, PNG, SVG, WebP
- **Önerilen format:** 
  - Kapak fotoğrafları: JPG veya PNG
  - Logolar: PNG (şeffaf arka planlı)

### Performans İpuçları

- Videoları mümkün olduğunca küçük tutun (5-10 MB arası ideal)
- Kapak fotoğraflarını optimize edin (WebP formatı kullanabilirsiniz)
- Logoları SVG formatında kullanabilirsiniz (daha küçük dosya boyutu)

### Yaygın Hatalar

1. **Video görünmüyor:**
   - Dosya yolunun doğru olduğundan emin olun (`/video.mp4` formatında)
   - Video dosyasının `public/` klasöründe olduğunu kontrol edin
   - Tarayıcı konsolunda hata mesajlarını kontrol edin

2. **Resim görünmüyor:**
   - Dosya yolunun doğru olduğundan emin olun
   - Dosya adında Türkçe karakter veya özel karakter olmamalı (boşluk yerine `_` kullanın)
   - Dosya uzantısının doğru olduğunu kontrol edin (.jpg, .png, vb.)

3. **Değişiklikler görünmüyor:**
   - Development server'ı yeniden başlatın (`npm run dev`)
   - Tarayıcı cache'ini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)
   - Dosyayı kaydettiğinizden emin olun

---

## 📝 9. Hızlı Referans - Dosya Yolları

### Video Dosyaları
- Hero: `public/videographer.mp4`
- Services: `public/Videographer_2.mp4`
- Video Gallery: `public/Editor.mp4`
- Equipment: `public/Drone.mp4`
- Contact: `public/Natural_Videgrapher.mp4`

### Bileşen Dosyaları
- Video Galeri: `components/VideoGallery.tsx`
- Referanslar: `components/References.tsx`
- Hizmetler: `components/Services.tsx`
- Ekipmanlar: `components/Equipment.tsx`
- İletişim: `components/Contact.tsx`
- Hero: `components/Hero.tsx`

---

## ✅ Kontrol Listesi

Yeni içerik eklerken:

- [ ] Dosya `public/` klasörüne eklendi mi?
- [ ] Dosya yolu doğru formatta mı? (`/dosya-adi.mp4`)
- [ ] ID benzersiz mi?
- [ ] Video orientation doğru mu? (`vertical` veya `horizontal`)
- [ ] Kapak fotoğrafı eklendi mi? (video için)
- [ ] Logo eklendi mi? (marka için)
- [ ] Web sitesi linki doğru mu? (marka için)
- [ ] Değişiklikler kaydedildi mi?
- [ ] Development server çalışıyor mu?
- [ ] Tarayıcıda test edildi mi?

---

## 📞 Yardım

Herhangi bir sorunla karşılaşırsanız:

1. Tarayıcı konsolunu kontrol edin (F12)
2. Dosya yollarını kontrol edin
3. Dosya adlarında özel karakter olmadığından emin olun
4. Development server'ı yeniden başlatın

---

**Son Güncelleme:** 2024

Bu rehber, portföy sitenize içerik eklemenize yardımcı olmak için hazırlanmıştır. Herhangi bir sorunuz veya öneriniz varsa, lütfen iletişime geçin.

