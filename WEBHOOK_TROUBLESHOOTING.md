# Webhook Troubleshooting - "An exception occurred" Hatası

## 🔍 Hata Analizi

GitHub'da "Last delivery was not successful. An exception occurred" hatası alıyorsunuz.

## ✅ Hızlı Kontrol Listesi

### 1. VPS'te Secret Kontrolü

```bash
cd /var/www/onuralpbasar.com

# .env dosyasında secret var mı?
grep GITHUB_WEBHOOK_SECRET .env

# Eğer yoksa, ekleyin:
# openssl rand -hex 32 ile secret oluşturun
# nano .env ile .env dosyasını açın
# GITHUB_WEBHOOK_SECRET=oluşturduğunuz_secret yazın
```

### 2. GitHub'da Secret Eşleşmesi

- GitHub'da: Settings > Webhooks > Webhook'unuzu açın
- Secret alanındaki değer, VPS'teki `.env` dosyasındaki `GITHUB_WEBHOOK_SECRET` ile **TAM OLARAK AYNI** olmalı
- Boşluk, yeni satır, fazladan karakter olmamalı

### 3. Webhook Endpoint Testi

```bash
# Endpoint çalışıyor mu?
curl https://onuralpbasar.com/api/webhook/deploy

# Beklenen cevap:
# {"message":"GitHub Webhook endpoint is active","timestamp":"..."}
```

### 4. PM2 Logları Kontrolü

```bash
# Son logları kontrol edin
pm2 logs portfolio --lines 100 | grep -i webhook

# Tüm hataları görün
pm2 logs portfolio --err --lines 50
```

### 5. Nginx Logları

```bash
# Nginx error loglarını kontrol edin
sudo tail -50 /var/log/nginx/error.log
```

## 🔧 Çözüm Adımları

### Adım 1: Secret'ı Yeniden Oluşturma ve Ayarlama

```bash
cd /var/www/onuralpbasar.com

# Yeni secret oluştur
SECRET=$(openssl rand -hex 32)
echo "Yeni secret: $SECRET"

# .env dosyasını düzenle
nano .env

# GITHUB_WEBHOOK_SECRET satırını bulun ve güncelleyin (veya ekleyin):
GITHUB_WEBHOOK_SECRET=$SECRET

# Kaydedin (Ctrl+X, Y, Enter)

# PM2'yi restart edin (yeni env variable'ları yüklemek için)
pm2 restart portfolio

# Kontrol edin
pm2 logs portfolio --lines 20
```

### Adım 2: GitHub'da Secret'ı Güncelleme

1. GitHub repository'nize gidin: https://github.com/Onuralpbsr/onuralpbasar.com
2. **Settings** > **Webhooks**
3. Webhook'unuzu tıklayın (veya "Edit" butonuna basın)
4. **Secret** alanına VPS'te oluşturduğunuz **AYNI SECRET'ı** yapıştırın
5. **Update webhook** butonuna tıklayın

**ÖNEMLİ:** Secret'ı kopyalarken:
- Başında/sonunda boşluk olmamalı
- Tüm karakterleri kopyalayın
- GitHub'da ve VPS'te tamamen aynı olmalı

### Adım 3: Webhook'u Manuel Test Etme

GitHub'da:
1. Webhook'unuzun yanında **"..."** (üç nokta) butonuna tıklayın
2. **"Redeliver"** seçin
3. Son delivery'yi kontrol edin

VPS'te:
```bash
# Webhook çalıştı mı kontrol edin
pm2 logs portfolio --lines 50

# Deploy script çalıştı mı?
ls -la scripts/deploy.sh
chmod +x scripts/deploy.sh  # İzin yoksa ekleyin
```

### Adım 4: Build Klasörü Kontrolü

```bash
# Build klasörü var mı?
ls -la .next/

# Yoksa build yapın
npm run build
```

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata 1: "GITHUB_WEBHOOK_SECRET environment variable tanımlı değil!"

**Çözüm:**
```bash
# .env dosyasında secret olduğundan emin olun
grep GITHUB_WEBHOOK_SECRET .env

# PM2'yi restart edin (env variable'ları yeniden yükler)
pm2 restart portfolio
```

### Hata 2: "Invalid signature"

**Çözüm:**
- GitHub'daki secret ile VPS'teki secret'ın **tamamen aynı** olduğundan emin olun
- Her iki yerde de başında/sonunda boşluk olmamalı

### Hata 3: "Deploy script failed"

**Çözüm:**
```bash
# Deploy script'in izinleri
chmod +x scripts/deploy.sh

# Manuel test
bash scripts/deploy.sh

# Hataları kontrol edin
pm2 logs portfolio --lines 100
```

### Hata 4: Nginx timeout

**Çözüm:**
Nginx config'inde webhook endpoint'i için timeout ayarları olmalı (zaten eklemiştik):
```nginx
location /api/webhook/deploy {
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
}
```

## 📝 Test Komutu

Tam test için VPS'te şu komutları çalıştırın:

```bash
cd /var/www/onuralpbasar.com

echo "=== 1. Secret kontrolü ==="
grep GITHUB_WEBHOOK_SECRET .env || echo "SECRET YOK!"

echo ""
echo "=== 2. Build klasörü ==="
[ -d ".next" ] && echo "Build klasörü var" || echo "Build klasörü YOK - npm run build yapın"

echo ""
echo "=== 3. Deploy script izinleri ==="
ls -l scripts/deploy.sh

echo ""
echo "=== 4. PM2 durumu ==="
pm2 list

echo ""
echo "=== 5. Webhook endpoint testi ==="
curl -s https://onuralpbasar.com/api/webhook/deploy | head -20
```

## ✅ Başarı Kriterleri

Webhook başarılı olduğunda:
- ✅ GitHub'da "Recent Deliveries" yeşil işaret gösterir
- ✅ VPS'te PM2 loglarında "Deploy başlatılıyor" mesajı görünür
- ✅ Git log'unda yeni commit'ler görünür
- ✅ `.next` klasörü güncellenir
- ✅ Site yeni kodlarla çalışır
