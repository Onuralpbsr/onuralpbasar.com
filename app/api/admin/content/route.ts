import { NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { join, normalize } from "path";
import { existsSync } from "fs";
import { requireAdminAuth } from "@/lib/auth";

const contentDir = join(process.cwd(), "content");
const publicDir = join(process.cwd(), "public");
const SAFE_VIDEO_PREFIX = "/videos/";

const normalizeUrl = (value: string) => {
  try {
    return encodeURI(decodeURI(value));
  } catch {
    return encodeURI(value);
  }
};

const collectMediaUrls = (items: Array<{ videoUrl?: string; thumbnail?: string }>) =>
  items
    .flatMap((item) => [item.videoUrl, item.thumbnail])
    .filter((value): value is string => Boolean(value));

const resolvePublicFilePath = (url: string) => {
  if (!url.startsWith(SAFE_VIDEO_PREFIX)) return null;
  const decoded = decodeURI(url).replace(/^\/+/, "");
  const filePath = join(publicDir, decoded);
  const normalized = normalize(filePath);
  if (!normalized.startsWith(`${publicDir}/`) && normalized !== publicDir) return null;
  return normalized;
};

export async function GET(request: Request) {
  // Check authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // If no type is provided, just return success for auth checking
    if (!type) {
      return NextResponse.json({ authenticated: true });
    }

    const filePath = join(contentDir, `${type}.json`);
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading content:", error);
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Check authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    const filePath = join(contentDir, `${type}.json`);
    let previousData: unknown = null;
    let normalizedData = data;

    if (type === "videos") {
      try {
        const previousContent = await readFile(filePath, "utf-8");
        previousData = JSON.parse(previousContent);
      } catch {
        previousData = null;
      }

      if (Array.isArray(data)) {
        normalizedData = data.map((item) => ({
          ...item,
          videoUrl: typeof item.videoUrl === "string" ? normalizeUrl(item.videoUrl) : item.videoUrl,
          thumbnail: typeof item.thumbnail === "string" ? normalizeUrl(item.thumbnail) : item.thumbnail,
        }));
      }
    }

    await writeFile(filePath, JSON.stringify(normalizedData, null, 2), "utf-8");

    if (type === "videos" && Array.isArray(previousData) && Array.isArray(normalizedData)) {
      const previousUrls = new Set(collectMediaUrls(previousData));
      const nextUrls = new Set(collectMediaUrls(normalizedData));
      const removedUrls = [...previousUrls].filter((url) => !nextUrls.has(url));

      await Promise.all(
        removedUrls.map(async (url) => {
          const filePathToDelete = resolvePublicFilePath(url);
          if (!filePathToDelete) return;
          if (existsSync(filePathToDelete)) {
            await unlink(filePathToDelete);
          }
        })
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}

