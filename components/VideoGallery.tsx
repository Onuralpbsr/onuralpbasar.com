"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  orientation: "horizontal" | "vertical";
  description?: string;
}

interface VideoGalleryProps {
  videos: Video[];
  backgroundVideo: string;
}

// Video Card Component
interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  isVertical?: boolean;
  isHorizontal?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect, isVertical, isHorizontal }) => {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 rounded-lg"
      onClick={() => onSelect(video)}
    >
      <div
        className={`w-full h-full relative ${
          video.orientation === "vertical" ? "aspect-[3/4]" : "aspect-video"
        }`}
      >
        {/* Thumbnail Image */}
        {video.thumbnail && (
          <div className="absolute inset-0 z-0">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 z-20">
          <h3 className="text-white font-normal text-sm md:text-base mb-1 line-clamp-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-white/70 text-xs md:text-sm font-normal line-clamp-1">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


export default function VideoGallery({ videos, backgroundVideo }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState<"all" | "horizontal" | "vertical">(
    "all"
  );
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const filteredVideos =
    filter === "all"
      ? videos
      : videos.filter((video) => video.orientation === filter);

  // Layout algorithm: 4 top + center section (left vertical + center horizontal + right vertical) + 4 bottom
  const arrangeVideosWithCenterHorizontal = (videos: Video[]) => {
    const vertical = videos.filter(v => v.orientation === "vertical");
    const horizontal = videos.filter(v => v.orientation === "horizontal");
    
    // If no horizontal video, just return all vertical
    if (horizontal.length === 0) {
      return vertical;
    }
    
    // If no vertical video, just return all horizontal
    if (vertical.length === 0) {
      return horizontal;
    }
    
    const arranged: Video[] = [];
    
    // Top 4 videos
    if (vertical.length >= 4) {
      arranged.push(...vertical.slice(0, 4));
    } else {
      arranged.push(...vertical.slice(0, vertical.length));
    }
    
    // Left vertical video
    const leftIndex = Math.min(4, vertical.length);
    if (leftIndex < vertical.length) {
      arranged.push(vertical[leftIndex]);
    }
    
    // Center horizontal video
    arranged.push(horizontal[0]);
    
    // Right vertical video
    const rightIndex = Math.min(5, vertical.length);
    if (rightIndex < vertical.length) {
      arranged.push(vertical[rightIndex]);
    }
    
    // Bottom 4 videos
    const bottomStartIndex = Math.min(6, vertical.length);
    if (bottomStartIndex < vertical.length) {
      arranged.push(...vertical.slice(bottomStartIndex, bottomStartIndex + 4));
    }
    
    return arranged;
  };

  const arrangedVideos = filter === "all" 
    ? arrangeVideosWithCenterHorizontal(filteredVideos)
    : filteredVideos;

  // Navigation functions for video modal
  const getCurrentVideoIndex = () => {
    if (!selectedVideo) return -1;
    return filteredVideos.findIndex((v) => v.id === selectedVideo.id);
  };

  const goToNextVideo = () => {
    const currentIndex = getCurrentVideoIndex();
    if (currentIndex < filteredVideos.length - 1) {
      setSelectedVideo(filteredVideos[currentIndex + 1]);
    } else {
      // Loop to first video
      setSelectedVideo(filteredVideos[0]);
    }
  };

  const goToPrevVideo = () => {
    const currentIndex = getCurrentVideoIndex();
    if (currentIndex > 0) {
      setSelectedVideo(filteredVideos[currentIndex - 1]);
    } else {
      // Loop to last video
      setSelectedVideo(filteredVideos[filteredVideos.length - 1]);
    }
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (selectedVideo) {
      // Lock scroll when modal is open
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    } else {
      // Unlock scroll when modal is closed
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    if (!selectedVideo) return;

    const getCurrentIndex = () => {
      return filteredVideos.findIndex((v) => v.id === selectedVideo.id);
    };

    const handleNext = () => {
      const currentIndex = getCurrentIndex();
      if (currentIndex < filteredVideos.length - 1) {
        setSelectedVideo(filteredVideos[currentIndex + 1]);
      } else {
        setSelectedVideo(filteredVideos[0]);
      }
    };

    const handlePrev = () => {
      const currentIndex = getCurrentIndex();
      if (currentIndex > 0) {
        setSelectedVideo(filteredVideos[currentIndex - 1]);
      } else {
        setSelectedVideo(filteredVideos[filteredVideos.length - 1]);
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        setSelectedVideo(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [selectedVideo, filteredVideos]);

  return (
    <section
      id="videos"
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ 
        background: "#232323",
        marginTop: "-1px",
      }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
          style={{ filter: "blur(2px)" }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#232323]/70 via-[#232323]/50 to-[#232323]/70" />
      </div>

      {/* Smooth top fade from Hero section */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, #232323 0%, rgba(35, 35, 35, 0.7) 40%, rgba(35, 35, 35, 0.3) 70%, transparent 100%)",
        }}
      />
      {/* Smooth bottom fade to References section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, #1a1a1a 0%, rgba(26, 26, 26, 0.7) 40%, rgba(26, 26, 26, 0.3) 70%, transparent 100%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wider mb-3 sm:mb-4 text-white">
            Videolar
          </h2>
          <p className="text-white/70 font-normal text-base sm:text-lg max-w-2xl mx-auto px-2">
            Yatay ve dikey formatlarda ürettiğim video prodüksiyonlarım
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-normal tracking-wide transition-all duration-300 backdrop-blur-md rounded ${
              filter === "all"
                ? "border border-white/30 text-white bg-white/10 shadow-lg shadow-white/10"
                : "border border-white/20 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter("horizontal")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-normal tracking-wide transition-all duration-300 backdrop-blur-md rounded ${
              filter === "horizontal"
                ? "border border-white/30 text-white bg-white/10 shadow-lg shadow-white/10"
                : "border border-white/20 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5"
            }`}
          >
            Yatay
          </button>
          <button
            onClick={() => setFilter("vertical")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-normal tracking-wide transition-all duration-300 backdrop-blur-md rounded ${
              filter === "vertical"
                ? "border border-white/30 text-white bg-white/10 shadow-lg shadow-white/10"
                : "border border-white/20 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5"
            }`}
          >
            Dikey
          </button>
        </div>

        {/* Video Grid - Center Horizontal Layout with Equal Spacing */}
        <div 
          className="flex flex-col gap-4 sm:gap-6"
        >
          {/* Top Row - 4 Videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {arrangedVideos.slice(0, 4).map((video) => (
              <VideoCard key={video.id} video={video} onSelect={setSelectedVideo} />
            ))}
          </div>

          {/* Center Row - Left Vertical + Horizontal + Right Vertical */}
          {arrangedVideos.length > 4 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
              {/* Left Vertical Video - 3 columns */}
              {arrangedVideos[4] && (
                <div className="md:col-span-3 flex justify-center">
                  <VideoCard video={arrangedVideos[4]} onSelect={setSelectedVideo} isVertical={true} />
                </div>
              )}

              {/* Center Horizontal Video - 6 columns */}
              {arrangedVideos[5] && (
                <div className="md:col-span-6 flex justify-center">
                  <VideoCard video={arrangedVideos[5]} onSelect={setSelectedVideo} isHorizontal={true} />
                </div>
              )}

              {/* Right Vertical Video - 3 columns */}
              {arrangedVideos[6] && (
                <div className="md:col-span-3 flex justify-center">
                  <VideoCard video={arrangedVideos[6]} onSelect={setSelectedVideo} isVertical={true} />
                </div>
              )}
            </div>
          )}

          {/* Bottom Row - 4 Videos */}
          {arrangedVideos.length > 6 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {arrangedVideos.slice(7, 11).map((video) => (
                <VideoCard key={video.id} video={video} onSelect={setSelectedVideo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className={`relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-2xl shadow-black/50 w-full ${
              selectedVideo.orientation === "vertical"
                ? "max-w-sm max-h-[95vh]"
                : "max-w-6xl max-h-[95vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Arrow Button */}
            {filteredVideos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevVideo();
                }}
                className="absolute left-2 sm:left-0 sm:-translate-x-[120%] md:-translate-x-[150%] top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center hover:bg-white/20 z-50"
                aria-label="Önceki video"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Right Arrow Button */}
            {filteredVideos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextVideo();
                }}
                className="absolute right-2 sm:right-0 sm:translate-x-[120%] md:translate-x-[150%] top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center hover:bg-white/20 z-50"
                aria-label="Sonraki video"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 sm:-top-12 right-0 text-white text-xl sm:text-2xl hover:text-white/70 transition-colors bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/20 z-50"
            >
              ✕
            </button>
            <video
              controls
              autoPlay
              className={`w-full h-auto rounded-lg ${
                selectedVideo.orientation === "vertical"
                  ? "max-h-[85vh] sm:max-h-[85vh] object-contain"
                  : "max-h-[85vh] sm:max-h-[85vh] object-contain"
              }`}
              src={selectedVideo.videoUrl}
              key={selectedVideo.id}
            >
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}

