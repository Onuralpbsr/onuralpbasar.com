# cPanel Deploy Rehberi - Dosya Yöneticisi ile

Bu rehber, Next.js projenizi cPanel **Dosya Yöneticisi** üzerinden deploy etmek için adım adım talimatlar içerir.

## ⚠️ ÖNEMLİ: cPanel'inizde Node.js Desteği Var mı?

**Önce kontrol edin:** cPanel ana sayfanızda **"Node.js Selector"** veya **"Setup Node.js App"** seçeneği var mı?

- ✅ **Varsa:** Aşağıdaki **"Node.js ile Deploy"** bölümünü takip edin
- ❌ **Yoksa:** **"Node.js OLMADAN Deploy (Static Export)"** bölümünü takip edin

---

## 📋 Node.js OLMADAN Deploy (Static Export)

cPanel'inizde Node.js desteği yoksa, projenizi **statik HTML/CSS/JS dosyalarına** dönüştürerek deploy edebilirsiniz. Bu yöntemle:
- ✅ Portföy siteniz çalışır
- ✅ Tüm sayfalar ve içerikler çalışır
- ❌ Admin paneli çalışmaz (API route'ları olmadığı için)
- ❌ İletişim formu API'si çalışmaz (alternatif çözüm gerekir)

### ✅ Adım 1: Proje Ayarlarını Kontrol Etme

Proje zaten static export için hazır! `next.config.mjs` dosyasında:
- ✅ `output: 'export'` aktif
- ✅ `images.unoptimized: true` ayarlı

### 📧 Adım 2: EmailJS Kurulumu (İletişim Formu İçin)

Static export'ta API route'ları çalışmadığı için iletişim formu EmailJS kullanıyor.

**EmailJS Kurulumu (5 dakika):**

1. **[EmailJS.com](https://www.emailjs.com)** sitesine kaydolun (ücretsiz)
2. **Email Services** bölümüne gidin:
   - **"Add New Service"** butonuna tıklayın
   - Gmail, Outlook veya başka bir servis seçin
   - Servisinizi bağlayın ve **Service ID**'yi not edin
3. **Email Templates** bölümüne gidin:
   - **"Create New Template"** butonuna tıklayın
   - Template adı: `Contact Form`
   - Subject: `Yeni İletişim Formu Mesajı - {{from_name}}`
   - Content (HTML):
     ```html
     <h3>Yeni İletişim Formu Mesajı</h3>
     <p><strong>İsim:</strong> {{from_name}}</p>
     <p><strong>E-posta:</strong> {{from_email}}</p>
     <p><strong>Mesaj:</strong></p>
     <p>{{message}}</p>
     ```
   - **Template ID**'yi not edin
4. **Account** > **General** bölümüne gidin:
   - **Public Key**'i kopyalayın

**Environment Variables Ekleme:**

Proje klasörünüzde `.env.local` dosyası oluşturun (veya mevcut `.env` dosyasına ekleyin):

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

**ÖNEMLİ:** Bu değerleri `.env.local` dosyasına ekleyin, build sırasında kullanılacak!

### 🔨 Adım 3: Lokal Build Alma

```bash
# Proje klasörüne gidin
cd /Users/onuralpbasar/Desktop/Portföy

# EmailJS paketini yükleyin
npm install

# Static export build
npm run build
```

**Build işlemi tamamlandıktan sonra:**
- `out` klasörü oluşacaktır
- Bu klasördeki **TÜM DOSYALAR** statik sitenizdir
- `out` klasörünün içinde `index.html`, `_next` klasörü ve diğer dosyalar olacak

**Build sırasında hata alırsanız:**
- EmailJS environment variables'ların doğru eklendiğinden emin olun
- `npm install` komutunu tekrar çalıştırın

### 📤 Adım 4: Dosyaları cPanel File Manager ile Yükleme

#### 4.1. cPanel'e Giriş
1. Hosting sağlayıcınızın cPanel paneline giriş yapın
2. Ana sayfada **"File Manager"** veya **"Dosya Yöneticisi"** seçeneğine tıklayın

#### 4.2. Doğru Klasöre Gitme
1. Sol taraftaki klasör ağacından `public_html` klasörüne gidin
   - **Ana domain için:** `public_html`
   - **Alt domain için:** `public_html/altdomain_adi`

#### 4.3. Mevcut Dosyaları Temizleme (İlk Deploy)
- Eğer daha önce deploy yaptıysanız, eski dosyaları silin
- **DİKKAT:** Sadece proje dosyalarını silin, sistem dosyalarını (örn: `.htaccess`) koruyun

#### 4.4. Dosya Yükleme Yöntemleri

**Yöntem A: ZIP ile Toplu Yükleme (ÖNERİLEN - En Kolay)**

1. **Lokal bilgisayarınızda:**
   - `out` klasörünün **içindeki tüm dosyaları** seçin
   - ZIP dosyası oluşturun (örn: `portfolio-static.zip`)
   - **ÖNEMLİ:** `out` klasörünün kendisini değil, **içindeki dosyaları** ZIP'leyin!

2. **cPanel File Manager'da:**
   - Üst menüden **"Upload"** butonuna tıklayın
   - ZIP dosyanızı seçip yükleyin
   - Yükleme tamamlandıktan sonra ZIP dosyasına sağ tıklayın
   - **"Extract"** (Aç) seçeneğini seçin
   - Dosyalar otomatik olarak `public_html` klasörüne açılacaktır
   - ZIP dosyasını silebilirsiniz

**Yöntem B: Tek Tek Klasör Yükleme**

1. File Manager'da **"Upload"** butonuna tıklayın
2. `out` klasörünün içindeki dosyaları sırayla yükleyin:
   - `index.html`
   - `_next` klasörü (tüm içeriğiyle)
   - Diğer dosyalar (varsa)

**ÖNEMLİ NOTLAR:**
- `_next` klasörü çok büyük olabilir, ZIP ile yüklemek daha hızlıdır
- Gizli dosyaları görmek için File Manager Settings > "Show Hidden Files" aktif edin
- Yükleme sırasında hata alırsanız, dosya boyutu limitini kontrol edin

#### 4.5: .htaccess Dosyası

`.htaccess` dosyasını `public_html` klasörüne yükleyin (Next.js routing için gerekli).

Eğer `.htaccess` dosyası yoksa, aşağıdaki içeriği kullanarak oluşturun:

```apache
# Next.js Static Export için .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Dosya ve klasörler için direkt erişim
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Tüm istekleri index.html'e yönlendir
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Güvenlik Headers
<IfModule mod_headers.c>
  Header set X-DNS-Prefetch-Control "on"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Gzip sıkıştırma
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

#### 4.6: Dosya İzinlerini Kontrol Etme

1. Tüm klasörler için izin: **755** (drwxr-xr-x)
2. Tüm dosyalar için izin: **644** (-rw-r--r--)
3. İzinleri değiştirmek için dosya/klasöre sağ tıklayın > **"Change Permissions"**

### ✅ Adım 5: Test ve Kontrol

1. **Tarayıcınızda domain adresinizi açın** (örn: `https://alanadi.com`)
2. **Ana sayfa yükleniyorsa başarılı!** ✅
3. **İletişim formunu test edin:**
   - Formu doldurup gönderin
   - EmailJS ayarlarınız doğruysa, e-postanızı alacaksınız
4. **Tüm sayfaları kontrol edin:**
   - Video galeri
   - Referanslar
   - Hizmetler
   - Ekipmanlar
   - İletişim

**⚠️ ÖNEMLİ NOTLAR:**
- ❌ Admin paneli çalışmayacaktır (`/adminpanel/*` route'ları)
- ❌ API route'ları çalışmayacaktır (`/api/*` route'ları)
- ✅ Portföy sitesi tamamen çalışır
- ✅ İletişim formu EmailJS ile çalışır (ayarlarınız doğruysa)

### 🔄 Güncelleme Yaparken

İçerik güncellemesi yapmak istediğinizde:

1. Lokal bilgisayarınızda içeriği güncelleyin (`content/*.json` dosyaları)
2. Build alın: `npm run build`
3. cPanel File Manager'da sadece değişen dosyaları yükleyin
4. Genellikle sadece `_next` klasörünü yeniden yüklemeniz yeterli

---

## 🚀 Node.js ile Deploy (Normal Yöntem)

cPanel'inizde Node.js desteği varsa, aşağıdaki adımları takip edin:

### Hızlı Başlangıç Özeti

1. **Lokal Build:** `npm install` → `npm run build`
2. **Dosya Yükleme:** ZIP olarak sıkıştır → cPanel File Manager → Upload → Extract
3. **Node.js Kurulumu:** Node.js Selector → Create Application → NPM Install
4. **Environment Variables:** Node.js Selector → Edit → Environment Variables ekle
5. **Başlatma:** Node.js Selector → Restart

**Tahmini Süre:** 15-30 dakika (ilk deploy için)

## Ön Hazırlık

### 1. Production Build Oluşturma

Projeyi build etmeden önce, `.env` dosyasını oluşturduğunuzdan emin olun:

```bash
# .env.example dosyasını .env olarak kopyalayın
cp .env.example .env

# .env dosyasını düzenleyin ve admin bilgilerini girin
# ADMIN_USERNAME=your_username
# ADMIN_PASSWORD=your_secure_password
# NODE_ENV=production
```

### 2. Build İşlemi

```bash
# Bağımlılıkları yükleyin
npm install

# Production build oluşturun
npm run build
```

Build işlemi tamamlandıktan sonra `.next` klasörü oluşacaktır.

## cPanel Deploy Adımları - Dosya Yöneticisi ile

### 1. Lokal Bilgisayarınızda Build Alma

**ÖNEMLİ:** Önce projenizi lokal bilgisayarınızda build etmeniz gerekiyor!

```bash
# Proje klasörüne gidin
cd /Users/onuralpbasar/Desktop/Portföy

# Bağımlılıkları yükleyin
npm install

# Production build oluşturun
npm run build
```

Build işlemi tamamlandıktan sonra `.next` klasörü oluşacaktır. Bu klasörü mutlaka yüklemeniz gerekiyor!

### 2. cPanel Dosya Yöneticisi ile Dosya Yükleme

#### Adım 1: cPanel'e Giriş
1. Hosting sağlayıcınızın cPanel paneline giriş yapın
2. Ana sayfada **"File Manager"** veya **"Dosya Yöneticisi"** seçeneğine tıklayın

#### Adım 2: Doğru Klasöre Gitme
1. Sol taraftaki klasör ağacından `public_html` klasörüne gidin
   - **Not:** Eğer alt domain kullanıyorsanız (örn: `subdomain.alanadi.com`), `public_html/subdomain` klasörüne gidin
   - Ana domain için: `public_html`
   - Alt domain için: `public_html/altdomain_adi`

#### Adım 3: Mevcut Dosyaları Temizleme (İlk Deploy İçin)
- Eğer daha önce deploy yaptıysanız, eski dosyaları silmek isteyebilirsiniz
- **DİKKAT:** Sadece proje dosyalarını silin, sistem dosyalarını silmeyin!

#### Adım 4: Dosya Yükleme Yöntemleri

**Yöntem A: ZIP ile Toplu Yükleme (ÖNERİLEN)**

1. Lokal bilgisayarınızda proje klasörünü ZIP olarak sıkıştırın:
   - Tüm klasör ve dosyaları seçin
   - ZIP dosyası oluşturun (örn: `portfolio.zip`)

2. cPanel File Manager'da:
   - Üst menüden **"Upload"** butonuna tıklayın
   - ZIP dosyanızı seçip yükleyin
   - Yükleme tamamlandıktan sonra ZIP dosyasına sağ tıklayın
   - **"Extract"** (Aç) seçeneğini seçin
   - Dosyalar otomatik olarak açılacaktır
   - ZIP dosyasını silebilirsiniz

**Yöntem B: Tek Tek Klasör Yükleme**

1. File Manager'da **"Upload"** butonuna tıklayın
2. Aşağıdaki klasör ve dosyaları sırayla yükleyin:

**Yüklenecek Klasörler:**
- `.next` klasörü (build çıktısı - ÇOK ÖNEMLİ!)
- `public` klasörü
- `content` klasörü
- `app` klasörü
- `components` klasörü
- `lib` klasörü

**Yüklenecek Dosyalar:**
- `middleware.ts`
- `next.config.mjs`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.htaccess` (güvenlik için önemli!)
- `next-env.d.ts`

**ÖNEMLİ NOTLAR:**
- `.next` klasörü mutlaka yüklenmelidir (build çıktısı)
- `node_modules` klasörünü **YÜKLEMEYİN** (cPanel'de npm install yapılacak)
- `.env` dosyasını şimdilik yüklemeyin (sonra environment variables olarak ekleyeceğiz)
- Gizli dosyaları görmek için File Manager'da **"Settings"** > **"Show Hidden Files"** seçeneğini aktif edin

#### Adım 5: Dosya İzinlerini Kontrol Etme
1. Tüm klasörler için izin: **755** (drwxr-xr-x)
2. Tüm dosyalar için izin: **644** (-rw-r--r--)
3. İzinleri değiştirmek için dosya/klasöre sağ tıklayın > **"Change Permissions"**

### 3. Node.js Uygulaması Kurulumu

cPanel'de Next.js uygulamanızı çalıştırmak için Node.js uygulaması oluşturmanız gerekiyor:

#### Adım 1: Node.js Selector'a Erişim
1. cPanel ana sayfasında **"Node.js Selector"** veya **"Setup Node.js App"** seçeneğine tıklayın
2. Eğer bu seçenek yoksa, hosting sağlayıcınızla iletişime geçin (Node.js desteği olmayabilir)

#### Adım 2: Yeni Uygulama Oluşturma
1. **"Create Application"** veya **"Yeni Uygulama Oluştur"** butonuna tıklayın
2. Aşağıdaki ayarları yapın:

   - **Node.js Version:** `18.x` veya `20.x` (önerilen: 20.x)
   - **Application Mode:** `Production`
   - **Application Root:** 
     - Ana domain için: `public_html`
     - Alt domain için: `public_html/altdomain_adi`
   - **Application URL:** 
     - Ana domain için: `alanadi.com` veya `www.alanadi.com`
     - Alt domain için: `subdomain.alanadi.com`
   - **Application Startup File:** `server.js` (bazı cPanel'lerde istenebilir, aşağıda oluşturacağız)

3. **"Create"** butonuna tıklayın

#### Adım 3: NPM Install Çalıştırma
1. Oluşturduğunuz uygulamanın yanında **"NPM Install"** butonuna tıklayın
2. Bu işlem `package.json` dosyasındaki bağımlılıkları yükleyecektir
3. İşlem tamamlanana kadar bekleyin (birkaç dakika sürebilir)

### 4. Environment Variables Ayarlama

#### Yöntem A: cPanel Node.js Selector ile (ÖNERİLEN)

1. Node.js Selector'da uygulamanızı bulun
2. Uygulamanın yanındaki **"Edit"** veya **"Düzenle"** butonuna tıklayın
3. **"Environment Variables"** veya **"Ortam Değişkenleri"** bölümüne gidin
4. Aşağıdaki değişkenleri ekleyin:

   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   NODE_ENV=production
   ```

5. Her değişkeni ekledikten sonra **"Save"** veya **"Kaydet"** butonuna tıklayın

#### Yöntem B: .env Dosyası ile (Alternatif)

Eğer Node.js Selector'da environment variables ekleyemiyorsanız:

1. Lokal bilgisayarınızda `.env` dosyası oluşturun:
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   NODE_ENV=production
   ```

2. File Manager'da `.env` dosyasını yükleyin
3. Dosya izinlerini **600** yapın (sadece sahibi okuyabilir)
4. `.htaccess` dosyasının `.env` dosyasını koruduğundan emin olun

### 5. Server.js Dosyası Oluşturma (Gerekirse)

Bazı cPanel yapılandırmaları `server.js` dosyası isteyebilir. Eğer Node.js Selector'da "Startup File" olarak `server.js` istiyorsa:

1. Lokal bilgisayarınızda `server.js` dosyası oluşturun:

```javascript
// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

2. File Manager üzerinden `server.js` dosyasını yükleyin

**NOT:** Eğer cPanel'iniz Next.js'i doğrudan destekliyorsa (örn: `npm start` komutu çalışıyorsa), `server.js` dosyasına gerek olmayabilir. Önce `server.js` olmadan deneyin.

### 6. Package.json Scripts Kontrolü

`package.json` dosyanızda şu scriptlerin olduğundan emin olun (zaten mevcut):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 7. Uygulamayı Başlatma

1. Node.js Selector'da uygulamanızı bulun
2. **"Restart"** veya **"Yeniden Başlat"** butonuna tıklayın
3. Eğer uygulama durmuşsa, **"Start"** veya **"Başlat"** butonuna tıklayın
4. Uygulamanın çalıştığını kontrol etmek için:
   - **"View Logs"** veya **"Logları Görüntüle"** butonuna tıklayın
   - Hata mesajı yoksa, tarayıcınızda domain adresinizi açın

### 8. İlk Kontrol

1. Tarayıcınızda domain adresinizi açın (örn: `https://alanadi.com`)
2. Ana sayfa yükleniyorsa başarılı!
3. Admin paneline giriş yapmayı deneyin: `https://alanadi.com/adminpanel/login`
4. Eğer hata alıyorsanız, Node.js Selector'daki logları kontrol edin

## Güvenlik Kontrol Listesi

Deploy sonrası şunları kontrol edin:

- [ ] `.env` dosyası `.htaccess` ile korunuyor mu?
- [ ] Admin paneli sadece doğru kimlik bilgileriyle erişilebilir mi?
- [ ] API route'ları authentication gerektiriyor mu?
- [ ] Rate limiting çalışıyor mu? (login endpoint'inde)
- [ ] HTTPS aktif mi? (production için zorunlu)
- [ ] Güvenlik headers'ları aktif mi?

## Sorun Giderme

### Build Hatası (Lokal Bilgisayarda)

- Node.js versiyonunu kontrol edin: `node --version` (18.x veya 20.x önerilir)
- `npm install` komutunu tekrar çalıştırın
- `node_modules` klasörünü silip tekrar yükleyin:
  ```bash
  rm -rf node_modules
  npm install
  npm run build
  ```

### Dosya Yükleme Sorunları

**Problem:** ZIP dosyası açılmıyor
- **Çözüm:** File Manager'da ZIP dosyasına sağ tıklayın > "Extract" seçeneğini kullanın
- Alternatif: ZIP dosyasını lokal bilgisayarınızda açıp klasörleri tek tek yükleyin

**Problem:** `.next` klasörü yüklenmiyor
- **Çözüm:** Gizli dosyaları görmek için File Manager Settings > "Show Hidden Files" aktif edin
- `.next` klasörü büyük olabilir, ZIP ile yüklemeyi deneyin

**Problem:** Dosya izinleri yanlış
- **Çözüm:** File Manager'da dosya/klasöre sağ tıklayın > "Change Permissions"
- Klasörler: **755**
- Dosyalar: **644**

### Uygulama Başlamıyor

**Problem:** Node.js uygulaması başlamıyor
- **Çözüm 1:** Node.js Selector'da **"View Logs"** butonuna tıklayın ve hata mesajlarını kontrol edin
- **Çözüm 2:** Environment variables'ların doğru ayarlandığından emin olun
- **Çözüm 3:** `package.json` dosyasının doğru yüklendiğinden emin olun
- **Çözüm 4:** Node.js Selector'da **"NPM Install"** butonunu tekrar çalıştırın
- **Çözüm 5:** Port numarasını kontrol edin (genellikle cPanel otomatik ayarlar)

**Problem:** "Cannot find module" hatası
- **Çözüm:** Node.js Selector'da **"NPM Install"** butonunu çalıştırın
- `node_modules` klasörünün yüklendiğinden emin olun (File Manager'da kontrol edin)

### 404 Hataları

**Problem:** Sayfa bulunamıyor
- **Çözüm 1:** `.htaccess` dosyasının `public_html` klasöründe olduğundan emin olun
- **Çözüm 2:** `.next` klasörünün tamamen yüklendiğinden emin olun
- **Çözüm 3:** `app` klasörünün doğru yüklendiğinden emin olun
- **Çözüm 4:** Node.js uygulamasının çalıştığından emin olun (Node.js Selector'da kontrol edin)

**Problem:** Statik dosyalar (resimler, videolar) yüklenmiyor
- **Çözüm:** `public` klasörünün doğru yüklendiğinden ve içindeki dosyaların tam olduğundan emin olun

### Admin Paneli Erişim Sorunu

**Problem:** Login sayfası açılmıyor
- **Çözüm 1:** URL'yi kontrol edin: `https://alanadi.com/adminpanel/login`
- **Çözüm 2:** Browser console'da hata mesajlarını kontrol edin (F12 > Console)
- **Çözüm 3:** Environment variables'ların doğru ayarlandığından emin olun

**Problem:** Login yapamıyorum
- **Çözüm 1:** Environment variables'da `ADMIN_USERNAME` ve `ADMIN_PASSWORD` değerlerini kontrol edin
- **Çözüm 2:** Cookie ayarlarını kontrol edin (HTTPS kullanıyorsanız secure flag true olmalı)
- **Çözüm 3:** Browser'da çerezleri temizleyip tekrar deneyin

### Diğer Sorunlar

**Problem:** "Internal Server Error" hatası
- **Çözüm:** Node.js Selector'da **"View Logs"** butonuna tıklayın
- Log dosyalarında hata mesajlarını arayın
- Genellikle environment variables veya dosya izinleri ile ilgilidir

**Problem:** Site çok yavaş yükleniyor
- **Çözüm 1:** `.next` klasörünün tamamen yüklendiğinden emin olun
- **Çözüm 2:** `public` klasöründeki büyük video dosyalarını optimize edin
- **Çözüm 3:** CDN kullanmayı düşünün

## Önemli Notlar ve İpuçları

### Güvenlik
1. **Asla `.env` dosyasını git'e commit etmeyin!**
2. **Admin şifresini güçlü tutun** (en az 12 karakter, büyük/küçük harf, sayı, özel karakter)
3. **Production'da HTTPS kullanın** (SSL sertifikası kurulu olmalı)
4. **`.htaccess` dosyasını mutlaka yükleyin** (güvenlik için kritik)

### Backup ve Güncelleme
5. **Düzenli olarak backup alın** (özellikle `content` klasörü)
   - File Manager'da klasöre sağ tıklayın > "Compress" > ZIP oluşturun
   - Lokal bilgisayarınıza indirin
6. **Güncelleme yaparken:**
   - Lokal'de build alın
   - Sadece değişen dosyaları yükleyin (genellikle `.next` klasörü)
   - Node.js Selector'da **"Restart"** yapın

### Performans
7. **Node.js versiyonunu güncel tutun** (güvenlik güncellemeleri için)
8. **Büyük dosyalar için:** Video dosyalarını optimize edin veya CDN kullanın
9. **İlk deploy sonrası:** Site hızını test edin (Google PageSpeed Insights)

### Dosya Yöneticisi İpuçları
10. **Gizli dosyaları görmek için:** File Manager Settings > "Show Hidden Files"
11. **Toplu işlem için:** ZIP kullanın (daha hızlı)
12. **Dosya izinleri:** Klasörler 755, Dosyalar 644
13. **Yükleme limiti:** Eğer dosya çok büyükse, hosting sağlayıcınızla iletişime geçin

## 🔄 Alternatif Hosting Seçenekleri

cPanel'inizde Node.js desteği yoksa ve admin paneli de çalışmasını istiyorsanız, aşağıdaki hosting seçeneklerini değerlendirebilirsiniz:

### 1. Vercel (ÖNERİLEN - Ücretsiz)

Next.js'in yapımcıları tarafından geliştirilmiş, Next.js için en uygun hosting:

**Avantajlar:**
- ✅ Tamamen ücretsiz
- ✅ Node.js desteği var
- ✅ Otomatik SSL
- ✅ Git ile otomatik deploy
- ✅ Global CDN
- ✅ Kolay kurulum

**Kurulum:**
1. [Vercel.com](https://vercel.com) sitesine kaydolun
2. GitHub hesabınızla bağlayın
3. Projenizi seçin
4. Deploy butonuna tıklayın
5. Environment variables ekleyin
6. Tamamlandı!

**Tahmini Süre:** 5 dakika

### 2. Netlify

**Avantajlar:**
- ✅ Ücretsiz plan mevcut
- ✅ Node.js desteği var
- ✅ Otomatik SSL
- ✅ Git ile otomatik deploy

**Kurulum:**
1. [Netlify.com](https://netlify.com) sitesine kaydolun
2. Projenizi yükleyin veya Git ile bağlayın
3. Build komutu: `npm run build`
4. Publish directory: `.next`
5. Environment variables ekleyin

### 3. Railway

**Avantajlar:**
- ✅ Node.js desteği var
- ✅ Kolay kurulum
- ✅ Ücretsiz deneme

**Kurulum:**
1. [Railway.app](https://railway.app) sitesine kaydolun
2. GitHub ile bağlayın
3. Projenizi seçin
4. Otomatik deploy başlar

### 4. Render

**Avantajlar:**
- ✅ Ücretsiz plan mevcut
- ✅ Node.js desteği var
- ✅ Otomatik SSL

**Kurulum:**
1. [Render.com](https://render.com) sitesine kaydolun
2. "New Web Service" seçin
3. GitHub repo'nuzu bağlayın
4. Build komutu: `npm run build`
5. Start komutu: `npm start`

---

## 📧 İletişim Formu için EmailJS Entegrasyonu (Static Export İçin)

Static export kullanıyorsanız, iletişim formunu EmailJS ile değiştirmeniz gerekir:

### EmailJS Kurulumu

1. [EmailJS.com](https://www.emailjs.com) sitesine kaydolun (ücretsiz)
2. **Email Services** bölümünden servisinizi ekleyin (Gmail, Outlook vb.)
3. **Email Templates** bölümünden yeni template oluşturun:
   - Subject: `Yeni İletişim Formu Mesajı`
   - Body:
     ```
     İsim: {{from_name}}
     E-posta: {{from_email}}
     Mesaj: {{message}}
     ```
4. **Account** > **General** bölümünden **Public Key**'i kopyalayın
5. Service ID, Template ID ve Public Key'i not edin

### Contact.tsx Güncellemesi

`components/Contact.tsx` dosyasındaki `handleSubmit` fonksiyonunu şu şekilde değiştirin:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // EmailJS kütüphanesini yükleyin: npm install @emailjs/browser
    const emailjs = await import('@emailjs/browser');
    
    await emailjs.default.send(
      'YOUR_SERVICE_ID',      // EmailJS Service ID
      'YOUR_TEMPLATE_ID',      // EmailJS Template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      },
      'YOUR_PUBLIC_KEY'        // EmailJS Public Key
    );

    alert("Mesajınız gönderildi! En kısa sürede size dönüş yapacağım.");
    setFormData({ name: "", email: "", message: "" });
  } catch (error) {
    console.error("Form submission error:", error);
    alert("Bir hata oluştu. Lütfen tekrar deneyin.");
  }
};
```

**Package.json'a ekleyin:**
```bash
npm install @emailjs/browser
```

---

## İletişim

Sorun yaşarsanız, cPanel hosting sağlayıcınızın destek ekibiyle iletişime geçin.

