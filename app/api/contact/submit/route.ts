import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tüm alanlar doldurulmalıdır" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      );
    }

    // Ensure content directory exists
    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true });
    }

    // Read existing submissions or create new array
    let submissions: Submission[] = [];
    if (existsSync(submissionsFile)) {
      try {
        const fileContent = await readFile(submissionsFile, "utf-8");
        submissions = JSON.parse(fileContent);
      } catch (error) {
        // If file is corrupted, start fresh
        submissions = [];
      }
    }

    // Create new submission
    const newSubmission: Submission = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Add to beginning of array (newest first)
    submissions.unshift(newSubmission);

    // Save to file
    await writeFile(
      submissionsFile,
      JSON.stringify(submissions, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      message: "Mesajınız başarıyla gönderildi",
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

