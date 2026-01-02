# İçerik Güncelleme Rehberi

Bu dosya, portföy sitenizdeki içerikleri nasıl güncelleyeceğinizi adım adım açıklar.

## 📹 1. Video Galerisi Güncelleme

**Dosya:** `components/VideoGallery.tsx`

**Satırlar:** 15-48 arası `videos` array'ini düzenleyin.

### Adımlar:

1. `components/VideoGallery.tsx` dosyasını açın
2. 15-48 satırları arasındaki örnek videoları kendi videolarınızla değiştirin
3. Her video için şu bilgileri girin:
   - `id`: Benzersiz bir numara (örn: "1", "2", "3")
   - `title`: Video başlığı
   - `thumbnail`: Thumbnail görselinin yolu (örn: "/video-thumb-1.jpg")
   - `videoUrl`: Video dosyasının yolu (örn: "/video-1.mp4")
   - `orientation`: "horizontal" (yatay) veya "vertical" (dikey)
   - `description`: Video açıklaması (opsiyonel)

### Örnek:

```typescript
const videos: Video[] = [
  {
    id: "1",
    title: "XYZ Şirketi Tanıtım Videosu",
    thumbnail: "/video-thumb-1.jpg",
    videoUrl: "/video-1.mp4",
    orientation: "horizontal",
    description: "Kurumsal tanıtım videosu",
  },
  {
    id: "2",
    title: "Instagram Reklam Videosu",
    thumbnail: "/video-thumb-2.jpg",
    videoUrl: "/video-2.mp4",
    orientation: "vertical",
    description: "Sosyal medya reklam videosu",
  },
  // Daha fazla video ekleyebilirsiniz...
];
```

### Dosya Yerleşimi:

- Videoları `public/` klasörüne ekleyin (örn: `public/video-1.mp4`)
- Thumbnail görsellerini `public/` klasörüne ekleyin (örn: `public/video-thumb-1.jpg`)

---

## 🏢 2. Referanslar (Marka Logoları) Güncelleme

**Dosya:** `components/References.tsx`

**Satırlar:** 11-47 arası `brands` array'ini düzenleyin.

### Adımlar:

1. `components/References.tsx` dosyasını açın
2. 11-47 satırları arasındaki örnek markaları kendi markalarınızla değiştirin
3. Her marka için şu bilgileri girin:
   - `id`: Benzersiz bir numara
   - `name`: Marka adı
   - `logo`: Logo dosyasının yolu (örn: "/brands/brand-1.png")
   - `website`: Marka web sitesi URL'i (opsiyonel)

### Örnek:

```typescript
const brands: Brand[] = [
  {
    id: "1",
    name: "ABC Şirketi",
    logo: "/brands/abc-logo.png",
    website: "https://abc.com",
  },
  {
    id: "2",
    name: "XYZ Markası",
    logo: "/brands/xyz-logo.png",
    website: "https://xyz.com",
  },
  // Daha fazla marka ekleyebilirsiniz...
];
```

### Dosya Yerleşimi:

- Logoları `public/brands/` klasörüne ekleyin (örn: `public/brands/abc-logo.png`)
- Logo formatları: PNG, JPG, SVG (şeffaf arka plan için PNG önerilir)

---

## 📋 3. Hizmetler Güncelleme

**Dosya:** `components/Services.tsx`

**Satırlar:** 10-39 arası `services` array'ini düzenleyin.

### Adımlar:

1. `components/Services.tsx` dosyasını açın
2. 10-39 satırları arasındaki hizmetleri kendi hizmetlerinizle değiştirin
3. Her hizmet için şu bilgileri girin:
   - `id`: Benzersiz bir numara
   - `title`: Hizmet başlığı
   - `description`: Hizmet açıklaması
   - `icon`: Emoji veya ikon (örn: "🎬", "📱", "🎥")

### Örnek:

```typescript
const services: Service[] = [
  {
    id: "1",
    title: "Kurumsal Video Prodüksiyon",
    description: "Şirketinizin hikayesini anlatan profesyonel tanıtım videoları.",
    icon: "🎬",
  },
  {
    id: "2",
    title: "Sosyal Medya İçerikleri",
    description: "Instagram, TikTok ve diğer platformlar için optimize edilmiş içerikler.",
    icon: "📱",
  },
  // Daha fazla hizmet ekleyebilirsiniz...
];
```

---

## 🎥 4. Ekipmanlar Güncelleme

**Dosya:** `components/Equipment.tsx`

**Satırlar:** 12-49 arası `equipment` array'ini düzenleyin.

### Adımlar:

1. `components/Equipment.tsx` dosyasını açın
2. 12-49 satırları arasındaki ekipmanları kendi ekipmanlarınızla değiştirin
3. Her ekipman için şu bilgileri girin:
   - `id`: Benzersiz bir numara
   - `name`: Ekipman adı
   - `category`: Kategori (örn: "Çekim Ekipmanları", "Ses Ekipmanları", "Işıklandırma", "Yazılım")
   - `description`: Ekipman açıklaması (opsiyonel)

### Örnek:

```typescript
const equipment: EquipmentItem[] = [
  {
    id: "1",
    name: "Sony FX3",
    category: "Çekim Ekipmanları",
    description: "4K Full-Frame sinematik kamera",
  },
  {
    id: "2",
    name: "DJI RS 3 Pro",
    category: "Çekim Ekipmanları",
    description: "Profesyonel gimbal stabilizatör",
  },
  {
    id: "3",
    name: "Rode Wireless Go II",
    category: "Ses Ekipmanları",
    description: "Kablosuz mikrofon sistemi",
  },
  // Daha fazla ekipman ekleyebilirsiniz...
];
```

### Kategori Ekleme:

Yeni kategori eklemek için 49-55 satırları arasındaki `categories` array'ine ekleyin:

```typescript
const categories = [
  "Tümü",
  "Çekim Ekipmanları",
  "Ses Ekipmanları",
  "Işıklandırma",
  "Yazılım",
  "Yeni Kategori", // Buraya ekleyin
];
```

---

## 📧 5. İletişim Bilgileri Güncelleme

**Dosya:** `components/Contact.tsx`

**Satırlar:** 50-70 arası iletişim bilgilerini düzenleyin.

### Adımlar:

1. `components/Contact.tsx` dosyasını açın
2. E-posta adresini güncelleyin (satır ~55)
3. Web sitesi URL'ini güncelleyin (satır ~63)
4. Sosyal medya linklerini güncelleyin (satır ~75-100)

### Örnek:

```typescript
// E-posta
<a href="mailto:info@onuralpbasar.com">
  info@onuralpbasar.com
</a>

// Web sitesi
<a href="https://onuralpbasar.com">
  onuralpbasar.com
</a>

// Instagram
<a href="https://instagram.com/onuralpbasar">
  // Instagram ikonu
</a>

// LinkedIn
<a href="https://linkedin.com/in/onuralpbasar">
  // LinkedIn ikonu
</a>
```

---

## 🎬 6. Hero Bölümü (Ana Sayfa) Güncelleme

**Dosya:** `components/Hero.tsx`

### Arka Plan Videosu:

1. `public/hero-video.mp4` dosyasını ekleyin
2. Video otomatik olarak arka planda oynatılacak

### Metin İçeriği:

**Satırlar:** 60-70 arası metinleri düzenleyin.

```typescript
<h1 className="...">
  ONURALP BAŞAR  // İsminiz zaten burada
</h1>
<p className="...">
  Video Prodüksiyon & Sosyal Medya Yönetimi  // Alt başlık
</p>
<p className="...">
  İşletmelere tanıtım ve reklam videoları üretiyorum...  // Açıklama
</p>
```

---

## 📝 7. Form Gönderme İşlevi (Opsiyonel)

**Dosya:** `components/Contact.tsx`

**Satırlar:** 12-18 arası `handleSubmit` fonksiyonunu düzenleyin.

Şu anda form sadece alert gösteriyor. Gerçek bir form gönderme işlevi eklemek için:

1. Backend API endpoint'i oluşturun
2. Veya form servisi kullanın (Formspree, EmailJS, vb.)
3. `handleSubmit` fonksiyonunu güncelleyin

### EmailJS Örneği:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // EmailJS veya başka bir servis kullanarak gönderin
  // Örnek: await emailjs.send(...)
  
  alert("Mesajınız gönderildi!");
  setFormData({ name: "", email: "", message: "" });
};
```

---

## 📁 Dosya Yapısı Özeti

```
public/
├── hero-video.mp4              # Ana sayfa arka plan videosu
├── video-1.mp4                 # Galeri videoları
├── video-2.mp4
├── video-thumb-1.jpg           # Video thumbnail'ları
├── video-thumb-2.jpg
└── brands/
    ├── brand-1.png             # Marka logoları
    ├── brand-2.png
    └── ...
```

---

## ✅ Kontrol Listesi

Güncelleme yaptıktan sonra kontrol edin:

- [ ] Videolar `public/` klasörüne eklendi
- [ ] Video thumbnail'ları eklendi
- [ ] Marka logoları `public/brands/` klasörüne eklendi
- [ ] Hero arka plan videosu eklendi
- [ ] Tüm metinler güncellendi
- [ ] İletişim bilgileri güncellendi
- [ ] Sosyal medya linkleri güncellendi
- [ ] `npm run dev` ile test edildi

---

## 🚀 Test Etme

Güncellemeleri test etmek için:

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın ve değişiklikleri kontrol edin.

---

## 💡 İpuçları

1. **Video Formatları:** MP4 formatı önerilir (en iyi uyumluluk)
2. **Görsel Boyutları:** 
   - Thumbnail'lar: 1920x1080 (yatay) veya 1080x1920 (dikey)
   - Logolar: Mümkünse SVG veya yüksek çözünürlüklü PNG
3. **Performans:** Büyük video dosyaları için lazy loading kullanılabilir
4. **SEO:** `app/layout.tsx` dosyasındaki metadata'yı da güncelleyebilirsiniz

---

Sorularınız için: Herhangi bir bileşende değişiklik yapmak isterseniz, dosya adını ve hangi kısmı değiştirmek istediğinizi belirtin!

