"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface EquipmentData {
  categories: string[];
  items: EquipmentItem[];
}

export default function EquipmentManager() {
  const router = useRouter();
  const [equipmentData, setEquipmentData] = useState<EquipmentData>({
    categories: [],
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState<EquipmentItem>({
    id: "",
    name: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const response = await fetch("/api/admin/content?type=equipment");
      const data = await response.json();
      setEquipmentData(data);
    } catch (error) {
      setMessage({ type: "error", text: "Ekipmanlar yüklenemedi" });
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
        body: JSON.stringify({ type: "equipment", data: equipmentData }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Ekipmanlar başarıyla kaydedildi" });
      } else {
        setMessage({ type: "error", text: "Kaydetme başarısız" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    const newId = Date.now().toString();
    const newItem: EquipmentItem = {
      id: newId,
      name: "",
      category: equipmentData.categories[0] || "",
      description: "",
    };
    setEquipmentData({
      ...equipmentData,
      items: [...equipmentData.items, newItem],
    });
    setEditingId(newId);
    setFormData(newItem);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !equipmentData.categories.includes(newCategory.trim())) {
      setEquipmentData({
        ...equipmentData,
        categories: [...equipmentData.categories, newCategory.trim()],
      });
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Bu kategoriyi ve tüm ekipmanlarını silmek istediğinize emin misiniz?`)) {
      setEquipmentData({
        categories: equipmentData.categories.filter((c) => c !== category),
        items: equipmentData.items.filter((item) => item.category !== category),
      });
    }
  };

  const handleEdit = (item: EquipmentItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu ekipmanı silmek istediğinize emin misiniz?")) {
      setEquipmentData({
        ...equipmentData,
        items: equipmentData.items.filter((i) => i.id !== id),
      });
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleUpdate = () => {
    setEquipmentData({
      ...equipmentData,
      items: equipmentData.items.map((i) => (i.id === editingId ? formData : i)),
    });
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
            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            Hizmetler
          </Link>
          <Link
            href="/adminpanel/dashboard/equipment"
            className="block px-4 py-3 text-white bg-white/10 rounded-lg"
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
            <h2 className="text-3xl font-medium text-white">Ekipmanlar</h2>
            <div className="flex gap-4">
              <button
                onClick={handleAddItem}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                Yeni Ekipman Ekle
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

          {/* Categories Section */}
          <div className="mb-8 bg-white/5 border border-white/20 rounded-lg p-6">
            <h3 className="text-xl font-medium text-white mb-4">Kategoriler</h3>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                placeholder="Yeni kategori adı"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Kategori Ekle
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {equipmentData.categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                >
                  <span className="text-white">{category}</span>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Items */}
          <div className="space-y-4">
            {equipmentData.items.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/20 rounded-lg p-6"
              >
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Ekipman Adı
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Kategori
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                        >
                          {equipmentData.categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
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
                      <div className="text-sm text-white/50 mb-1">
                        {item.category}
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        {item.name || "İsimsiz"}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {item.description || "Açıklama yok"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

