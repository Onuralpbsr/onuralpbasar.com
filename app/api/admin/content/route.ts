import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { requireAdminAuth } from "@/lib/auth";

const contentDir = join(process.cwd(), "content");

export async function GET(request: Request) {
  // Check authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Content type is required" },
        { status: 400 }
      );
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
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}

