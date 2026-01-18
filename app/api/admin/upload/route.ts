import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAdminAuth } from "@/lib/auth";
import { execFile } from "child_process";
import { promisify } from "util";

const publicDir = join(process.cwd(), "public");
const execFileAsync = promisify(execFile);
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_MB || "");
const MAX_IMAGE_MB = Number(process.env.MAX_IMAGE_MB || "");
const MAX_VIDEO_BYTES = Number.isFinite(MAX_VIDEO_MB) ? MAX_VIDEO_MB * 1024 * 1024 : null;
const MAX_IMAGE_BYTES = Number.isFinite(MAX_IMAGE_MB) ? MAX_IMAGE_MB * 1024 * 1024 : null;
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
]);
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const sanitizeBaseName = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const sanitizeFolder = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9/_-]+/g, "")
    .replace(/^\/*/, "")
    .replace(/\/+/g, "/")
    .replace(/\.\.(\/|\\)/g, "");

export async function POST(request: Request) {
  // Check authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string | null;
    const customName = formData.get("customName") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı" },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const fileType = file.type;
    const isVideo = fileType.startsWith("video/");
    const isImage = fileType.startsWith("image/");

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Sadece video ve görsel dosyaları yüklenebilir" },
        { status: 400 }
      );
    }

    if (isVideo && !ALLOWED_VIDEO_TYPES.has(fileType)) {
      return NextResponse.json(
        { error: "Geçersiz video formatı. MP4, MOV, WEBM veya MKV yükleyin." },
        { status: 400 }
      );
    }

    if (isImage && !ALLOWED_IMAGE_TYPES.has(fileType)) {
      return NextResponse.json(
        { error: "Geçersiz görsel formatı. JPG, PNG veya WEBP yükleyin." },
        { status: 400 }
      );
    }

    if (MAX_VIDEO_BYTES && isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: `Video dosyası çok büyük. Maksimum ${MAX_VIDEO_MB}MB.` },
        { status: 413 }
      );
    }

    if (MAX_IMAGE_BYTES && isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `Görsel dosyası çok büyük. Maksimum ${MAX_IMAGE_MB}MB.` },
        { status: 413 }
      );
    }

    // Dosya adını oluştur
    const timestamp = Date.now();
    const originalName = file.name;
    const rawExtension = originalName.split(".").pop() || "";
    const extension = rawExtension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const safeBaseName = sanitizeBaseName(baseName);
    const safeCustomName = customName ? sanitizeBaseName(customName) : "";

    if (!extension) {
      return NextResponse.json(
        { error: "Dosya uzantısı bulunamadı veya geçersiz." },
        { status: 400 }
      );
    }

    const shouldCompressVideo = isVideo && process.env.COMPRESS_VIDEOS === "true";
    const outputExtension = shouldCompressVideo ? "mp4" : extension;
    const fileName = safeCustomName
      ? `${safeCustomName}.${outputExtension}`
      : `${safeBaseName || "dosya"}_${timestamp}.${outputExtension}`;

    // Klasör yolu belirle
    let uploadPath = publicDir;
    if (folder) {
      const safeFolder = sanitizeFolder(folder);
      uploadPath = join(publicDir, safeFolder);
      // Klasör yoksa oluştur
      if (!existsSync(uploadPath)) {
        await mkdir(uploadPath, { recursive: true });
      }
    }

    // Dosya yolunu oluştur
    const filePath = join(uploadPath, fileName);

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (shouldCompressVideo) {
      const tempPath = join(uploadPath, `${fileName}.upload`);
      await writeFile(tempPath, buffer);

      try {
        await execFileAsync("ffmpeg", [
          "-y",
          "-i",
          tempPath,
          "-c:v",
          "libx264",
          "-preset",
          "slow",
          "-crf",
          "20",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          "-movflags",
          "+faststart",
          filePath,
        ]);
      } catch (ffmpegError) {
        await unlink(tempPath).catch(() => {});
        return NextResponse.json(
          { error: "Video sıkıştırma başarısız. Sunucuda ffmpeg kurulu mu?" },
          { status: 500 }
        );
      }

      await unlink(tempPath).catch(() => {});
    } else {
      // Dosyayı kaydet
      await writeFile(filePath, buffer);
    }

    // Public URL'yi oluştur
    const publicUrl = folder
      ? `/${sanitizeFolder(folder)}/${fileName}`
      : `/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: fileType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Daha detaylı hata bilgisi
    let errorMessage = "Dosya yüklenirken bir hata oluştu";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Dosya sistemi hatalarını kontrol et
      if (errorMessage.includes("ENOSPC") || errorMessage.includes("disk")) {
        errorMessage = "Disk alanı yetersiz. Lütfen sunucu disk alanını kontrol edin.";
        statusCode = 507; // Insufficient Storage
      } else if (errorMessage.includes("EACCES") || errorMessage.includes("permission")) {
        errorMessage = "Dosya yazma izni yok. Lütfen public klasörü yazılabilir olduğundan emin olun.";
        statusCode = 500;
      } else if (errorMessage.includes("ENOENT")) {
        errorMessage = "Klasör bulunamadı. Dosya yolu geçersiz.";
        statusCode = 500;
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: statusCode }
    );
  }
}

// Next.js App Router'da body size limiti için config
export const runtime = "nodejs";
export const maxDuration = 300; // 5 dakika timeout

