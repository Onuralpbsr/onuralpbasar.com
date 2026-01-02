"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function SubmissionsManager() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    loadSubmissions();
    // Her 30 saniyede bir yenile
    const interval = setInterval(loadSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        setMessage({ type: "error", text: "Gönderimler yüklenemedi" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSubmissions(submissions.filter((sub) => sub.id !== id));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
        setMessage({ type: "success", text: "Mesaj silindi" });
      } else {
        setMessage({ type: "error", text: "Silme işlemi başarısız" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bir hata oluştu" });
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });

      if (response.ok) {
        const updated = submissions.map((sub) =>
          sub.id === id ? { ...sub, read } : sub
        );
        setSubmissions(updated);
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, read });
        }
      }
    } catch (error) {
      console.error("Error updating read status:", error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const unreadCount = submissions.filter((sub) => !sub.read).length;

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
            className="block px-4 py-3 text-white bg-white/10 rounded-lg relative"
          >
            Form Gönderimleri
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
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
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-medium text-white mb-2">
                Form Gönderimleri
              </h2>
              <p className="text-white/60">
                {submissions.length} mesaj • {unreadCount} okunmamış
              </p>
            </div>
            <button
              onClick={loadSubmissions}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Yenile
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mesaj Listesi */}
            <div className="lg:col-span-1 space-y-3">
              {submissions.length === 0 ? (
                <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center text-white/60">
                  Henüz mesaj yok
                </div>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => {
                      setSelectedSubmission(submission);
                      if (!submission.read) {
                        handleMarkAsRead(submission.id, true);
                      }
                    }}
                    className={`bg-white/5 border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSubmission?.id === submission.id
                        ? "border-white/40 bg-white/10"
                        : "border-white/20 hover:border-white/30 hover:bg-white/8"
                    } ${!submission.read ? "border-blue-500/50 bg-blue-500/10" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">
                          {submission.name}
                        </h3>
                        <p className="text-white/60 text-sm mb-2">
                          {submission.email}
                        </p>
                        <p className="text-white/50 text-xs">
                          {formatDate(submission.timestamp)}
                        </p>
                      </div>
                      {!submission.read && (
                        <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          Yeni
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {submission.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Mesaj Detayı */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-medium text-white mb-2">
                        {selectedSubmission.name}
                      </h3>
                      <a
                        href={`mailto:${selectedSubmission.email}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {selectedSubmission.email}
                      </a>
                      <p className="text-white/60 text-sm mt-2">
                        {formatDate(selectedSubmission.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleMarkAsRead(
                            selectedSubmission.id,
                            !selectedSubmission.read
                          )
                        }
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedSubmission.read
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {selectedSubmission.read ? "Okunmadı Olarak İşaretle" : "Okundu Olarak İşaretle"}
                      </button>
                      <button
                        onClick={() => handleDelete(selectedSubmission.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <h4 className="text-lg font-medium text-white mb-4">
                      Mesaj
                    </h4>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                        {selectedSubmission.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.name} - Mesajınız Hakkında`}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      E-posta Gönder
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/20 rounded-lg p-12 text-center">
                  <p className="text-white/60">
                    Detaylarını görmek için bir mesaj seçin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

