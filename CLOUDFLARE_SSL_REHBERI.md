# Cloudflare SSL Kurulum Rehberi

Bu rehber, Cloudflare üzerinden ücretsiz SSL sertifikası kurmanız için adım adım talimatlar içerir.

## 📋 Ön Gereksinimler

- Domain adınız (örn: `onuralpbasar.com`)
- Cloudflare hesabı (ücretsiz)
- Domain DNS kayıtları Cloudflare'e taşınmış olmalı

## 🚀 Cloudflare SSL Kurulumu

### 1. Cloudflare Hesabı Oluşturma

1. [Cloudflare.com](https://www.cloudflare.com) sitesine gidin
2. **Sign Up** butonuna tıklayın
3. Email ve şifre ile hesap oluşturun
4. Email doğrulama yapın

### 2. Domain Eklememe

1. Cloudflare dashboard'a giriş yapın
2. **Add a Site** butonuna tıklayın
3. Domain adınızı girin (örn: `onuralpbasar.com`)
4. **Add site** butonuna tıklayın
5. Cloudflare domain'inizi tarayacak ve DNS kayıtlarını bulacak

### 3. DNS Ayarlarını Kontrol Etme

1. Cloudflare otomatik olarak DNS kayıtlarınızı bulacak
2. **DNS Records** bölümünde şunların olduğundan emin olun:
   - **A Record**: `@` → VPS IP adresiniz (IPv4)
   - **A Record**: `www` → VPS IP adresiniz (IPv4)
   - **CNAME**: `www` → `@` (opsiyonel)

3. Eğer eksik kayıt varsa, **Add record** ile ekleyin:
   ```
   Type: A
   Name: @
   IPv4 address: YOUR_VPS_IP
   Proxy status: Proxied (🟠)
   ```

   ```
   Type: A
   Name: www
   IPv4 address: YOUR_VPS_IP
   Proxy status: Proxied (🟠)
   ```

4. **Proxy status** önemli: **🟠 Proxied** (turuncu bulut) olmalı - bu SSL ve CDN için gerekli

### 4. Nameserver'ları Değiştirme

1. Cloudflare size 2 nameserver verecek (örn: `bob.ns.cloudflare.com` ve `alice.ns.cloudflare.com`)
2. Domain sağlayıcınızın (örn: GoDaddy, Namecheap) kontrol paneline gidin
3. **Nameservers** bölümüne gidin
4. Cloudflare'den aldığınız nameserver'ları yapıştırın
5. Kaydedin

**ÖNEMLİ:** Nameserver değişikliği 24-48 saat sürebilir (genellikle 1-2 saat içinde geçerli olur)

### 5. SSL/TLS Ayarları

1. Cloudflare dashboard'da domain'inizi seçin
2. Sol menüden **SSL/TLS** bölümüne gidin
3. **Overview** sekmesinde:
   - **Encryption mode**: **Full** veya **Full (strict)** seçin
   - **Full (strict)** önerilir (VPS'te SSL sertifikası varsa)
   - **Full** kullanıyorsanız VPS'te SSL olmasa bile çalışır (Cloudflare ile VPS arasında şifrelenir)

4. **Edge Certificates** sekmesinde:
   - **Always Use HTTPS**: **On** yapın (HTTP'yi HTTPS'ye yönlendirir)
   - **Automatic HTTPS Rewrites**: **On** yapın
   - **Minimum TLS Version**: **TLS 1.2** veya üzeri (önerilen: **TLS 1.2**)

5. **Origin Server** sekmesinde (opsiyonel - VPS'te SSL istiyorsanız):
   - **Create Certificate** butonuna tıklayın
   - Bu, Cloudflare ile VPS arasındaki bağlantıyı şifreler

### 6. SSL Sertifikasının Aktif Olmasını Bekleme

- SSL sertifikası genellikle 15 dakika içinde aktif olur
- **Always Use HTTPS** açıksa, HTTP otomatik olarak HTTPS'ye yönlendirilir
- Tarayıcıda domain adresinizi açın: `https://onuralpbasar.com`
- Yeşil kilit simgesi görünmeli ✅

## ✅ Test ve Kontrol

### SSL Durumunu Kontrol Etme

1. **SSL Labs SSL Test**: [SSL Labs](https://www.ssllabs.com/ssltest/) sitesine gidin
2. Domain adınızı girin: `onuralpbasar.com`
3. **Submit** butonuna tıklayın
4. Test sonuçlarını bekleyin (birkaç dakika sürebilir)
5. **A+** veya **A** notu almalısınız ✅

### Tarayıcıda Kontrol

1. Tarayıcınızda domain adresinizi açın: `https://onuralpbasar.com`
2. Adres çubuğunda **yeşil kilit** simgesi olmalı
3. Kilit simgesine tıklayın → **Connection is secure** görünmeli
4. Certificate bilgilerini görebilirsiniz

## 🔧 VPS'te Nginx Ayarları (Cloudflare Proxy İçin)

Cloudflare proxy kullanıyorsanız (🟠 Proxied), VPS'te SSL olmasa bile Cloudflare SSL sağlar. Ancak yine de Nginx'i Cloudflare IP'lerini tanıyacak şekilde ayarlamanız önerilir.

### Cloudflare IP'lerini Nginx'e Eklememe

1. VPS'te Nginx config dosyasını düzenleyin:
   ```bash
   sudo nano /etc/nginx/sites-available/onuralpbasar.com
   ```

2. Şu ayarları ekleyin:
   ```nginx
   # Cloudflare Real IP
   set_real_ip_from 173.245.48.0/20;
   set_real_ip_from 103.21.244.0/22;
   set_real_ip_from 103.22.200.0/22;
   set_real_ip_from 103.31.4.0/22;
   set_real_ip_from 141.101.64.0/18;
   set_real_ip_from 108.162.192.0/18;
   set_real_ip_from 190.93.240.0/20;
   set_real_ip_from 188.114.96.0/20;
   set_real_ip_from 197.234.240.0/22;
   set_real_ip_from 198.41.128.0/17;
   set_real_ip_from 162.158.0.0/15;
   set_real_ip_from 104.16.0.0/13;
   set_real_ip_from 104.24.0.0/14;
   set_real_ip_from 172.64.0.0/13;
   set_real_ip_from 131.0.72.0/22;
   set_real_ip_from 2400:cb00::/32;
   set_real_ip_from 2606:4700::/32;
   set_real_ip_from 2803:f800::/32;
   set_real_ip_from 2405:b500::/32;
   set_real_ip_from 2405:8100::/32;
   set_real_ip_from 2c0f:f248::/32;
   set_real_ip_from 2a06:98c0::/29;
   real_ip_header CF-Connecting-IP;
   
   server {
       listen 80;
       server_name onuralpbasar.com www.onuralpbasar.com;
       
       # Cloudflare proxy kullanıyorsanız, gerçek IP'yi al
       real_ip_header CF-Connecting-IP;
       
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
   }
   ```

3. Nginx'i test edin ve yeniden yükleyin:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🔒 SSL Kurulduktan Sonra Yapılacaklar

### 1. Next.js Cookie Ayarlarını Güncelleme

SSL kurulduktan sonra, VPS'te `.env` dosyasına veya uygulama ayarlarına `NODE_ENV=production` olduğundan ve HTTPS kullanıldığından emin olun.

Login route'u artık otomatik olarak HTTPS algılayacak ve `secure: true` kullanacak.

### 2. Always Use HTTPS Kontrolü

Cloudflare'de **SSL/TLS** → **Edge Certificates** → **Always Use HTTPS** açık olmalı. Bu HTTP'yi HTTPS'ye yönlendirir.

## 📊 Cloudflare Ücretsiz Plan Özellikleri

Cloudflare ücretsiz planında şunlar dahil:
- ✅ Ücretsiz SSL sertifikası
- ✅ CDN (Content Delivery Network)
- ✅ DDoS koruması
- ✅ Güvenlik duvarı (temel)
- ✅ Analytics (temel)
- ✅ Email forwarding
- ✅ Page Rules (3 adet)

## 🆘 Sorun Giderme

### SSL Aktif Olmuyor

1. **Nameserver değişikliği tamamlandı mı kontrol edin:**
   ```bash
   # Terminal'de kontrol
   nslookup -type=NS onuralpbasar.com
   ```
   Cloudflare nameserver'larını görmelisiniz

2. **DNS Propagation kontrolü:**
   - [WhatsMyDNS.net](https://www.whatsmydns.net) sitesine gidin
   - Domain adınızı ve A record'u seçin
   - Dünya genelinde DNS propagation'ı kontrol edin

3. **Proxy durumu:** DNS kayıtlarında **🟠 Proxied** (turuncu bulut) olmalı

### Mixed Content Uyarıları

- HTTP ve HTTPS karışımı olmamalı
- Tüm kaynaklar HTTPS olmalı (resimler, CSS, JS dosyaları)
- Cloudflare'de **Automatic HTTPS Rewrites** açık olmalı

### SSL Sertifikası Geçersiz

- Cloudflare'de **SSL/TLS** → **Overview** → **Encryption mode** kontrol edin
- **Full** veya **Full (strict)** seçili olmalı
- 15 dakika bekleyin ve tekrar kontrol edin

## 🎉 Başarılı!

SSL kurulumu tamamlandıktan sonra:
- ✅ Siteniz `https://onuralpbasar.com` adresinden erişilebilir olacak
- ✅ Admin paneli cookie'leri güvenli şekilde çalışacak
- ✅ SEO için daha iyi (Google HTTPS'yi tercih eder)
- ✅ Güvenlik artacak

## 📝 Sonraki Adımlar

1. ✅ SSL kurulumunu tamamlayın
2. ✅ VPS'te `.env` dosyasında `NODE_ENV=production` olduğundan emin olun
3. ✅ Uygulamayı yeniden başlatın: `pm2 restart portfolio`
4. ✅ Admin paneline `https://onuralpbasar.com/adminpanel/login` adresinden giriş yapmayı deneyin
5. ✅ Cookie'ler artık güvenli şekilde çalışacak

## 🔗 Yararlı Kaynaklar

- [Cloudflare SSL Docs](https://developers.cloudflare.com/ssl/)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [What's My DNS](https://www.whatsmydns.net)
