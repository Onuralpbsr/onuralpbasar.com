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
        background: "#111111",
        marginTop: "-1px", // Remove gap
      }}
    >
      {/* Smooth top fade from Equipment section */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #111111 0%, rgba(17, 17, 17, 0.7) 40%, rgba(17, 17, 17, 0.3) 70%, transparent 100%)",
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/80 via-[#111111]/60 to-[#111111]/80" />
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wider mb-3 sm:mb-4 text-white">
            Teklif Alın
          </h2>
          <p className="text-white/60 font-normal text-base sm:text-lg px-2">
            Projenizi anlatın, size özel teklif hazırlayalım.
          </p>
          <div className="mt-4 mx-auto w-12 h-0.5" style={{ background: "#f89821" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs text-white/50 font-normal mb-2 tracking-widest uppercase">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/8 rounded-lg text-sm"
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs text-white/50 font-normal mb-2 tracking-widest uppercase">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/8 rounded-lg text-sm"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-xs text-white/50 font-normal mb-2 tracking-widest uppercase">
              Mesaj
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 resize-none rounded-lg text-sm"
              placeholder="Projenizi kısaca anlatın..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 font-bold tracking-widest uppercase text-sm rounded-lg"
            style={{ background: "#f89821", color: "#0a0a0a" }}
          >
            Teklif İste
          </button>
        </form>
      </div>
    </section>
  );
}

