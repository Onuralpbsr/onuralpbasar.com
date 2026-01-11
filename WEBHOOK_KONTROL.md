# Webhook Kurulum Kontrol Rehberi

## 🔍 Webhook Kurulumunu Kontrol Etme

### 1. GitHub'da Webhook Kontrolü

1. GitHub repository'nize gidin: https://github.com/Onuralpbsr/onuralpbasar.com
2. **Settings** > **Webhooks** menüsüne gidin
3. Eğer webhook varsa, şunları kontrol edin:
   - **Payload URL:** `https://onuralpbasar.com/api/webhook/deploy`
   - **Content type:** `application/json`
   - **Which events:** "Just the push event" veya "Send me everything"
   - **Active:** ✅ işaretli olmalı
   - **Recent Deliveries:** Son push'ları gösterir (yeşil = başarılı, kırmızı = hata)

### 2. VPS'te Kontrol (SSH ile)

```bash
# VPS'e SSH ile bağlanın
ssh root@your_server_ip

# Proje dizinine gidin
cd /var/www/onuralpbasar.com

# .env dosyasında GITHUB_WEBHOOK_SECRET var mı kontrol edin
grep GITHUB_WEBHOOK_SECRET .env

# Webhook endpoint'inin çalışıp çalışmadığını test edin
curl https://onuralpbasar.com/api/webhook/deploy

# PM2 loglarında webhook ile ilgili hata var mı kontrol edin
pm2 logs portfolio --lines 50 | grep -i webhook

# Son deploy loglarını kontrol edin
pm2 logs portfolio --lines 100
```

### 3. Webhook Test Etme

**GitHub'dan test:**
1. Repository'de bir dosyayı küçük bir değişiklik yapın (örn: README'ye bir satır ekleyin)
2. Commit ve push yapın
3. GitHub'da **Settings** > **Webhooks** > **Recent Deliveries**'e gidin
4. Son delivery'yi kontrol edin:
   - ✅ Yeşil işaret = Başarılı (webhook çalışıyor)
   - ❌ Kırmızı işaret = Hata (logları kontrol edin)

**VPS'ten test:**
```bash
# Webhook endpoint'inin aktif olduğunu test et
curl https://onuralpbasar.com/api/webhook/deploy

# Beklenen cevap:
# {"message":"GitHub Webhook endpoint is active","timestamp":"..."}
```

### 4. Webhook Kurulu Değilse - Kurulum

Eğer webhook yoksa, şu adımları izleyin:

**A. VPS'te Secret Oluşturma:**
```bash
cd /var/www/onuralpbasar.com

# Random secret oluştur
openssl rand -hex 32

# .env dosyasını düzenle
nano .env

# Şu satırı ekleyin:
GITHUB_WEBHOOK_SECRET=oluşturduğunuz_secret_buraya
```

**B. GitHub'da Webhook Ekleme:**
1. GitHub repository'nize gidin: https://github.com/Onuralpbsr/onuralpbasar.com
2. **Settings** (sağ üstteki menüden) > **Webhooks** (sol menüden) > **Add webhook** butonuna tıklayın
3. **Payload URL:** `https://onuralpbasar.com/api/webhook/deploy` (BURAYA YAZIN!)
4. **Content type:** `application/json` seçin
5. **Secret:** VPS'te oluşturduğunuz `GITHUB_WEBHOOK_SECRET` değerini (openssl rand -hex 32 ile oluşturduğunuz) yapıştırın
6. **Which events would you like to trigger this webhook?:** "Just the push event" seçin
7. **Active:** ✅ işaretli olsun (zaten varsayılan olarak işaretli)
8. **Add webhook** (yeşil buton) butonuna tıklayın

**C. Nginx Config Kontrolü (Eğer Nginx kullanıyorsanız):**
Nginx config'inde webhook endpoint'i için özel timeout ayarları olmalı:
```nginx
location /api/webhook/deploy {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
}
```

**D. PM2'yi Restart Edin:**
```bash
pm2 restart portfolio
```

## 📝 Webhook Nasıl Çalışır?

1. **GitHub'a push yapıldığında:**
   - GitHub webhook endpoint'inize POST request gönderir
   - Request'te commit bilgileri ve secret signature vardır

2. **VPS'te webhook endpoint:**
   - Secret'ı doğrular (güvenlik)
   - Deploy script'ini çalıştırır (`scripts/deploy.sh`)
   - Deploy script şunları yapar:
     - `git pull origin main` (yeni kodları çeker)
     - `npm install` (yeni bağımlılıklar varsa)
     - `npm run build` (yeni build oluşturur)
     - `pm2 restart portfolio` (uygulamayı yeniden başlatır)

3. **Sonuç:**
   - GitHub'daki son kodlar VPS'e otomatik olarak gelir
   - Manuel `git pull` yapmanıza gerek kalmaz
   - Her push'ta otomatik deploy olur

## ⚠️ Sorun Giderme

**Webhook çalışmıyorsa:**

1. **GitHub'da Recent Deliveries kontrolü:**
   - Hata mesajını okuyun
   - Genellikle 401 (secret yanlış) veya 500 (server hatası) hatası olur

2. **VPS logları:**
   ```bash
   pm2 logs portfolio --lines 100
   ```

3. **Secret eşleşmesi:**
   - GitHub'daki secret ile `.env` dosyasındaki `GITHUB_WEBHOOK_SECRET` aynı olmalı
   - Her ikisini de kontrol edin

4. **Nginx timeout:**
   - Webhook deploy uzun sürebilir (build sırasında)
   - Nginx config'inde timeout değerleri yeterli olmalı (300s)

5. **Deploy script izinleri:**
   ```bash
   chmod +x scripts/deploy.sh
   ```
