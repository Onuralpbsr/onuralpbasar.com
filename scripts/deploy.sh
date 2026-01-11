#!/bin/bash

# GitHub Webhook Deploy Script
# Bu script otomatik olarak git pull, build ve restart işlemlerini yapar

set -e  # Hata durumunda dur

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log fonksiyonu
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Proje dizinine git
cd "$(dirname "$0")/.." || exit 1
PROJECT_DIR=$(pwd)

log "Deploy başlatılıyor: $PROJECT_DIR"

# Git pull
log "Git pull yapılıyor..."
git fetch origin
git reset --hard origin/main 2>/dev/null || git reset --hard origin/master 2>/dev/null

# Yeni commit bilgisi
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)
log "Commit: $COMMIT_HASH - $COMMIT_MSG"

# Node modules kontrolü ve güncelleme
if [ -f "package.json" ]; then
    log "Bağımlılıklar kontrol ediliyor..."
    
    # package.json değiştiyse npm install yap
    if git diff HEAD@{1} HEAD --name-only | grep -q "package.json\|package-lock.json"; then
        log "package.json değişti, npm install çalıştırılıyor..."
        npm install --production=false
    else
        log "package.json değişmedi, npm install atlanıyor..."
    fi
else
    error "package.json bulunamadı!"
    exit 1
fi

# Önceki build ve cache'leri temizle (Server Action hatası için önemli)
log "Eski build ve cache temizleniyor..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
log "Temizlik tamamlandı"

# Build işlemi
log "Next.js build yapılıyor..."
npm run build

# PM2 ile restart (eğer PM2 kullanıyorsanız)
if command -v pm2 &> /dev/null; then
    log "PM2 ile uygulama yeniden başlatılıyor..."
    
    # PM2 process name (ecosystem.config.js'den alınabilir)
    PM2_APP_NAME=${PM2_APP_NAME:-"portfolio"}
    
    # Eğer process çalışıyorsa restart (Server Action cache sorunları için restart gerekli)
    if pm2 list | grep -q "$PM2_APP_NAME"; then
        # Server Action hatalarını önlemek için restart kullan
        # Bu cache uyumsuzluklarını çözer
        log "PM2 process yeniden başlatılıyor (cache temizleme için)..."
        pm2 restart "$PM2_APP_NAME" --update-env
    else
        warning "PM2 process bulunamadı, başlatılıyor..."
        pm2 start ecosystem.config.js || pm2 start npm --name "$PM2_APP_NAME" -- start
    fi
    
    # Kısa bir bekleme (uygulamanın başlaması için)
    sleep 2
    
    log "PM2 durumu:"
    pm2 list
    
    # PM2 health check
    PM2_STATUS=$(pm2 jlist | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ "$PM2_STATUS" != "online" ]; then
        error "PM2 uygulaması online değil! Durum: $PM2_STATUS"
        log "Son hatalar için: pm2 logs $PM2_APP_NAME --err --lines 20"
        exit 1
    fi
else
    warning "PM2 bulunamadı, manuel restart gerekebilir"
    log "Manuel restart için: pm2 restart portfolio veya systemctl restart portfolio"
fi

# Runtime cache temizleme (Server Action cache'leri için)
log "Next.js runtime cache temizleniyor..."
rm -rf .next/cache 2>/dev/null || true
log "Cache temizleme tamamlandı"

log "Deploy tamamlandı! ✅"
log "Commit: $COMMIT_HASH"
log "Mesaj: $COMMIT_MSG"

exit 0

