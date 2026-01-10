"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter out browser extension errors from console
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || "";
      // Ignore browser extension errors
      if (
        message.includes("runtime.lastError") ||
        message.includes("message port closed") ||
        message.includes("Receiving end does not exist") ||
        message.includes("Could not establish connection")
      ) {
        return; // Silently ignore extension errors
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError("");
    setLoading(true);

    console.log("Form submit started", { username, password: "***" });

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Ensure cookies are sent and received
      });

      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Parse JSON first (response can only be read once)
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        setError("Sunucudan geçersiz yanıt alındı. Lütfen tekrar deneyin.");
        setLoading(false);
        return;
      }

      // Check if response is OK after parsing
      if (!response.ok) {
        const errorMessage = data.error || data.message || response.statusText || "Giriş başarısız";
        console.error("Login failed:", errorMessage, data);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      console.log("Login successful, data:", data);
      
      // Check if Set-Cookie header is present
      const setCookieHeader = response.headers.get("set-cookie");
      console.log("Login successful, cookie header:", setCookieHeader);
      console.log("Document cookies:", document.cookie);
      
      // Redirect immediately with full page reload to ensure cookie is sent
      window.location.href = "/adminpanel/dashboard";
      
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-medium text-white mb-2 text-center">
            Admin Paneli
          </h1>
          <p className="text-white/60 text-center mb-8">
            Giriş yapmak için bilgilerinizi girin
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm text-white/70 mb-2"
              >
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all rounded-lg"
                placeholder="Kullanıcı adınız"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-white/70 mb-2"
              >
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all rounded-lg"
                placeholder="Şifreniz"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-white/10 border border-white/30 text-white font-medium tracking-wide hover:bg-white/20 hover:border-white/40 transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

