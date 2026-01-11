# Nginx Upload Size Limit Düzeltme (413 Hatası)

413 "Payload Too Large" hatası alıyorsanız, bu Nginx'teki body size limitinin aşıldığı anlamına gelir.

## Çözüm: VPS'te Nginx Config Güncelleme

VPS'inize SSH ile bağlanın ve Nginx config dosyanızı düzenleyin:

```bash
sudo nano /etc/nginx/sites-available/onuralpbasar.com
# veya
sudo nano /etc/nginx/sites-available/portfolio
```

### Upload endpoint'i için özel limit:

Nginx config dosyanızda `/api/admin/upload` endpoint'i için özel ayar ekleyin:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Genel body size limiti (büyük video yüklemeleri için)
    client_max_body_size 500M;
    client_body_timeout 300s;
    client_body_buffer_size 128k;

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

    # Upload endpoint için özel ayarlar
    location /api/admin/upload {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Büyük dosya yüklemeleri için
        client_max_body_size 500M;
        client_body_timeout 300s;
        client_body_buffer_size 512k;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
    }

    # Webhook endpoint için özel ayar (gerekirse)
    location /api/webhook/deploy {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

### Nginx'i test edin ve yeniden başlatın:

```bash
# Config dosyasını test et
sudo nginx -t

# Hata yoksa Nginx'i yeniden başlat
sudo systemctl reload nginx
# veya
sudo systemctl restart nginx
```

### Alternatif: Global Nginx Config (Tüm siteler için)

Eğer tüm siteler için limit artırmak istiyorsanız:

```bash
sudo nano /etc/nginx/nginx.conf
```

`http` bloğuna ekleyin:

```nginx
http {
    # ... diğer ayarlar ...
    
    # Büyük dosya yüklemeleri için
    client_max_body_size 500M;
    client_body_timeout 300s;
    client_body_buffer_size 128k;
    
    # ... diğer ayarlar ...
}
```

## Limit Değerleri

- `client_max_body_size`: Maksimum body boyutu (500M = 500MB, 1G = 1GB)
- `client_body_timeout`: Yükleme timeout süresi (300s = 5 dakika)
- `client_body_buffer_size`: Buffer boyutu (128k, 512k gibi)
- `proxy_read_timeout`: Proxy okuma timeout'u
- `proxy_connect_timeout`: Proxy bağlantı timeout'u
- `proxy_send_timeout`: Proxy gönderme timeout'u

## Notlar

- 500M = 500 MB (video yüklemeleri için uygun)
- 1G = 1 GB (çok büyük dosyalar için)
- Disk alanınızı kontrol edin - büyük dosyalar disk alanı kullanır
- Timeout değerlerini dosya boyutuna göre ayarlayın

## Test

Nginx config'i güncelledikten sonra:
1. Nginx'i yeniden başlatın
2. Admin panelinden video yüklemeyi tekrar deneyin
3. Hala 413 hatası alıyorsanız, limit değerini artırın
