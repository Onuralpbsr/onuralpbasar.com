import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execAsync = promisify(exec);

/**
 * GitHub Webhook Handler
 * 
 * GitHub'dan push event'i geldiğinde otomatik olarak:
 * 1. Git pull yapar
 * 2. npm install çalıştırır (yeni bağımlılıklar varsa)
 * 3. npm run build yapar
 * 4. PM2 ile uygulamayı restart eder
 * 
 * Güvenlik: GitHub webhook secret ile doğrulama yapılır
 */

export async function POST(request: Request) {
  try {
    // GitHub webhook secret kontrolü
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("GITHUB_WEBHOOK_SECRET environment variable tanımlı değil!");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Request body'yi al
    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // GitHub signature doğrulama
    if (signature) {
      const hmac = crypto.createHmac("sha256", webhookSecret);
      const digest = "sha256=" + hmac.update(body).digest("hex");
      
      if (signature !== digest) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    // JSON parse et
    const payload = JSON.parse(body);

    // Sadece push event'lerini işle
    if (payload.ref !== "refs/heads/main" && payload.ref !== "refs/heads/master") {
      return NextResponse.json(
        { message: "Ignored: not main/master branch" },
        { status: 200 }
      );
    }

    console.log(`Deploy başlatılıyor: ${payload.head_commit?.message || "Unknown commit"}`);

    // Deploy script'ini çalıştır
    const deployScript = process.env.DEPLOY_SCRIPT_PATH || "./scripts/deploy.sh";
    
    try {
      const { stdout, stderr } = await execAsync(`bash ${deployScript}`, {
        cwd: process.cwd(),
        env: {
          ...process.env,
          NODE_ENV: "production",
        },
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });

      console.log("Deploy başarılı:", stdout);
      
      return NextResponse.json(
        {
          success: true,
          message: "Deploy completed successfully",
          commit: payload.head_commit?.id,
          message: payload.head_commit?.message,
          output: stdout,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Deploy hatası:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Deploy failed",
          message: error.message,
          stderr: error.stderr,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint - webhook test için
export async function GET() {
  return NextResponse.json(
    {
      message: "GitHub Webhook endpoint is active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

