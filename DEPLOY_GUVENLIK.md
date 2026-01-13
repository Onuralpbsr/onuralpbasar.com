# Deploy Güvenlik Rehberi - VPS Veri Koruma

## ⚠️ ÖNEMLİ: VPS'deki Verilerin Korunması

Bu projede, admin panelinden yüklenen videolar, görseller ve JSON dosyaları **VPS'de kalıcı olarak saklanır** ve GitHub'dan pull yapıldığında **otomatik olarak korunur**.

## 🔒 Nasıl Çalışır?

### 1. Deploy Script'i Güvenlik Özellikleri

`scripts/deploy.sh` script'i şu güvenlik özelliklerine sahiptir:

- ✅ **Content Dosyaları Korunur**: `content/*.json` dosyaları (videos.json, brands.json, vb.) VPS'deki versiyonlarıyla korunur
- ✅ **Yüklenen Dosyalar Korunur**: `public/` klasöründeki yüklenen videolar ve görseller korunur
- ✅ **Otomatik Yedekleme**: Git pull yapmadan önce tüm içerik dosyaları otomatik yedeklenir
- ✅ **Otomatik Geri Yükleme**: Pull işleminden sonra VPS'deki versiyonlar otomatik geri yüklenir

### 2. Güvenli Deploy Süreci

```
1. Deploy başlatılır
2. content/ ve public/ klasörleri yedeklenir
3. Git pull yapılır (GitHub'dan güncellemeler alınır)
4. Yedeklenen dosyalar geri yüklenir (VPS'deki versiyonlar korunur)
5. Build ve restart işlemleri yapılır
```

### 3. Hangi Dosyalar Korunur?

#### ✅ Korunan Dosyalar:
- `content/videos.json` - Video listesi
- `content/brands.json` - Marka referansları
- `content/backgroundVideos.json` - Arka plan videoları
- `content/services.json` - Hizmetler
- `content/equipment.json` - Ekipmanlar
- `content/contact.json` - İletişim bilgileri
- `content/submissions.json` - Form gönderimleri
- `public/*` - Yüklenen tüm videolar ve görseller

#### ⚠️ Dikkat:
- Kod değişiklikleri (`app/`, `components/`, vb.) GitHub'dan güncellenir
- `package.json` değişiklikleri GitHub'dan güncellenir
- Yapılandırma dosyaları GitHub'dan güncellenir

## 📋 Kullanım Senaryoları

### Senaryo 1: Normal Deploy (GitHub'dan Push)
```bash
# GitHub'a push yaptınız
git push origin main

# VPS'de deploy script çalışır (webhook veya manuel)
# ✅ VPS'deki içerik dosyaları korunur
# ✅ Kod güncellemeleri uygulanır
```

### Senaryo 2: Manuel Deploy
```bash
# VPS'de
cd /var/www/portfolio
git pull origin main
npm run deploy

# ✅ VPS'deki içerik dosyaları otomatik korunur
```

### Senaryo 3: Admin Panelinden İçerik Ekleme
```bash
# Admin panelinden video/görsel eklediniz
# ✅ Dosyalar public/ klasörüne kaydedilir
# ✅ JSON dosyaları content/ klasörüne kaydedilir
# ✅ GitHub'a push yaptığınızda bu dosyalar korunur
```

## 🚨 Önemli Notlar

### 1. İlk Kurulum
İlk kurulumda `content/*.json` dosyaları GitHub'dan gelir. Sonrasında VPS'deki versiyonlar önceliklidir.

### 2. Yapı Değişiklikleri
Eğer JSON dosyalarının yapısını değiştirirseniz (yeni alanlar eklemek gibi):
- GitHub'a yeni yapıyı push edin
- VPS'de admin panelinden içerikleri tekrar kontrol edin
- Gerekirse manuel olarak yeni alanları ekleyin

### 3. Yedekleme
Her deploy'da otomatik yedekleme yapılır, ancak:
- **Önerilen**: Düzenli olarak VPS'deki `content/` ve `public/` klasörlerini yedekleyin
- **Önerilen**: Önemli değişikliklerden önce manuel yedek alın

## 🔧 Sorun Giderme

### Sorun: İçerik dosyaları kayboldu
```bash
# Yedek klasörünü kontrol edin
ls -la /tmp/portfolio_backup_*

# Son yedeği geri yükleyin
cp -r /tmp/portfolio_backup_*/content/* content/
```

### Sorun: Deploy sonrası içerik görünmüyor
1. `content/` klasöründeki dosyaları kontrol edin
2. `public/` klasöründeki dosyaları kontrol edin
3. PM2 loglarını kontrol edin: `pm2 logs portfolio`

### Sorun: Git pull çakışması
Deploy script'i otomatik olarak VPS'deki versiyonları korur, ancak:
- Eğer manuel `git pull` yapıyorsanız, `git stash` kullanın
- Veya deploy script'ini kullanın: `npm run deploy`

## 📝 Best Practices

1. ✅ **Her zaman deploy script'ini kullanın**: `npm run deploy` veya webhook
2. ✅ **Düzenli yedekleme yapın**: `content/` ve `public/` klasörlerini yedekleyin
3. ✅ **GitHub'a push yapmadan önce**: VPS'deki değişiklikleri kontrol edin
4. ✅ **Yapı değişikliklerinde dikkatli olun**: JSON yapısını değiştirirken test edin

## 🎯 Özet

- ✅ VPS'deki içerik dosyaları **her zaman korunur**
- ✅ Admin panelinden yüklenen dosyalar **asla silinmez**
- ✅ Deploy script'i **otomatik yedekleme** yapar
- ✅ GitHub'dan pull yapıldığında **VPS verileri önceliklidir**

**Güvenle deploy yapabilirsiniz!** 🚀
