"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  description: string;
}

export default function ServicesManager() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Service>({
    id: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch("/api/admin/content?type=services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setMessage({ type: "error", text: "Hizmetler yüklenemedi" });
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
        body: JSON.stringify({ type: "services", data: services }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Hizmetler başarıyla kaydedildi" });
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
    const newService: Service = {
      id: newId,
      title: "",
      description: "",
    };
    setServices([...services, newService]);
    setEditingId(newId);
    setFormData(newService);
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu hizmeti silmek istediğinize emin misiniz?")) {
      setServices(services.filter((s) => s.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleUpdate = () => {
    setServices(services.map((s) => (s.id === editingId ? formData : s)));
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
            className="block px-4 py-3 text-white bg-white/10 rounded-lg"
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
            <h2 className="text-3xl font-medium text-white">Hizmetler</h2>
            <div className="flex gap-4">
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                Yeni Hizmet Ekle
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
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white/5 border border-white/20 rounded-lg p-6"
              >
                {editingId === service.id ? (
                  <div className="space-y-4">
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
                        Açıklama
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                        rows={5}
                      />
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
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-2">
                        {service.title || "Başlıksız"}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {service.description || "Açıklama yok"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
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

