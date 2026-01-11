"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/admin/FileUpload";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  orientation: "vertical" | "horizontal";
  description: string;
}

export default function VideosManager() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Video>({
    id: "",
    title: "",
    thumbnail: "",
    videoUrl: "",
    orientation: "vertical",
    description: "",
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch("/api/admin/content?type=videos");
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      setMessage({ type: "error", text: "Videolar yüklenemedi" });
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
        body: JSON.stringify({ type: "videos", data: videos }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Videolar başarıyla kaydedildi" });
      } else {
        setMessage({ type: "error", text: "Kaydetme başarısız" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newVideo: Video = {
      id: newId,
      title: "",
      thumbnail: "",
      videoUrl: "",
      orientation: "vertical",
      description: "",
    };
    setVideos([...videos, newVideo]);
    setEditingId(newId);
    setFormData(newVideo);
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setFormData(video);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu videoyu silmek istediğinize emin misiniz?")) {
      setVideos(videos.filter((v) => v.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleUpdate = () => {
    setVideos(videos.map((v) => (v.id === editingId ? formData : v)));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
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
            className="block px-4 py-3 text-white bg-white/10 rounded-lg"
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
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-medium text-white">Videolar</h2>
            <div className="flex gap-4">
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                Yeni Video Ekle
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
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

          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white/5 border border-white/20 rounded-lg p-6"
              >
                {editingId === video.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Başlık
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Yönlendirme
                        </label>
                        <select
                          value={formData.orientation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              orientation: e.target.value as "vertical" | "horizontal",
                            })
                          }
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                        >
                          <option value="vertical">Dikey</option>
                          <option value="horizontal">Yatay</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <FileUpload
                        label="Kapak Fotoğrafı (Thumbnail)"
                        accept="image/*"
                        currentFile={formData.thumbnail}
                        onUploadComplete={(url) =>
                          setFormData({ ...formData, thumbnail: url })
                        }
                        description="Video için kapak fotoğrafı yükleyin (JPG, PNG)"
                      />
                      <div className="mt-2">
                        <input
                          type="text"
                          value={formData.thumbnail}
                          onChange={(e) =>
                            setFormData({ ...formData, thumbnail: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg text-sm"
                          placeholder="veya manuel olarak yol girin: /path/to/image.jpg"
                        />
                      </div>
                    </div>
                    <div>
                      <FileUpload
                        label="Video Dosyası"
                        accept="video/*"
                        currentFile={formData.videoUrl}
                        onUploadComplete={(url) =>
                          setFormData({ ...formData, videoUrl: url })
                        }
                        description="Video dosyasını yükleyin (MP4, MOV, vb.)"
                      />
                      <div className="mt-2">
                        <input
                          type="text"
                          value={formData.videoUrl}
                          onChange={(e) =>
                            setFormData({ ...formData, videoUrl: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg text-sm"
                          placeholder="veya manuel olarak yol girin: /path/to/video.mp4"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-sm text-blue-300">
                        💡 <strong>Önemli:</strong> Dosya yükledikten sonra "Güncelle" butonuna basın, ardından sayfanın üstündeki "Kaydet" butonuna basarak değişiklikleri kaydedin.
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleUpdate}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Güncelle
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-2">
                        {video.title || "Başlıksız"}
                      </h3>
                      <p className="text-white/60 text-sm mb-2">
                        {video.description || "Açıklama yok"}
                      </p>
                      <div className="flex gap-4 text-sm text-white/50">
                        <span>Yön: {video.orientation === "vertical" ? "Dikey" : "Yatay"}</span>
                        <span>Thumbnail: {video.thumbnail}</span>
                        <span>Video: {video.videoUrl}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

