"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeMediaUrl } from "@/lib/media";

interface HeroProps {
  backgroundVideo: string;
}

export default function Hero({ backgroundVideo }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  // Opacity is applied directly to DOM — no React state to avoid 60fps re-renders
  const opacityRef = useRef(1);

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

        // DOM'a direkt yaz — React state güncellemesi yok, re-render yok
        if (newOpacity !== opacityRef.current) {
          opacityRef.current = newOpacity;
          if (video) video.style.opacity = String(newOpacity * 0.85);
        }
      }

      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      // Video bittiğinde direkt DOM'a yaz
      if (video) video.style.opacity = "0";

      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }, 300);
    };

    // Start animation loop only when video is playing
    video.addEventListener("timeupdate", () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateOpacity);
      }
    });

    video.addEventListener("ended", handleEnded);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate blur and opacity based on scroll - slower fade for more scroll
  const maxScroll = 3000; // Increased significantly for longer visibility
  const blurAmount = Math.min(scrollY / 80, 8); // Slower blur increase
  const opacity = Math.max(1 - scrollY / maxScroll, 0);

  return (
    <section
      id="hero"
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Smooth transition gradient at bottom - subtle and clean */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(10, 10, 10, 0.3) 40%, rgba(10, 10, 10, 0.7) 70%, #0a0a0a 100%)",
        }}
      />
      {/* Feature Background */}
      <div 
        ref={featureRef}
        className="feature"
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: opacity,
          transition: "filter 0.1s ease-out, opacity 0.1s ease-out",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="none"
          poster="/hero-poster.webp"
          className="w-full h-full object-cover hero-video"
          style={{
            opacity: 0.85,
            transition: "none",
          }}
        >
          <source src={normalizeMediaUrl(backgroundVideo)} type="video/mp4" />
        </video>
        <div className="opaque" />
      </div>

      {/* Content */}
      <div className="content text-center">
        <div className="px-4 sm:px-6 max-w-4xl mx-auto w-full">
          {/* Shimmer title — orange light sweeps through on loop */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl mb-4 sm:mb-6 text-shimmer animate-fade-up delay-100"
            style={{ fontFamily: "var(--font-signature), cursive" }}
          >
            Onuralp Başar
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-normal text-white/90 mb-3 sm:mb-4 tracking-wide px-2">
            Video Prodüksiyon & Sosyal Medya Yönetimi
          </p>

          <p className="text-sm sm:text-base md:text-lg text-white/60 font-normal max-w-2xl mx-auto leading-relaxed px-2 animate-fade-up delay-400">
            İşletmelere tanıtım ve reklam videoları üretiyorum. Tüm çekim ve
            montaj süreçlerini profesyonel bir şekilde yönetiyorum.
          </p>

          <div className="mt-8 sm:mt-12 animate-fade-up delay-500">
            <button
              onClick={() => {
                const element = document.getElementById("videos");
                element?.scrollIntoView({ behavior: "auto" });
              }}
              className="px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base bg-white/10 backdrop-blur-md border border-white/30 text-white font-normal tracking-widest uppercase hover:bg-white/20 rounded pulse-orange"
            >
              İşlerimi İncele
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}

