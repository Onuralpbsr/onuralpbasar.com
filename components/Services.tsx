"use client";

import { useEffect, useRef } from "react";

interface Service {
  id: string;
  title: string;
  description: string;
}

interface ServicesProps {
  services: Service[];
  backgroundVideo: string;
}

export default function Services({ services, backgroundVideo }: ServicesProps) {
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

  return (
    <section
      id="services"
      className="py-24 px-6 relative overflow-hidden"
      style={{ 
        background: "#1a1a1a",
        marginTop: "-1px", // Remove gap
      }}
    >
      {/* Smooth top fade from References section */}
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
          className="w-full h-full object-cover opacity-50"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#1a1a1a]/60 to-[#1a1a1a]/80" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-medium tracking-wider mb-4 text-white">
            Hizmetler
          </h2>
          <p className="text-white/70 font-normal text-lg max-w-2xl mx-auto">
            Sunduğum profesyonel hizmetler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 overflow-hidden"
            >
              {/* Decorative gradient line on the left */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/0 via-white/40 to-white/0 group-hover:w-1.5 transition-all duration-300" />
              
              {/* Number badge */}
              <div className="absolute top-6 right-6 text-white/20 group-hover:text-white/40 transition-colors duration-300 font-medium text-6xl md:text-7xl leading-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Title with decorative element */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-white/60 to-white/20 rounded-full group-hover:h-8 transition-all duration-300" />
                  <h3 className="text-2xl font-medium tracking-wide text-white">
                    {service.title}
                  </h3>
                </div>
                <p className="text-white/70 font-normal leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Hover effect - subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Smooth bottom fade to Equipment section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #1a1a1a 0%, rgba(26, 26, 26, 0.7) 40%, rgba(26, 26, 26, 0.3) 70%, transparent 100%)",
        }}
      />
    </section>
  );
}

