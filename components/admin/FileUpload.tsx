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

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onUploadComplete(data.url);
        setUploadProgress(100);
      } else {
        setError(data.error || "Yükleme başarısız");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Dosya yüklenirken bir hata oluştu");
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
          <div className="space-y-2">
            <div className="text-white/70">Yükleniyor...</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
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

