"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/admin/FileUpload";

interface Brand {
  id: string;
  name: string;
  logo: string;
  website: string;
}

export default function ReferencesManager() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Brand>({
    id: "",
    name: "",
    logo: "",
    website: "",
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await fetch("/api/admin/content?type=brands");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Brands yüklendi:", data);
      setBrands(data);
    } catch (error) {
      console.error("Brands yükleme hatası:", error);
      setMessage({ 
        type: "error", 
        text: `Referanslar yüklenemedi: ${error instanceof Error ? error.message : "Bilinmeyen hata"}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      console.log("Kaydediliyor, brands:", brands);
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "brands", data: brands }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Kaydetme başarılı:", result);
        setMessage({ 
          type: "success", 
          text: "Referanslar başarıyla kaydedildi. Sayfayı yenileyerek değişiklikleri görebilirsiniz." 
        });
        // Sayfayı yenile (isteğe bağlı)
        setTimeout(() => {
          loadBrands();
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Kaydetme hatası:", errorData);
        setMessage({ 
          type: "error", 
          text: `Kaydetme başarısız: ${errorData.error || response.statusText}` 
        });
      }
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      setMessage({ 
        type: "error", 
        text: `Bir hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}` 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newBrand: Brand = {
      id: newId,
      name: "",
      logo: "",
      website: "",
    };
    setBrands([...brands, newBrand]);
    setEditingId(newId);
    setFormData(newBrand);
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setFormData(brand);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu referansı silmek istediğinize emin misiniz?")) {
      setBrands(brands.filter((b) => b.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleUpdate = () => {
    if (editingId) {
      // formData'daki güncel verileri brands array'ine yaz
      const updatedBrands = brands.map((b) => (b.id === editingId ? { ...formData } : b));
      setBrands(updatedBrands);
      setEditingId(null);
    }
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
            className="block px-4 py-3 text-white bg-white/10 rounded-lg"
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
            <h2 className="text-3xl font-medium text-white">Referanslar</h2>
            <div className="flex gap-4">
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                Yeni Referans Ekle
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
              onClick={() => setMessage(null)}
              style={{ cursor: "pointer" }}
            >
              {message.text}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMessage(null);
                }}
                className="float-right text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6 text-sm text-blue-300">
            <strong>📋 Kullanım Talimatları:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-white/80">
              <li>Bir referansı düzenlemek için "Düzenle" butonuna tıklayın</li>
              <li>Logo yüklemek için dosyayı sürükleyip bırakın veya tıklayarak seçin</li>
              <li>Logo yüklendikten sonra önizleme görünecektir</li>
              <li><strong>ÖNEMLİ:</strong> Tüm değişiklikleri kaydetmek için mutlaka üstteki "Kaydet" butonuna basın!</li>
              <li>Kaydetme işleminden sonra sayfayı yenileyerek değişiklikleri kontrol edin</li>
            </ol>
          </div>

          <div className="space-y-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white/5 border border-white/20 rounded-lg p-6"
              >
                {editingId === brand.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">
                        Marka Adı
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          const updatedFormData = { ...formData, name: e.target.value };
                          setFormData(updatedFormData);
                          // brands array'ini de güncelle
                          if (editingId) {
                            setBrands((prevBrands) => 
                              prevBrands.map((b) => 
                                b.id === editingId ? { ...updatedFormData } : b
                              )
                            );
                          }
                        }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                      />
                    </div>
                    <div>
                      <FileUpload
                        label="Logo"
                        accept="image/*"
                        folder="brands"
                        currentFile={formData.logo}
                        onUploadComplete={(url) => {
                          console.log("Logo yüklendi:", url);
                          // formData'yı güncelle
                          const updatedFormData = { ...formData, logo: url };
                          setFormData(updatedFormData);
                          
                          // brands array'ini de güncelle - editingId kontrolü ile
                          if (editingId) {
                            setBrands((prevBrands) => {
                              const updated = prevBrands.map((b) => 
                                b.id === editingId ? { ...updatedFormData } : b
                              );
                              console.log("Brands array güncellendi:", updated);
                              return updated;
                            });
                            setMessage({ 
                              type: "success", 
                              text: `Logo başarıyla yüklendi: ${url}. Değişiklikleri kalıcı hale getirmek için üstteki "Kaydet" butonuna basın.` 
                            });
                          }
                        }}
                        description="Marka logosunu yükleyin (PNG, JPG, SVG)"
                      />
                      <div className="mt-2">
                        <input
                          type="text"
                          value={formData.logo}
                          onChange={(e) => {
                            const updatedFormData = { ...formData, logo: e.target.value };
                            setFormData(updatedFormData);
                            // brands array'ini de güncelle - editingId kontrolü ile
                            if (editingId) {
                              setBrands((prevBrands) => 
                                prevBrands.map((b) => 
                                  b.id === editingId ? { ...updatedFormData } : b
                                )
                              );
                            }
                          }}
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg text-sm"
                          placeholder="veya manuel olarak yol girin: /brands/logo.png"
                        />
                      </div>
                      {formData.logo && (
                        <div className="mt-3 p-3 bg-white/5 border border-white/20 rounded-lg">
                          <p className="text-xs text-white/70 mb-2">Logo Önizleme:</p>
                          <div className="flex items-center justify-center h-24 bg-white/5 rounded border border-white/10">
                            <img
                              src={formData.logo}
                              alt="Logo önizleme"
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<p class="text-red-400 text-xs">Görsel yüklenemedi. URL\'yi kontrol edin.</p>';
                                }
                              }}
                            />
                          </div>
                          <p className="text-xs text-white/50 mt-2 break-all">{formData.logo}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">
                        Website URL
                      </label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => {
                          const updatedFormData = { ...formData, website: e.target.value };
                          setFormData(updatedFormData);
                          // brands array'ini de güncelle
                          if (editingId) {
                            setBrands((prevBrands) => 
                              prevBrands.map((b) => 
                                b.id === editingId ? { ...updatedFormData } : b
                              )
                            );
                          }
                        }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-sm text-yellow-300">
                        ⚠️ <strong>Önemli:</strong> Logo yükledikten sonra, değişiklikleri kalıcı hale getirmek için mutlaka sayfanın üstündeki <strong>"Kaydet"</strong> butonuna basın! Aksi halde logo kaydedilmez.
                      </div>
                      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-sm text-green-300">
                        ✅ <strong>Bilgi:</strong> Logo yüklendikten sonra önizleme gösterilecektir. Logo görünmüyorsa dosya yüklenmemiş olabilir.
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
                        {brand.name || "İsimsiz Marka"}
                      </h3>
                      <div className="flex gap-4 text-sm text-white/50 mb-2">
                        <span>Logo: {brand.logo || "Yok"}</span>
                        <span>Website: {brand.website || "Yok"}</span>
                      </div>
                      {brand.logo && (
                        <div className="mt-2 p-2 bg-white/5 border border-white/10 rounded">
                          <p className="text-xs text-white/70 mb-1">Logo Önizleme:</p>
                          <div className="flex items-center justify-center h-16 bg-white/5 rounded">
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<p class="text-red-400 text-xs">⚠️ Görsel bulunamadı! Lütfen logo yükleyin.</p>';
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
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

