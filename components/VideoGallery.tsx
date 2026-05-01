"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { normalizeMediaUrl } from "@/lib/media";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  orientation: "horizontal" | "vertical";
  description?: string;
  client?: string;
  cinematic?: boolean;
  pinned?: number; // 0 = sabitlenmemiş, 1-4 = pin sırası
}

interface VideoGalleryProps {
  videos: Video[];
  backgroundVideo: string;
}

const PlayIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

// ─────────────────────────────────────────
// Portfolio video kartı
// ─────────────────────────────────────────
const VideoCard = ({
  video,
  onSelect,
}: {
  video: Video;
  onSelect: (v: Video) => void;
}) => (
  <div
    className="group relative cursor-pointer overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1"
    onClick={() => onSelect(video)}
  >
    <div
      className={`relative w-full ${
        video.orientation === "vertical" ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {video.thumbnail ? (
        <Image
          src={normalizeMediaUrl(video.thumbnail)}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <div className="w-full h-full bg-white/10" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      {/* Pin rozeti */}
      {video.pinned && video.pinned > 0 && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-[#f89821]/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-lg">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-black/80">
            <path d="M16 1H8C6.9 1 6 1.9 6 3v14l6 3 6-3V3c0-1.1-.9-2-2-2z"/>
          </svg>
          <span className="text-[10px] font-bold text-black/80 leading-none">{video.pinned}</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
          <PlayIcon size={18} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-white/50 text-xs mt-0.5 line-clamp-1">
            {video.description}
          </p>
        )}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────
// Ana bileşen
// ─────────────────────────────────────────
export default function VideoGallery({ videos, backgroundVideo }: VideoGalleryProps) {
  const cinematicVideos = videos.filter((v) => v.cinematic);
  const portfolioVideos = videos.filter((v) => !v.cinematic);
  const clients = ["Tümü", ...Array.from(new Set(portfolioVideos.map((v) => v.client).filter(Boolean) as string[]))];

  const [activeClient, setActiveClient] = useState("Tümü");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeCinemaIndex, setActiveCinemaIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sinematik arka plan video ref
  const cinemaVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const touchStartXRef = useRef(0);
  const cinemaTouchStartXRef = useRef(0);

  // Arka plan videosu IntersectionObserver
  useEffect(() => {
    const el = bgVideoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Aktif sinematik video değişince yeni videoyu oynat
  useEffect(() => {
    const el = cinemaVideoRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {});
  }, [activeCinemaIndex]);

  // Sinematik navigation
  const cinemaPrev = useCallback(() => {
    setActiveCinemaIndex((i) => (i - 1 + cinematicVideos.length) % cinematicVideos.length);
  }, [cinematicVideos.length]);

  const cinemaNext = useCallback(() => {
    setActiveCinemaIndex((i) => (i + 1) % cinematicVideos.length);
  }, [cinematicVideos.length]);

  // Portfolio filtreleme + sıralama
  // "Tümü" sekmesinde: sabitlenmiş (pin sırasına göre) önce, ardından en yeni en başta
  const filtered = (() => {
    const pool =
      activeClient === "Tümü"
        ? portfolioVideos
        : portfolioVideos.filter((v) => v.client === activeClient);

    return [...pool].sort((a, b) => {
      const aPinned = a.pinned || 0;
      const bPinned = b.pinned || 0;
      // Her iki video da sabitlenmişse pin sırasına göre
      if (aPinned > 0 && bPinned > 0) return aPinned - bPinned;
      // Sadece a sabitlenmişse a önce
      if (aPinned > 0) return -1;
      // Sadece b sabitlenmişse b önce
      if (bPinned > 0) return 1;
      // İkisi de sabitlenmemişse en yeni en başta (id = Date.now())
      return parseInt(b.id) - parseInt(a.id);
    });
  })();

  // Modal navigation
  const goNext = useCallback(() => {
    if (!selectedVideo) return;
    const pool = selectedVideo.cinematic ? cinematicVideos : filtered;
    const idx = pool.findIndex((v) => v.id === selectedVideo.id);
    setSelectedVideo(pool[(idx + 1) % pool.length]);
  }, [selectedVideo, cinematicVideos, filtered]);

  const goPrev = useCallback(() => {
    if (!selectedVideo) return;
    const pool = selectedVideo.cinematic ? cinematicVideos : filtered;
    const idx = pool.findIndex((v) => v.id === selectedVideo.id);
    setSelectedVideo(pool[(idx - 1 + pool.length) % pool.length]);
  }, [selectedVideo, cinematicVideos, filtered]);

  // Modal scroll lock + keyboard
  useEffect(() => {
    if (selectedVideo) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") setSelectedVideo(null);
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [selectedVideo, goNext, goPrev]);

  const activeCinema = cinematicVideos[activeCinemaIndex] ?? null;

  return (
    <section
      id="videos"
      className="relative overflow-hidden"
      style={{ background: "#0a0a0a", marginTop: "-1px" }}
    >
      {/* Section arka plan videosu */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          ref={bgVideoRef}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-25"
          style={{ filter: "blur(4px)" }}
        >
          <source src={normalizeMediaUrl(backgroundVideo)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]/90" />
      </div>

      {/* Üst fade */}
      <div className="absolute top-0 left-0 right-0 h-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)" }} />

      <div className="relative z-20">

        {/* ══════════════════════════════════
            SİNEMATİK BÖLÜM
        ══════════════════════════════════ */}
        {cinematicVideos.length > 0 && (
          <div className="pt-16 sm:pt-24 pb-12 sm:pb-16">
            {/* Başlık */}
            <div className="px-4 sm:px-6 max-w-7xl mx-auto flex items-center gap-3 mb-8 sm:mb-10">
              <span className="w-1 h-8 bg-[#f89821] rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-medium tracking-wider text-white">Sinematik</h2>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs tracking-widest uppercase hidden sm:block">Film kalitesi</span>
            </div>

            {/* Sinematik featured player */}
            {activeCinema && (
              <div
                className="relative"
                onTouchStart={(e) => { cinemaTouchStartXRef.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  const diff = cinemaTouchStartXRef.current - e.changedTouches[0].clientX;
                  if (Math.abs(diff) > 50) diff > 0 ? cinemaNext() : cinemaPrev();
                }}
              >
                {/* Video container — full width, letterbox */}
                <div className="relative w-full bg-black overflow-hidden" style={{ aspectRatio: "16/9", maxHeight: "80vh" }}>
                  {/* Letterbox çubukları */}
                  <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
                    style={{ height: "6%" , background: "#000" }} />
                  <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
                    style={{ height: "6%", background: "#000" }} />

                  {/* Autoplay arka plan videosu (sessiz) */}
                  {activeCinema.videoUrl ? (
                    <video
                      ref={cinemaVideoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      key={activeCinema.id}
                    >
                      <source src={normalizeMediaUrl(activeCinema.videoUrl)} type="video/mp4" />
                    </video>
                  ) : activeCinema.thumbnail ? (
                    <Image
                      src={normalizeMediaUrl(activeCinema.thumbnail)}
                      alt={activeCinema.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                  ) : null}

                  {/* Film grain */}
                  <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-[5]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      backgroundSize: "128px 128px",
                    }}
                  />

                  {/* Gradient overlay — alt bilgi için */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[6]" />

                  {/* Sol ok */}
                  {cinematicVideos.length > 1 && (
                    <button
                      onClick={cinemaPrev}
                      className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all"
                      aria-label="Önceki sinematik video"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Sağ ok */}
                  {cinematicVideos.length > 1 && (
                    <button
                      onClick={cinemaNext}
                      className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all"
                      aria-label="Sonraki sinematik video"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Tam ekran / sesli oynat butonu — ortada */}
                  <button
                    onClick={() => setSelectedVideo(activeCinema)}
                    className="absolute inset-0 flex items-center justify-center z-20 group/play"
                    aria-label="Sesi açık tam ekran oynat"
                  >
                    <div className="flex flex-col items-center gap-2 opacity-0 group-hover/play:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/35 transition-all hover:scale-110">
                        <PlayIcon size={26} />
                      </div>
                      <span className="text-white/80 text-xs tracking-widest uppercase">Sesi Aç</span>
                    </div>
                  </button>

                  {/* Alt bilgi */}
                  <div className="absolute bottom-[8%] left-6 sm:left-10 right-16 sm:right-20 z-20">
                    {activeCinema.client && (
                      <span className="inline-block text-xs tracking-[0.2em] uppercase text-[#f89821] mb-1 font-medium">
                        {activeCinema.client}
                      </span>
                    )}
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-medium text-white leading-tight">
                      {activeCinema.title}
                    </h3>
                    {activeCinema.description && (
                      <p className="text-white/60 text-sm mt-0.5 hidden sm:block">{activeCinema.description}</p>
                    )}
                  </div>

                  {/* Sayfa göstergesi */}
                  {cinematicVideos.length > 1 && (
                    <div className="absolute bottom-[8%] right-6 sm:right-10 z-20 flex gap-1.5">
                      {cinematicVideos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveCinemaIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i === activeCinemaIndex ? "bg-white w-4" : "bg-white/40"
                          }`}
                          aria-label={`${i + 1}. video`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail strip */}
                {cinematicVideos.length > 1 && (
                  <div className="px-4 sm:px-6 max-w-7xl mx-auto mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {cinematicVideos.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setActiveCinemaIndex(i)}
                        className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 focus:outline-none ${
                          i === activeCinemaIndex
                            ? "ring-2 ring-[#f89821] opacity-100 scale-105"
                            : "opacity-50 hover:opacity-80"
                        }`}
                        style={{ width: 140, height: 79 }}
                      >
                        {v.thumbnail ? (
                          <Image
                            src={normalizeMediaUrl(v.thumbnail)}
                            alt={v.title}
                            fill
                            className="object-cover"
                            sizes="140px"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/10" />
                        )}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-1 left-2 right-2">
                          <p className="text-white text-[10px] line-clamp-1 font-medium">{v.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            PORTFOLİO BÖLÜM
        ══════════════════════════════════ */}
        <div className="px-4 sm:px-6 pb-20 sm:pb-28 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <span className="w-1 h-8 bg-white/40 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-medium tracking-wider text-white">Çalışmalar</h2>
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs tracking-widest uppercase">{filtered.length} video</span>
          </div>

          {/* Kategori tabları */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 sm:mb-10 scrollbar-hide">
            {clients.map((c) => (
              <button
                key={c}
                onClick={() => { setActiveClient(c); setVisibleCount(12); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-normal tracking-wide transition-all duration-200 focus:outline-none ${
                  activeClient === c
                    ? "bg-white text-black shadow-lg shadow-white/20"
                    : "bg-white/8 text-white/60 border border-white/10 hover:bg-white/15 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Video grid — 4 sütun, düzenli */}
          {filtered.length === 0 ? (
            <p className="text-white/30 text-center py-16">Bu kategoride henüz video yok.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {filtered.slice(0, visibleCount).map((video) => (
                  <VideoCard key={video.id} video={video} onSelect={setSelectedVideo} />
                ))}
              </div>

              {/* Daha Fazla butonu */}
              {visibleCount < filtered.length && (
                <div className="flex justify-center mt-10 sm:mt-14">
                  <button
                    onClick={() => setVisibleCount((n) => n + 12)}
                    className="group flex items-center gap-3 px-8 py-3 bg-white/8 border border-white/20 text-white/70 hover:text-white hover:bg-white/15 hover:border-white/40 rounded-full text-sm tracking-widest uppercase transition-all duration-300"
                  >
                    <span>Daha Fazla</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      className="group-hover:translate-y-0.5 transition-transform duration-200"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                    <span className="text-white/30 text-xs normal-case tracking-normal">
                      ({filtered.length - visibleCount} video daha)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Alt fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #111 0%, transparent 100%)" }} />

      {/* ══════════════════════════════════
          VIDEO MODAL (ses açık, tam ekran)
      ══════════════════════════════════ */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedVideo(null)}
          onTouchStart={(e) => { touchStartXRef.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStartXRef.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
          }}
        >
          <div
            className={`relative w-full ${
              selectedVideo.orientation === "vertical" ? "max-w-sm" : "max-w-5xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-11 right-0 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-50"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Sol ok — desktop */}
            <button onClick={goPrev} className="hidden sm:flex absolute left-0 -translate-x-[130%] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 items-center justify-center text-white hover:bg-white/20 transition-colors z-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 19l-7-7 7-7"/></svg>
            </button>

            {/* Sağ ok — desktop */}
            <button onClick={goNext} className="hidden sm:flex absolute right-0 translate-x-[130%] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 items-center justify-center text-white hover:bg-white/20 transition-colors z-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 5l7 7-7 7"/></svg>
            </button>

            {/* Başlık */}
            <div className="mb-2 px-1">
              {selectedVideo.client && (
                <span className="text-xs text-[#f89821] tracking-widest uppercase">{selectedVideo.client}</span>
              )}
              <h3 className="text-white font-medium text-base sm:text-lg">{selectedVideo.title}</h3>
            </div>

            {/* Video — ses AÇIK */}
            <video
              controls
              autoPlay
              playsInline
              className="w-full rounded-xl max-h-[80vh] object-contain bg-black"
              src={normalizeMediaUrl(selectedVideo.videoUrl)}
              key={selectedVideo.id}
            >
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>

            {/* Mobil nav */}
            <div className="flex sm:hidden gap-3 mt-3">
              <button onClick={goPrev} className="flex-1 py-2.5 text-sm text-white/70 bg-white/8 border border-white/10 rounded-lg flex items-center justify-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 19l-7-7 7-7"/></svg>
                Önceki
              </button>
              <button onClick={goNext} className="flex-1 py-2.5 text-sm text-white/70 bg-white/8 border border-white/10 rounded-lg flex items-center justify-center gap-1.5">
                Sonraki
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
