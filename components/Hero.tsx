"use client";

import { useEffect, useRef, useState } from "react";

interface HeroProps {
  backgroundVideo: string;
}

export default function Hero({ backgroundVideo }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
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

    video.addEventListener("ended", handleEnded);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
      className="relative overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Smooth transition gradient at bottom - subtle and clean */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(35, 35, 35, 0.3) 40%, rgba(35, 35, 35, 0.7) 70%, #232323 100%)",
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
          className="w-full h-full object-cover"
          style={{
            opacity: videoOpacity * 0.85, // Base opacity 85% + fade effect
            filter: "blur(3px)", // Increased blur effect
            transition: "none", // Control opacity via JS, no CSS transition
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="opaque" />
      </div>

      {/* Content */}
      <div className="content text-center">
        <div className="px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl mb-4 sm:mb-6 text-white"
          style={{ fontFamily: "var(--font-signature), cursive" }}
        >
          Onuralp Başar
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-normal text-white/90 mb-3 sm:mb-4 tracking-wide px-2">
          Video Prodüksiyon & Sosyal Medya Yönetimi
        </p>
        <p className="text-sm sm:text-base md:text-lg text-white/70 font-normal max-w-2xl mx-auto leading-relaxed px-2">
          İşletmelere tanıtım ve reklam videoları üretiyorum. Tüm çekim ve
          montaj süreçlerini profesyonel bir şekilde yönetiyorum.
        </p>
          <div className="mt-8 sm:mt-12">
            <button
            onClick={() => {
              const element = document.getElementById("videos");
              element?.scrollIntoView({ behavior: "auto" });
            }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 backdrop-blur-md border border-white/30 text-white font-normal tracking-wide hover:bg-white/20 transition-all duration-300 shadow-lg shadow-white/10 rounded"
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

