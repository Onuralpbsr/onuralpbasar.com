# VPS Ubuntu - GitHub Webhook ile Otomatik Deploy Rehberi

Bu rehber, Ubuntu tabanlı VPS'inizde GitHub webhook ile otomatik deploy sistemini kurmanız için adım adım talimatlar içerir.

## 📋 Gereksinimler

- Ubuntu 20.04+ VPS
- Node.js 18.x veya 20.x
- Git kurulu
- PM2 (process manager)
- Nginx (reverse proxy - opsiyonel)
- GitHub repository

## 🚀 Kurulum Adımları

### 1. VPS'te Temel Kurulumlar

SSH ile VPS'inize bağlanın ve aşağıdaki komutları çalıştırın:

```bash
# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu (NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Git kurulumu (genellikle zaten kurulu)
sudo apt install -y git

# PM2 kurulumu (global)
sudo npm install -g pm2

# PM2 startup script (sistem yeniden başladığında otomatik başlatma)
pm2 startup systemd
# Çıkan komutu çalıştırın (sudo ...)

# Nginx kurulumu (opsiyonel, reverse proxy için)
sudo apt install -y nginx
```

### 2. Projeyi VPS'e Klonlama

```bash
# Proje dizini oluştur
sudo mkdir -p /var/www
cd /var/www

# GitHub repo'nuzu klonlayın
sudo git clone https://github.com/KULLANICI_ADI/REPO_ADI.git portfolio
# veya SSH ile:
# sudo git clone git@github.com:KULLANICI_ADI/REPO_ADI.git portfolio

# Dizin sahipliğini ayarla (kullanıcı adınızı değiştirin)
sudo chown -R $USER:$USER /var/www/portfolio
cd /var/www/portfolio
```

### 3. Environment Variables Ayarlama

```bash
# .env dosyası oluştur
nano .env
```

`.env` dosyasına şunları ekleyin:

```env
# Admin Panel
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
NODE_ENV=production

# GitHub Webhook Secret (güvenlik için önemli!)
GITHUB_WEBHOOK_SECRET=your_random_secret_key_here

# PM2 App Name (opsiyonel)
PM2_APP_NAME=portfolio

# Port (opsiyonel, varsayılan 3000)
PORT=3000
```

**ÖNEMLİ:** `GITHUB_WEBHOOK_SECRET` için güçlü bir random string oluşturun:

```bash
# Random secret oluştur
openssl rand -hex 32
```

Bu çıktıyı `.env` dosyasındaki `GITHUB_WEBHOOK_SECRET` değerine yapıştırın.

### 4. İlk Build ve Başlatma

```bash
cd /var/www/portfolio

# Bağımlılıkları yükle
npm install

# Production build
npm run build

# Deploy script'ine çalıştırma izni ver
chmod +x scripts/deploy.sh

# Logs dizini oluştur
mkdir -p logs

# PM2 ile başlat
pm2 start ecosystem.config.js

# PM2 durumunu kontrol et
pm2 list
pm2 logs portfolio
```

### 5. Nginx Reverse Proxy Kurulumu (Önerilen)

Nginx, Next.js uygulamanızı 80/443 portlarından erişilebilir hale getirir:

```bash
# Nginx config dosyası oluştur
sudo nano /etc/nginx/sites-available/portfolio
```

Aşağıdaki içeriği ekleyin (domain adınızı değiştirin):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # SSL için (Let's Encrypt kullanacaksanız)
    # listen 443 ssl http2;
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Webhook endpoint için özel ayar (gerekirse)
    location /api/webhook/deploy {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Webhook için timeout artır
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

Nginx config'i aktifleştirin:

```bash
# Symbolic link oluştur
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### 6. SSL Sertifikası (Let's Encrypt - Önerilen)

```bash
# Certbot kurulumu
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Otomatik yenileme testi
sudo certbot renew --dry-run
```

### 7. GitHub Webhook Ayarlama

1. **GitHub Repository'nize gidin**
2. **Settings** > **Webhooks** > **Add webhook**
3. **Payload URL:** `https://yourdomain.com/api/webhook/deploy`
4. **Content type:** `application/json`
5. **Secret:** `.env` dosyasındaki `GITHUB_WEBHOOK_SECRET` değerini yapıştırın
6. **Which events:** "Just the push event" seçin
7. **Active:** ✅ işaretli olsun
8. **Add webhook** butonuna tıklayın

### 8. Firewall Ayarları

```bash
# UFW firewall kurulumu
sudo apt install -y ufw

# Gerekli portları aç
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS

# Firewall'u aktifleştir
sudo ufw enable

# Durumu kontrol et
sudo ufw status
```

## ✅ Test ve Kontrol

### Webhook Testi

GitHub'da webhook'u test etmek için:

1. Repository'nize bir commit push edin
2. GitHub'da **Settings** > **Webhooks** > Webhook'unuzun yanındaki **Recent Deliveries**'e tıklayın
3. Son delivery'yi kontrol edin:
   - ✅ Yeşil işaret = Başarılı
   - ❌ Kırmızı işaret = Hata (detayları kontrol edin)

### Manuel Test

```bash
# VPS'te webhook endpoint'ini test et
curl -X POST http://localhost:3000/api/webhook/deploy \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=test" \
  -d '{"ref":"refs/heads/main"}'
```

### PM2 Kontrolleri

```bash
# PM2 durumu
pm2 list

# Logları görüntüle
pm2 logs portfolio

# Son 100 satır log
pm2 logs portfolio --lines 100

# Real-time monitoring
pm2 monit

# Uygulamayı yeniden başlat
pm2 restart portfolio

# Uygulamayı durdur
pm2 stop portfolio

# Uygulamayı başlat
pm2 start portfolio
```

## 🔧 Sorun Giderme

### Webhook Çalışmıyor

1. **Logları kontrol edin:**
   ```bash
   pm2 logs portfolio
   ```

2. **Webhook secret kontrolü:**
   - GitHub'daki secret ile `.env` dosyasındaki `GITHUB_WEBHOOK_SECRET` aynı olmalı

3. **Nginx logları:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Port kontrolü:**
   ```bash
   sudo netstat -tlnp | grep 3000
   ```

### Deploy Script Çalışmıyor

1. **Script izinleri:**
   ```bash
   chmod +x scripts/deploy.sh
   ```

2. **Manuel çalıştırma:**
   ```bash
   bash scripts/deploy.sh
   ```

3. **Git durumu:**
   ```bash
   git status
   git remote -v
   ```

### PM2 Uygulama Başlamıyor

1. **Logları kontrol:**
   ```bash
   pm2 logs portfolio --err
   ```

2. **Environment variables:**
   ```bash
   pm2 env 0  # 0 = process ID
   ```

3. **Manuel başlatma testi:**
   ```bash
   cd /var/www/portfolio
   npm start
   ```

### Build Hataları

1. **Node.js versiyonu:**
   ```bash
   node --version  # 18.x veya 20.x olmalı
   ```

2. **Disk alanı:**
   ```bash
   df -h
   ```

3. **Memory:**
   ```bash
   free -h
   ```

## 🔒 Güvenlik Önerileri

1. **SSH Key Authentication:**
   ```bash
   # Password authentication'ı kapat
   sudo nano /etc/ssh/sshd_config
   # PasswordAuthentication no
   sudo systemctl restart sshd
   ```

2. **Fail2Ban:**
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   ```

3. **.env Dosyası Güvenliği:**
   ```bash
   chmod 600 .env
   ```

4. **GitHub Webhook Secret:**
   - Güçlü, random bir secret kullanın
   - Asla commit etmeyin

5. **Firewall:**
   - Sadece gerekli portları açın
   - 3000 portunu dışarıya açmayın (sadece Nginx üzerinden erişilebilir olmalı)

## 📊 Monitoring

### PM2 Monitoring

```bash
# Web dashboard (opsiyonel)
pm2 web

# Monitoring
pm2 monit
```

### Log Rotation

PM2 log rotation için:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🔄 Güncelleme İşlemi

Artık her GitHub'a push yaptığınızda:

1. ✅ GitHub webhook tetiklenir
2. ✅ VPS otomatik git pull yapar
3. ✅ Yeni bağımlılıklar varsa npm install çalışır
4. ✅ Build yapılır
5. ✅ PM2 otomatik restart eder
6. ✅ Site güncellenir

**Manuel güncelleme (gerekirse):**
```bash
cd /var/www/portfolio
bash scripts/deploy.sh
```

## 📝 Önemli Notlar

- İlk kurulumdan sonra `.env` dosyasını asla git'e commit etmeyin
- `GITHUB_WEBHOOK_SECRET` değerini güvenli tutun
- Düzenli backup alın (özellikle `content` klasörü)
- PM2 logs'ları düzenli kontrol edin
- Disk alanını takip edin

## 🆘 Yardım

Sorun yaşarsanız:
1. PM2 loglarını kontrol edin: `pm2 logs portfolio`
2. Nginx loglarını kontrol edin: `sudo tail -f /var/log/nginx/error.log`
3. GitHub webhook delivery'lerini kontrol edin
4. Manuel deploy script'i çalıştırıp hata mesajlarını inceleyin

