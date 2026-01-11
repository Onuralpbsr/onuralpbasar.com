# PM2 Environment Variables Fix

## Sorun

PM2 `.env` dosyasını otomatik olarak okumaz. Environment variable'ları eklemek için birkaç yöntem var.

## Çözüm 1: PM2 Delete ve Yeniden Start (ÖNERİLEN)

```bash
cd /var/www/onuralpbasar.com

# 1. .env dosyasında secret olduğundan emin olun
grep GITHUB_WEBHOOK_SECRET .env

# 2. PM2'yi durdurun ve silin
pm2 delete portfolio

# 3. Yeniden başlatın (Next.js .env dosyasını otomatik okur)
pm2 start ecosystem.config.js

# 4. Kontrol edin
pm2 logs portfolio --lines 20
```

## Çözüm 2: Ecosystem Config ile .env Okuma

Eğer yukarıdaki çözüm çalışmazsa, ecosystem.config.js'i güncelleyin (bu dosyayı güncelleyeceğiz).

## Çözüm 3: Manuel Environment Variable Ekleme

```bash
# PM2'ye environment variable ekle
pm2 restart portfolio --update-env -- GITHUB_WEBHOOK_SECRET=$(grep GITHUB_WEBHOOK_SECRET .env | cut -d '=' -f2)
```

Ama bu karmaşık. En basiti Çözüm 1.
