/**
 * PM2 Ecosystem Configuration
 * 
 * Kullanım:
 *   pm2 start ecosystem.config.js
 *   pm2 restart portfolio
 *   pm2 stop portfolio
 *   pm2 logs portfolio
 */

module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "npm",
      args: "start",
      cwd: process.cwd(),
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Otomatik restart ayarları
      watch: false, // Production'da false olmalı
      max_memory_restart: "1G",
      // Log ayarları
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      // Restart ayarları
      min_uptime: "10s",
      max_restarts: 15, // Restart sayısını biraz artırdık
      restart_delay: 4000,
      exp_backoff_restart_delay: 100, // Exponential backoff başlangıç
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};

