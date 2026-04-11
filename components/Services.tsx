"use client";

import { useEffect, useRef } from "react";
import { normalizeMediaUrl } from "@/lib/media";
import { useReveal } from "@/lib/useInView";

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
  const headerRef = useReveal(0.2);
  const cardsRef = useReveal(0.1);

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
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ 
        background: "#111111",
        marginTop: "-1px", // Remove gap
      }}
    >
      {/* Smooth top fade from References section */}
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
          aria-hidden="true"
          className="w-full h-full object-cover opacity-50"
        >
          <source src={normalizeMediaUrl(backgroundVideo)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/80 via-[#111111]/60 to-[#111111]/80" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            data-reveal data-delay="0"
            className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wider mb-3 sm:mb-4 text-white"
          >
            Hizmetler
          </h2>
          <p
            data-reveal data-delay="150"
            className="reveal text-white/70 font-normal text-base sm:text-lg max-w-2xl mx-auto px-2"
          >
            Sunduğum profesyonel hizmetler
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              data-reveal
              data-delay={index * 130}
              className={`${index % 2 === 0 ? "reveal-left" : "reveal-right"} group relative p-6 sm:p-8 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:bg-white/10 rounded-lg sm:rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 overflow-hidden`}
            >
              {/* Decorative gradient line on the left */}
              <div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all duration-300" style={{ background: "linear-gradient(to bottom, transparent, #f89821, transparent)" }} />
              
              {/* Number badge */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/20 group-hover:text-white/40 transition-colors duration-300 font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Title with decorative element */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-1 h-5 sm:h-6 rounded-full group-hover:h-6 sm:group-hover:h-8 transition-all duration-300" style={{ background: "linear-gradient(to bottom, #f89821, rgba(248,152,33,0.3))" }} />
                  <h3 className="text-xl sm:text-2xl font-medium tracking-wide text-white">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Hover effect - subtle orange glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" style={{ background: "linear-gradient(135deg, transparent, rgba(248,152,33,0.04))" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Smooth bottom fade to Equipment section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #111111 0%, rgba(17, 17, 17, 0.7) 40%, rgba(17, 17, 17, 0.3) 70%, transparent 100%)",
        }}
      />
    </section>
  );
}

