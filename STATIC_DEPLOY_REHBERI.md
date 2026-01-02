# 🚀 Static Export Deploy Rehberi - cPanel (Node.js Olmadan)

Bu rehber, cPanel'inizde Node.js desteği olmadığında projenizi nasıl deploy edeceğinizi adım adım açıklar.

## ✅ Hazırlık Durumu

Proje static export için hazırlandı:
- ✅ `next.config.mjs` - Static export aktif
- ✅ `components/Contact.tsx` - EmailJS entegrasyonu yapıldı
- ✅ `package.json` - EmailJS paketi eklendi
- ✅ `.htaccess` - Static export için güncellendi

## 📋 Adım Adım Deploy

### 1️⃣ EmailJS Kurulumu (5 dakika)

İletişim formu çalışması için EmailJS ayarlarını yapmanız gerekiyor:

1. **[EmailJS.com](https://www.emailjs.com)** → Ücretsiz kayıt olun
2. **Email Services** → Gmail/Outlook bağlayın → **Service ID** alın
3. **Email Templates** → Yeni template oluşturun:
   ```
   Subject: Yeni İletişim Formu - {{from_name}}
   Content:
   İsim: {{from_name}}
   E-posta: {{from_email}}
   Mesaj: {{message}}
   ```
   → **Template ID** alın
4. **Account** → **General** → **Public Key** alın

### 2️⃣ Environment Variables Ekleme

Proje klasöründe `.env.local` dosyası oluşturun:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

### 3️⃣ Build Alma

```bash
cd /Users/onuralpbasar/Desktop/Portföy
npm install
npm run build
```

Build tamamlandıktan sonra `out` klasörü oluşacak.

### 4️⃣ cPanel File Manager ile Yükleme

1. **cPanel** → **File Manager** → `public_html` klasörüne gidin
2. Eski dosyaları silin (ilk deploy için)
3. `out` klasörünün **içindeki tüm dosyaları** ZIP'leyin
4. File Manager'da **Upload** → ZIP'i yükleyin
5. ZIP'e sağ tıklayın → **Extract**
6. `.htaccess` dosyasını `public_html`'e yükleyin

### 5️⃣ Test

Tarayıcıda domain adresinizi açın. Site çalışıyorsa başarılı! 🎉

## ⚠️ Önemli Notlar

- ❌ Admin paneli çalışmayacak (`/adminpanel/*`)
- ❌ API route'ları çalışmayacak (`/api/*`)
- ✅ Portföy sitesi tamamen çalışır
- ✅ İletişim formu EmailJS ile çalışır

## 🔄 Güncelleme

İçerik güncellemesi için:
1. `content/*.json` dosyalarını düzenleyin
2. `npm run build` çalıştırın
3. `out/_next` klasörünü yeniden yükleyin

## 📞 Sorun mu Yaşıyorsunuz?

- Build hatası: EmailJS environment variables kontrol edin
- Form çalışmıyor: EmailJS ayarlarını kontrol edin
- 404 hatası: `.htaccess` dosyasını kontrol edin

