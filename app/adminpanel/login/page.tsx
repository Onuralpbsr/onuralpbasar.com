"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/adminpanel/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
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

