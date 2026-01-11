# .env Dosyası - Tam Örnek

VPS'inizde `/var/www/onuralpbasar.com/.env` dosyası şu şekilde olmalı:

## 📝 Tam .env Dosyası İçeriği

```env
# ============================================
# Admin Panel Ayarları
# ============================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=güvenli_şifreniz_buraya

# ============================================
# Next.js Ayarları
# ============================================
NODE_ENV=production

# ============================================
# GitHub Webhook Secret
# ============================================
GITHUB_WEBHOOK_SECRET=buraya_openssl_rand_hex_32_ile_oluşturduğunuz_secret_geliyor

# ============================================
# Opsiyonel Ayarlar
# ============================================
PORT=3000
PM2_APP_NAME=portfolio
```

## 🔑 Secret Oluşturma

```bash
# VPS'te secret oluştur
openssl rand -hex 32
```

Çıkan değeri `GITHUB_WEBHOOK_SECRET=` satırına yapıştırın.

## 📋 Örnek (Gerçek Değerlerle)

```env
ADMIN_USERNAME=onuralp
ADMIN_PASSWORD=SuperGüvenliŞifre123!@#
NODE_ENV=production
GITHUB_WEBHOOK_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
PORT=3000
PM2_APP_NAME=portfolio
```

## ⚠️ ÖNEMLİ NOTLAR

1. **ADMIN_USERNAME** ve **ADMIN_PASSWORD**: Admin panel giriş bilgileriniz
2. **GITHUB_WEBHOOK_SECRET**: GitHub webhook için - bu değer GitHub'da da aynı olmalı
3. **NODE_ENV**: Production için `production` olmalı
4. **PORT**: Varsayılan 3000 (genellikle değiştirmenize gerek yok)
5. Her satırda **eşittir işaretinden önce ve sonra BOŞLUK OLMAMALI**
6. Değerlerde tırnak işareti kullanmayın (gerekmez)

## ✅ Dosya Oluşturma Komutları

```bash
cd /var/www/onuralpbasar.com

# Secret oluştur
SECRET=$(openssl rand -hex 32)
echo "Oluşturulan secret: $SECRET"

# .env dosyasını oluştur/düzenle
nano .env
```

Yukarıdaki içeriği yapıştırın, değerleri kendi bilgilerinizle değiştirin, kaydedin (Ctrl+X, Y, Enter).
