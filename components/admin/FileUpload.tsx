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
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (folder) {
        formData.append("folder", folder);
      }
      if (customName) {
        formData.append("customName", customName);
      }

      // XMLHttpRequest kullanarak upload progress takibi
      const xhr = new XMLHttpRequest();
      const uploadBaseUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;
      const uploadUrl = uploadBaseUrl
        ? `${uploadBaseUrl.replace(/\/+$/, "")}/api/admin/upload`
        : "/api/admin/upload";

      // Upload progress event'i
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      // Promise wrapper
      const response = await new Promise<{ success: boolean; url?: string; error?: string }>(
        (resolve, reject) => {
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } catch {
                reject(new Error("Geçersiz yanıt"));
              }
            } else {
              // HTTP status koduna göre özel hata mesajları
              let errorMessage = "Yükleme başarısız";
              
              if (xhr.status === 413) {
                errorMessage = "Dosya çok büyük. Lütfen daha küçük bir dosya seçin veya sunucu limitlerini kontrol edin.";
              } else if (xhr.status === 400) {
                errorMessage = "Geçersiz dosya formatı veya eksik parametreler.";
              } else if (xhr.status === 401 || xhr.status === 403) {
                errorMessage = "Yetkilendirme hatası. Lütfen yeniden giriş yapın.";
              } else if (xhr.status === 500) {
                errorMessage = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
              }
              
              try {
                const data = JSON.parse(xhr.responseText);
                resolve({ success: false, error: data.error || errorMessage });
              } catch {
                resolve({ success: false, error: errorMessage });
              }
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Ağ hatası oluştu. İnternet bağlantınızı kontrol edin."));
          });

          xhr.addEventListener("abort", () => {
            reject(new Error("Yükleme iptal edildi"));
          });

          xhr.addEventListener("timeout", () => {
            reject(new Error("Yükleme zaman aşımına uğradı. Dosya çok büyük olabilir, lütfen daha küçük bir dosya deneyin."));
          });

          // Büyük dosyalar için timeout ayarla (5 dakika)
          xhr.timeout = 300000; // 5 dakika = 300000ms
          
          xhr.open("POST", uploadUrl);
          xhr.send(formData);
        }
      );

      if (response.success && response.url) {
        onUploadComplete(response.url);
        setUploadProgress(100);
      } else {
        setError(response.error || "Yükleme başarısız");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Dosya yüklenirken bir hata oluştu";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
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
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/20 hover:border-white/40 bg-white/5"
          }
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
              {uploadProgress < 100 ? "Lütfen bekleyin..." : "Tamamlandı!"}
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
                ? "Video veya görsel dosyaları"
                : accept.includes("video")
                ? "Video dosyaları"
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

