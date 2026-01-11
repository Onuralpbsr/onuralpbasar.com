import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAdminAuth } from "@/lib/auth";

const publicDir = join(process.cwd(), "public");

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

    // Dosya adını oluştur
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const extension = originalName.split(".").pop() || "";
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const fileName = customName
      ? `${customName}.${extension}`
      : `${baseName}_${timestamp}.${extension}`;

    // Klasör yolu belirle
    let uploadPath = publicDir;
    if (folder) {
      uploadPath = join(publicDir, folder);
      // Klasör yoksa oluştur
      if (!existsSync(uploadPath)) {
        await mkdir(uploadPath, { recursive: true });
      }
    }

    // Dosya yolunu oluştur
    const filePath = join(uploadPath, fileName);

    // Dosyayı buffer'a çevir ve kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Public URL'yi oluştur
    const publicUrl = folder ? `/${folder}/${fileName}` : `/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: fileType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

