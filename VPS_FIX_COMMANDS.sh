#!/bin/bash
# VPS'te çalıştırılacak komutlar

cd /var/www/onuralpbasar.com

# 1. Secret oluştur
echo "=== 1. Secret oluşturuluyor ==="
SECRET=$(openssl rand -hex 32)
echo "Oluşturulan secret: $SECRET"
echo ""
echo "Bu secret'ı kopyalayın ve şu adımları takip edin:"
echo "1. .env dosyasına ekleyin: GITHUB_WEBHOOK_SECRET=$SECRET"
echo "2. GitHub webhook ayarlarına da aynı secret'ı ekleyin"
echo ""

# 2. .env dosyasını kontrol et
echo "=== 2. .env dosyası kontrol ediliyor ==="
if grep -q "GITHUB_WEBHOOK_SECRET" .env; then
    echo "GITHUB_WEBHOOK_SECRET zaten .env dosyasında var"
else
    echo "GITHUB_WEBHOOK_SECRET .env dosyasında YOK - eklenmesi gerekiyor"
    echo ""
    echo "Komutu çalıştırın:"
    echo "echo 'GITHUB_WEBHOOK_SECRET=$SECRET' >> .env"
fi
echo ""

# 3. Build kontrolü
echo "=== 3. Build kontrolü ==="
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
    echo ".next build klasörü mevcut"
else
    echo ".next build klasörü YOK - build yapılması gerekiyor"
    echo ""
    echo "Komutu çalıştırın:"
    echo "npm run build"
fi
echo ""

# 4. Git durumu
echo "=== 4. Git durumu ==="
git log --oneline -3
echo ""

# 5. PM2 durumu
echo "=== 5. PM2 durumu ==="
pm2 list
echo ""
