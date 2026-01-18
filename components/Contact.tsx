"use client";

import { useState, useEffect, useRef } from "react";
import { normalizeMediaUrl } from "@/lib/media";

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

interface ContactProps {
  contactData: ContactData;
  backgroundVideo: string;
}

export default function Contact({ contactData, backgroundVideo }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(() => {});
          } else if (videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeOutDuration = 2; // Video sonunda 2 saniye fade out
    const fadeInDuration = 2.5; // Video başında 2.5 saniye fade in
    let animationFrameId: number;

    const updateOpacity = () => {
      if (!video) return;

      const duration = video.duration;
      const currentTime = video.currentTime;

      if (duration && !isNaN(duration)) {
        let newOpacity = 1;

        // Video sonuna yaklaşırken yumuşak fade out
        if (currentTime >= duration - fadeOutDuration) {
          const fadeProgress = (duration - currentTime) / fadeOutDuration;
          newOpacity = Math.max(0, Math.min(1, fadeProgress));
        }
        // Video başlangıcında yumuşak fade in
        else if (currentTime <= fadeInDuration) {
          const fadeProgress = currentTime / fadeInDuration;
          newOpacity = Math.max(0, Math.min(1, fadeProgress));
        }
        // Video ortasında tam opak
        else {
          newOpacity = 1;
        }

        setVideoOpacity(newOpacity);
      }

      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      // Video bittiğinde tamamen karart
      setVideoOpacity(0);
      
      // Kısa bir bekleme sonrası video başa dönsün ve yavaşça açılsın
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          // Video başa döndü, fade in başlayacak
          video.play().catch(() => {});
        }
      }, 300); // 300ms siyah ekran
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(updateOpacity);

    video.addEventListener("play", () => {
      animationFrameId = requestAnimationFrame(updateOpacity);
    });
    video.addEventListener("pause", () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });
    video.addEventListener("ended", handleEnded);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      video.removeEventListener("play", () => {});
      video.removeEventListener("pause", () => {});
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // EmailJS kullanımı için dinamik import
      const emailjs = await import('@emailjs/browser');
      
      // EmailJS ayarlarını buradan yapın
      // Bu değerleri EmailJS.com'dan alacaksınız
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

      // Eğer EmailJS ayarları yapılmamışsa, eski API'yi dene
      if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        // Fallback: Eski API endpoint'ini dene (development için)
        try {
          const response = await fetch("/api/contact/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const data = await response.json();

          if (response.ok) {
            alert("Mesajınız gönderildi! En kısa sürede size dönüş yapacağım.");
            setFormData({ name: "", email: "", message: "" });
            return;
          } else {
            throw new Error(data.error || "API hatası");
          }
        } catch (apiError) {
          alert("EmailJS ayarları yapılmamış. Lütfen .env dosyasına EmailJS bilgilerini ekleyin veya hosting sağlayıcınızla iletişime geçin.");
          return;
        }
      }

      // EmailJS ile gönder
      await emailjs.default.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: contactData.email, // Alıcı e-posta
        },
        PUBLIC_KEY
      );

      alert("Mesajınız gönderildi! En kısa sürede size dönüş yapacağım.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin veya doğrudan e-posta gönderin: " + contactData.email);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ 
        background: "#1a1a1a",
        marginTop: "-1px", // Remove gap
      }}
    >
      {/* Smooth top fade from Equipment section */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #1a1a1a 0%, rgba(26, 26, 26, 0.7) 40%, rgba(26, 26, 26, 0.3) 70%, transparent 100%)",
        }}
      />
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ 
            opacity: videoOpacity * 0.5, // Base opacity 50% + fade effect
            transition: "none", // Control opacity via JS, no CSS transition
          }}
        >
          <source src={normalizeMediaUrl(backgroundVideo)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#1a1a1a]/60 to-[#1a1a1a]/80" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wider mb-3 sm:mb-4 text-white">
            İletişim
          </h2>
          <p className="text-white/70 font-normal text-base sm:text-lg max-w-2xl mx-auto px-2">
            Projeleriniz için benimle iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl sm:text-2xl font-medium tracking-wide mb-4 sm:mb-6 text-white">
              Bilgiler
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="text-sm text-white/50 font-normal mb-2">
                  Telefon
                </div>
                <a
                  href={`tel:${contactData.phone}`}
                  className="text-white/80 hover:text-white transition-colors font-normal"
                >
                  {contactData.phone}
                </a>
              </div>
              <div>
                <div className="text-sm text-white/50 font-normal mb-2">
                  E-posta
                </div>
                <div className="space-y-2">
                  <a
                    href={`mailto:${contactData.email}`}
                    className="block text-white/80 hover:text-white transition-colors font-normal"
                  >
                    {contactData.email}
                  </a>
                  {contactData.emailSecondary && (
                    <a
                      href={`mailto:${contactData.emailSecondary}`}
                      className="block text-white/80 hover:text-white transition-colors font-normal"
                    >
                      {contactData.emailSecondary}
                    </a>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/50 font-normal mb-2">
                  Konum
                </div>
                <div className="text-white/80 font-normal">
                  {contactData.location}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/50 font-normal mb-2">
                  Web
                </div>
                <a
                  href={contactData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors font-normal"
                >
                  {contactData.website.replace("https://", "")}
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 sm:mt-12">
              <div className="text-sm text-white/50 font-normal mb-3 sm:mb-4">
                Sosyal Medya
              </div>
              <div className="flex gap-4">
                <a
                  href={contactData.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={contactData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg shadow-black/20">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-white/70 font-normal mb-2"
              >
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-normal rounded-lg text-sm sm:text-base"
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-white/70 font-normal mb-2"
              >
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-normal rounded-lg text-sm sm:text-base"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm text-white/70 font-normal mb-2"
              >
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors font-normal resize-none rounded-lg text-sm sm:text-base"
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-normal tracking-wide hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-lg shadow-white/10 rounded-lg text-sm sm:text-base"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

