import { NextResponse } from "next/server";
import { mkdir, readFile, rm } from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { join } from "path";
import { requireAdminAuth } from "@/lib/auth";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const publicDir = join(process.cwd(), "public");
const tmpDir = join(process.cwd(), "tmp-chunks");

export const runtime = "nodejs";
export const maxDuration = 300;

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
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const chunk = formData.get("chunk") as File;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string);
    const totalChunks = parseInt(formData.get("totalChunks") as string);
    const fileId = formData.get("fileId") as string;
    const originalName = formData.get("fileName") as string;
    const folder = formData.get("folder") as string | null;
    const customName = formData.get("customName") as string | null;

    if (!chunk || isNaN(chunkIndex) || isNaN(totalChunks) || !fileId || !originalName) {
      return NextResponse.json({ error: "Eksik parametreler" }, { status: 400 });
    }

    // Temp dir for this file upload session
    const fileDir = join(tmpDir, fileId);
    await mkdir(fileDir, { recursive: true });

    // Stream chunk to temp file
    const chunkPath = join(fileDir, `chunk-${String(chunkIndex).padStart(6, "0")}`);
    await pipeline(
      Readable.fromWeb(chunk.stream() as import("stream/web").ReadableStream),
      createWriteStream(chunkPath)
    );

    // Not the last chunk — just acknowledge
    if (chunkIndex < totalChunks - 1) {
      return NextResponse.json({ success: true, received: chunkIndex });
    }

    // Last chunk received — assemble all chunks into final file
    const rawExt = originalName.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "mp4";
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const timestamp = Date.now();
    const fileName = customName
      ? `${sanitizeBaseName(customName)}.${rawExt}`
      : `${sanitizeBaseName(baseName) || "video"}_${timestamp}.${rawExt}`;

    const safeFolder = folder ? sanitizeFolder(folder) : null;
    const uploadDir = safeFolder ? join(publicDir, safeFolder) : publicDir;
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, fileName);

    // Write chunks sequentially to final file
    const writeStream = createWriteStream(filePath);
    for (let i = 0; i < totalChunks; i++) {
      const cp = join(fileDir, `chunk-${String(i).padStart(6, "0")}`);
      const data = await readFile(cp);
      await new Promise<void>((resolve, reject) => {
        writeStream.write(data, (err) => (err ? reject(err) : resolve()));
      });
    }
    await new Promise<void>((resolve) => writeStream.end(resolve));

    // Cleanup temp files
    await rm(fileDir, { recursive: true, force: true });

    // Non-blocking PM2 restart to refresh Next.js public/ cache
    execFileAsync("pm2", ["restart", "portfolio"]).catch(() => {});

    const publicUrl = safeFolder ? `/${safeFolder}/${fileName}` : `/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (error) {
    console.error("Chunk upload error:", error);
    return NextResponse.json(
      { error: "Chunk yüklenirken hata oluştu: " + String(error) },
      { status: 500 }
    );
  }
}
