import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAdminAuth } from "@/lib/auth";

const contentDir = join(process.cwd(), "content");
const submissionsFile = join(contentDir, "submissions.json");

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export async function GET() {
  // Check authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;
  try {
    if (!existsSync(submissionsFile)) {
      return NextResponse.json([]);
    }

    const fileContent = await readFile(submissionsFile, "utf-8");
    const submissions: Submission[] = JSON.parse(fileContent);

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error reading submissions:", error);
    return NextResponse.json(
      { error: "Gönderimler yüklenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  // Check authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID gerekli" },
        { status: 400 }
      );
    }

    if (!existsSync(submissionsFile)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
    }

    const fileContent = await readFile(submissionsFile, "utf-8");
    const submissions: Submission[] = JSON.parse(fileContent);

    const filtered = submissions.filter((sub) => sub.id !== id);

    await writeFile(
      submissionsFile,
      JSON.stringify(filtered, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Silme işlemi başarısız" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  // Check authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { id, read } = await request.json();

    if (!id || typeof read !== "boolean") {
      return NextResponse.json(
        { error: "ID ve read durumu gerekli" },
        { status: 400 }
      );
    }

    if (!existsSync(submissionsFile)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
    }

    const fileContent = await readFile(submissionsFile, "utf-8");
    const submissions: Submission[] = JSON.parse(fileContent);

    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, read } : sub
    );

    await writeFile(
      submissionsFile,
      JSON.stringify(updated, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Güncelleme başarısız" },
      { status: 500 }
    );
  }
}

