"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/admin/FileUpload";

interface BackgroundVideos {
  hero: string;
  services: string;
  gallery: string;
  contact: string;
}

export default function BackgroundsManager() {
  const router = useRouter();
  const [backgrounds, setBackgrounds] = useState<BackgroundVideos>({
    hero: "",
    services: "",
    gallery: "",
    contact: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadBackgrounds();
  }, []);

  const loadBackgrounds = async () => {
    try {
      const response = await fetch("/api/admin/content?type=backgroundVideos");
      const data = await response.json();
      setBackgrounds(data);
    } catch (error) {
      setMessage({ type: "error", text: "Arka plan videoları yüklenemedi" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "backgroundVideos", data: backgrounds }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Arka plan videoları başarıyla kaydedildi" });
      } else {
        setMessage({ type: "error", text: "Kaydetme başarısız" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-medium text-white">Admin Paneli</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/adminpanel/dashboard/videos"
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            Videolar
          </Link>
          <Link
            href="/adminpanel/dashboard/references"
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            Referanslar
          </Link>
          <Link
            href="/adminpanel/dashboard/services"
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            Hizmetler
          </Link>
          <Link
            href="/adminpanel/dashboard/equipment"
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            Ekipmanlar
          </Link>
          <Link
            href="/adminpanel/dashboard/contact"
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            İletişim
          </Link>
          <Link
            href="/adminpanel/dashboard/submissions"
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            Form Gönderimleri
          </Link>
          <Link
            href="/adminpanel/dashboard/backgrounds"
            className="block px-4 py-3 text-white bg-white/10 rounded-lg"
          >
            Arka Plan Videoları
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              fetch("/api/admin/logout", { method: "POST" });
              router.push("/adminpanel/login");
              router.refresh();
            }}
            className="w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-medium text-white">Arka Plan Videoları</h2>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500/50 text-green-300"
                  : "bg-red-500/20 border border-red-500/50 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <FileUpload
                label="Hero Section Video"
                accept="video/*"
                currentFile={backgrounds.hero}
                onUploadComplete={(url) =>
                  setBackgrounds({ ...backgrounds, hero: url })
                }
                description="Ana sayfa hero bölümünde gösterilecek video"
              />
              <div className="mt-2">
                <input
                  type="text"
                  value={backgrounds.hero}
                  onChange={(e) =>
                    setBackgrounds({ ...backgrounds, hero: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg text-sm"
                  placeholder="veya manuel olarak yol girin: /videographer.mp4"
                />
              </div>
            </div>

            <div>
              <FileUpload
                label="Services Section Video"
                accept="video/*"
                currentFile={backgrounds.services}
                onUploadComplete={(url) =>
                  setBackgrounds({ ...backgrounds, services: url })
                }
                description="Hizmetler bölümünde gösterilecek video"
              />
              <div className="mt-2">
                <input
                  type="text"
                  value={backgrounds.services}
                  onChange={(e) =>
                    setBackgrounds({ ...backgrounds, services: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg text-sm"
                  placeholder="veya manuel olarak yol girin: /Videographer_2.mp4"
                />
              </div>
            </div>

            <div>
              <FileUpload
                label="Gallery Section Video"
                accept="video/*"
                currentFile={backgrounds.gallery}
                onUploadComplete={(url) =>
                  setBackgrounds({ ...backgrounds, gallery: url })
                }
                description="Video galeri bölümünde gösterilecek video"
              />
              <div className="mt-2">
                <input
                  type="text"
                  value={backgrounds.gallery}
                  onChange={(e) =>
                    setBackgrounds({ ...backgrounds, gallery: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg text-sm"
                  placeholder="veya manuel olarak yol girin: /Editor.mp4"
                />
              </div>
            </div>

            <div>
              <FileUpload
                label="Contact Section Video"
                accept="video/*"
                currentFile={backgrounds.contact}
                onUploadComplete={(url) =>
                  setBackgrounds({ ...backgrounds, contact: url })
                }
                description="İletişim bölümünde gösterilecek video"
              />
              <div className="mt-2">
                <input
                  type="text"
                  value={backgrounds.contact}
                  onChange={(e) =>
                    setBackgrounds({ ...backgrounds, contact: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg text-sm"
                  placeholder="veya manuel olarak yol girin: /Natural_Videgrapher.mp4"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

