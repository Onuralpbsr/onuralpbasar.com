"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ContactData {
  phone: string;
  email: string;
  emailSecondary: string;
  location: string;
  website: string;
  socials: {
    instagram: string;
    linkedin: string;
  };
}

export default function ContactManager() {
  const router = useRouter();
  const [contactData, setContactData] = useState<ContactData>({
    phone: "",
    email: "",
    emailSecondary: "",
    location: "",
    website: "",
    socials: {
      instagram: "",
      linkedin: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const response = await fetch("/api/admin/content?type=contact");
      const data = await response.json();
      setContactData(data);
    } catch (error) {
      setMessage({ type: "error", text: "İletişim bilgileri yüklenemedi" });
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
        body: JSON.stringify({ type: "contact", data: contactData }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "İletişim bilgileri başarıyla kaydedildi" });
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
            className="block px-4 py-3 text-white bg-white/10 rounded-lg"
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-medium text-white">İletişim Bilgileri</h2>
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
              <label className="block text-sm text-white/70 mb-2">
                Telefon
              </label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg"
                placeholder="+90 555 123 45 67"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                E-posta (Birincil)
              </label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg"
                placeholder="info@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                E-posta (İkincil)
              </label>
              <input
                type="email"
                value={contactData.emailSecondary}
                onChange={(e) =>
                  setContactData({ ...contactData, emailSecondary: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Konum
              </label>
              <input
                type="text"
                value={contactData.location}
                onChange={(e) =>
                  setContactData({ ...contactData, location: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg"
                placeholder="Adana, Turkey"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Website
              </label>
              <input
                type="url"
                value={contactData.website}
                onChange={(e) =>
                  setContactData({ ...contactData, website: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg"
                placeholder="https://example.com"
              />
            </div>

            <div className="border-t border-white/20 pt-6">
              <h3 className="text-xl font-medium text-white mb-4">Sosyal Medya</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={contactData.socials.instagram}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        socials: { ...contactData.socials, instagram: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg"
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={contactData.socials.linkedin}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        socials: { ...contactData.socials, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

