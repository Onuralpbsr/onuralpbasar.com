"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  folder?: string;
  customName?: string;
  label?: string;
  description?: string;
  currentFile?: string;
}

// 49MB — Cloudflare'in 100MB limitinin altında güvenli chunk boyutu
const CHUNK_SIZE = 49 * 1024 * 1024;

export default function FileUpload({
  onUploadComplete,
  accept = "image/*,video/*",
  folder,
  customName,
  label = "Dosya Yükle",
  description,
  currentFile,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadStartRef = useRef<number>(0);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) await uploadFile(files[0]);
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) await uploadFile(files[0]);
  };

  // Tek bir XHR isteği gönder (progress takipli)
  const sendXHR = (
    url: string,
    formData: FormData,
    onProgress?: (pct: number) => void
  ): Promise<{ success: boolean; url?: string; error?: string; received?: number }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error("Geçersiz sunucu yanıtı"));
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({ success: false, error: data.error || "Yükleme başarısız" });
          } catch {
            resolve({ success: false, error: `Sunucu hatası (${xhr.status})` });
          }
        }
      });

      xhr.addEventListener("error", () =>
        reject(new Error("Bağlantı hatası oluştu"))
      );
      xhr.addEventListener("abort", () =>
        reject(new Error("Yükleme iptal edildi"))
      );
      xhr.addEventListener("timeout", () =>
        reject(new Error("İstek zaman aşımına uğradı"))
      );

      // Her chunk için 10 dakika yeterli
      xhr.timeout = 600000;
      xhr.open("POST", url);
      xhr.send(formData);
    });
  };

  // Küçük dosyalar için normal upload
  const uploadNormal = async (file: File, baseUrl: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);
    if (customName) formData.append("customName", customName);

    const uploadUrl = baseUrl ? `${baseUrl}/api/admin/upload` : "/api/admin/upload";

    const result = await sendXHR(uploadUrl, formData, (pct) => {
      setUploadProgress(pct);
      const elapsed = (Date.now() - uploadStartRef.current) / 1000;
      if (elapsed > 1) {
        const bps = (file.size * pct / 100) / elapsed;
        const remaining = (file.size * (1 - pct / 100)) / bps;
        const speed =
          bps > 1024 * 1024
            ? `${(bps / 1024 / 1024).toFixed(1)} MB/s`
            : `${(bps / 1024).toFixed(0)} KB/s`;
        const eta =
          remaining > 60
            ? `~${Math.ceil(remaining / 60)} dk kaldı`
            : `~${Math.ceil(remaining)} sn kaldı`;
        setUploadStatus(`${speed} · ${eta}`);
      }
    });

    if (!result.success || !result.url) throw new Error(result.error || "Yükleme başarısız");
    return result.url;
  };

  // Büyük dosyalar için chunked upload (Cloudflare bypass)
  const uploadInChunks = async (file: File, baseUrl: string): Promise<string> => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const chunkUrl = baseUrl
      ? `${baseUrl}/api/admin/upload-chunk`
      : "/api/admin/upload-chunk";

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkBlob = file.slice(start, end);
      const chunkFile = new File([chunkBlob], file.name, { type: file.type });

      const chunkForm = new FormData();
      chunkForm.append("chunk", chunkFile);
      chunkForm.append("chunkIndex", String(i));
      chunkForm.append("totalChunks", String(totalChunks));
      chunkForm.append("fileId", fileId);
      chunkForm.append("fileName", file.name);
      if (folder) chunkForm.append("folder", folder);
      if (customName) chunkForm.append("customName", customName);

      setUploadStatus(
        `Parça ${i + 1}/${totalChunks} yükleniyor...`
      );

      const result = await sendXHR(chunkUrl, chunkForm, (pct) => {
        // Toplam ilerleme: tamamlanan parçalar + mevcut parçanın ilerlemesi
        const overall = Math.round(
          ((i + pct / 100) / totalChunks) * 100
        );
        setUploadProgress(overall);

        const totalUploaded = start + (chunkBlob.size * pct) / 100;
        const elapsed = (Date.now() - uploadStartRef.current) / 1000;
        if (elapsed > 1) {
          const bps = totalUploaded / elapsed;
          const remaining = (file.size - totalUploaded) / bps;
          const speed =
            bps > 1024 * 1024
              ? `${(bps / 1024 / 1024).toFixed(1)} MB/s`
              : `${(bps / 1024).toFixed(0)} KB/s`;
          const eta =
            remaining > 60
              ? `~${Math.ceil(remaining / 60)} dk kaldı`
              : `~${Math.ceil(remaining)} sn kaldı`;
          setUploadStatus(`Parça ${i + 1}/${totalChunks} · ${speed} · ${eta}`);
        }
      });

      if (!result.success && i < totalChunks - 1) {
        throw new Error(result.error || `Parça ${i + 1} yüklenemedi`);
      }

      // Son chunk'tan URL gelir
      if (i === totalChunks - 1) {
        if (!result.url) throw new Error(result.error || "Son parça birleştirilemedi");
        return result.url;
      }
    }

    throw new Error("Beklenmedik hata");
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setUploadStatus("");
    uploadStartRef.current = Date.now();

    try {
      let url: string;

      if (file.size > CHUNK_SIZE) {
        // 49MB üstü → parçalı upload, her chunk Cloudflare limitinin altında
        // Her zaman same-origin kullan (CORS sorunu yok)
        url = await uploadInChunks(file, "");
      } else {
        // Normal upload — same-origin
        url = await uploadNormal(file, "");
      }

      onUploadComplete(url);
      setUploadProgress(100);
      setUploadStatus("Tamamlandı!");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Dosya yüklenirken hata oluştu");
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus("");
      }, 2000);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm text-white/70 mb-2">{label}</label>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/20 hover:border-white/40 bg-white/5"}
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="text-white/70 text-center">
              Yükleniyor... {uploadProgress}%
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-xs text-white/50 text-center">
              {uploadStatus || "Lütfen bekleyin..."}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-white/40"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-white/70">
              <span className="text-blue-400">Dosyayı sürükleyip bırakın</span>{" "}
              veya tıklayarak seçin
            </div>
            <div className="text-xs text-white/50">
              {accept.includes("video") && accept.includes("image")
                ? "Video veya görsel dosyaları (her boyut desteklenir)"
                : accept.includes("video")
                ? "Video dosyaları (her boyut desteklenir)"
                : "Görsel dosyaları"}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/20 border border-red-500/50 rounded-lg p-2">
          {error}
        </div>
      )}

      {currentFile && !isUploading && (
        <div className="text-sm text-white/60 bg-white/5 border border-white/10 rounded-lg p-2">
          Mevcut dosya:{" "}
          <a
            href={currentFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            {currentFile}
          </a>
        </div>
      )}

      {description && (
        <p className="text-xs text-white/50 mt-1">{description}</p>
      )}
    </div>
  );
}
