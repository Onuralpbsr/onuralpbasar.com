"use client";

import { useEffect, useRef, useState } from "react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

interface ReferencesProps {
  brands: Brand[];
}

export default function References({ brands }: ReferencesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const autoScrollRef = useRef<number | null>(null);
  const scrollAmountRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, time: 0 });
  const momentumAnimationRef = useRef<number | null>(null);
  const currentScrollSpeedRef = useRef(0.3); // Normal scroll hızı

  // Auto scroll effect - sürekli kayma
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Başlangıç pozisyonunu ayarla
    if (scrollAmountRef.current === 0) {
      scrollAmountRef.current = container.scrollLeft || 0;
    }

    const scroll = () => {
      // Momentum animasyonu devam ediyorsa otomatik kaymayı durdur
      if (momentumAnimationRef.current) {
        autoScrollRef.current = requestAnimationFrame(scroll);
        return;
      }

      // Otomatik kayma aktifse ve dragging yoksa kaydır
      if (container && isAutoScrolling && !isDragging) {
        scrollAmountRef.current += currentScrollSpeedRef.current;
        const maxScroll = container.scrollWidth / 2; // İlk set'in sonu
        
        if (scrollAmountRef.current >= maxScroll) {
          scrollAmountRef.current = 0; // Seamless loop için başa dön
        }
        
        container.scrollLeft = scrollAmountRef.current;
        setScrollPosition(scrollAmountRef.current);
      }
      autoScrollRef.current = requestAnimationFrame(scroll);
    };

    // Hemen başlat
    autoScrollRef.current = requestAnimationFrame(scroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling, isDragging]);


  // Update scroll position when user scrolls (wheel, trackpad, etc.)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    let isUserScrolling = false;

    const handleScroll = () => {
      // Sadece scroll pozisyonunu güncelle
      setScrollPosition(container.scrollLeft);
      
      // Eğer kullanıcı elle kaydırdıysa (otomatik kayma değilse)
      if (isUserScrolling) {
        scrollAmountRef.current = container.scrollLeft;
        setIsAutoScrolling(false);
        clearTimeout(scrollTimeout);
        
        // Resume auto scroll after user stops scrolling
        scrollTimeout = setTimeout(() => {
          currentScrollSpeedRef.current = 0.3;
          setIsAutoScrolling(true);
          isUserScrolling = false;
        }, 2000);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      isUserScrolling = true;
      // Pause auto scroll on wheel
      setIsAutoScrolling(false);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        currentScrollSpeedRef.current = 0.3;
        setIsAutoScrolling(true);
        isUserScrolling = false;
      }, 2000);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Momentum scrolling animation
  const startMomentumScroll = (initialVelocity: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let velocity = initialVelocity;
    const friction = 0.95; // Sürtünme katsayısı (0.95 = yavaş yavaş durur)
    const minVelocity = 0.1; // Minimum hız (bundan küçükse dur)

    const animate = () => {
      if (Math.abs(velocity) < minVelocity) {
        // Momentum bitti, direkt normal hızda otomatik kaymaya dön
        // Mevcut scroll pozisyonunu güncelle - momentum sonrası gerçek pozisyon
        scrollAmountRef.current = container.scrollLeft;
        currentScrollSpeedRef.current = 0.3;
        setIsDragging(false); // Dragging'i kesinlikle false yap
        momentumAnimationRef.current = null; // Önce momentum'u temizle
        
        // Kısa bir delay sonra otomatik kaymayı başlat (momentum'un tamamen bitmesi için)
        setTimeout(() => {
          setIsAutoScrolling(true);
        }, 10);
        return;
      }

      const maxScroll = container.scrollWidth / 2;
      let newScrollLeft = container.scrollLeft - velocity;

      // Seamless loop kontrolü
      if (newScrollLeft >= maxScroll) {
        newScrollLeft = 0;
      } else if (newScrollLeft < 0) {
        newScrollLeft = maxScroll - 1;
      }

      container.scrollLeft = newScrollLeft;
      setScrollPosition(newScrollLeft);
      scrollAmountRef.current = newScrollLeft;

      // Hızı sürtünme ile azalt
      velocity *= friction;

      momentumAnimationRef.current = requestAnimationFrame(animate);
    };

    momentumAnimationRef.current = requestAnimationFrame(animate);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Momentum animasyonunu durdur
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
      momentumAnimationRef.current = null;
    }


    setIsDragging(true);
    setIsAutoScrolling(false);
    dragStartRef.current = {
      x: e.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
    };
    lastPositionRef.current = {
      x: e.pageX,
      time: Date.now(),
    };
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!isDragging || !container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - dragStartRef.current.x) * 1.5; // Scroll speed multiplier
    container.scrollLeft = dragStartRef.current.scrollLeft - walk;
    setScrollPosition(container.scrollLeft);
    scrollAmountRef.current = container.scrollLeft;

    // Hızı hesapla (son pozisyon ve zaman ile)
    const now = Date.now();
    const timeDelta = now - lastPositionRef.current.time;
    if (timeDelta > 0) {
      const distance = e.pageX - lastPositionRef.current.x;
      velocityRef.current = (distance / timeDelta) * 16; // 16ms frame time için normalize et
    }
    lastPositionRef.current = {
      x: e.pageX,
      time: now,
    };
  };

  const handleMouseUp = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(false);
    container.style.cursor = 'grab';
    container.style.userSelect = 'auto';
    
    // Momentum ile kaydırmaya devam et
    if (Math.abs(velocityRef.current) > 0.5) {
      startMomentumScroll(velocityRef.current);
    } else {
      // Hız çok düşükse direkt normal hızda otomatik kaymaya dön
      currentScrollSpeedRef.current = 0.3;
      setIsAutoScrolling(true);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Momentum animasyonunu durdur
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
      momentumAnimationRef.current = null;
    }


    setIsDragging(true);
    setIsAutoScrolling(false);
    dragStartRef.current = {
      x: e.touches[0].pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
    };
    lastPositionRef.current = {
      x: e.touches[0].pageX,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!isDragging || !container) return;

    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - dragStartRef.current.x) * 1.5;
    container.scrollLeft = dragStartRef.current.scrollLeft - walk;
    setScrollPosition(container.scrollLeft);
    scrollAmountRef.current = container.scrollLeft;

    // Hızı hesapla
    const now = Date.now();
    const timeDelta = now - lastPositionRef.current.time;
    if (timeDelta > 0) {
      const distance = e.touches[0].pageX - lastPositionRef.current.x;
      velocityRef.current = (distance / timeDelta) * 16;
    }
    lastPositionRef.current = {
      x: e.touches[0].pageX,
      time: now,
    };
  };

    const handleTouchEnd = () => {
      setIsDragging(false);
      
      // Momentum ile kaydırmaya devam et
      if (Math.abs(velocityRef.current) > 0.5) {
        startMomentumScroll(velocityRef.current);
      } else {
        // Hız çok düşükse direkt normal hızda otomatik kaymaya dön
        currentScrollSpeedRef.current = 0.3;
        setIsAutoScrolling(true);
      }
    };

  // Calculate scale and opacity based on position
  const getItemStyle = (index: number) => {
    if (!scrollContainerRef.current) {
      return { transform: "scale(0.6)", opacity: 0.2 };
    }

    const container = scrollContainerRef.current;
    const containerWidth = container.clientWidth;
    // Responsive item width: 240px (mobile) + gap (16px mobile, 24px sm, 32px md+)
    const gap = containerWidth < 640 ? 16 : containerWidth < 768 ? 24 : 32;
    const itemWidth = 240 + gap;
    const itemLeft = index * itemWidth;
    const itemCenter = itemLeft + itemWidth / 2;
    const containerCenter = containerWidth / 2;
    const scrollCenter = scrollPosition + containerCenter;
    
    // Distance from scroll center
    const distanceFromCenter = Math.abs(itemCenter - scrollCenter);
    const maxDistance = containerWidth * 0.7; // Maximum distance for full effect
    
    // Normalize distance (0 to 1) with easing
    const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
    const easedDistance = normalizedDistance * normalizedDistance; // Easing for smoother transition
    
    // Calculate scale: center = 1.0, edges = 0.6
    const scale = 1 - (easedDistance * 0.4);
    
    // Calculate opacity: center = 1.0, edges = 0.2
    const opacity = 1 - (easedDistance * 0.8);

    return {
      transform: `scale(${Math.max(0.6, Math.min(1, scale))})`,
      opacity: Math.max(0.2, Math.min(1, opacity)),
      transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
    };
  };

  return (
    <section
      id="references"
      className="py-12 sm:py-16 md:py-24"
      style={{
        background: "#111111",
        position: "relative",
        marginTop: "-1px",
      }}
    >
      {/* Smooth top fade from Videos section */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #111111, transparent)",
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wider mb-3 sm:mb-4 text-white">
            Referanslar
          </h2>
          <p className="text-white/50 font-normal text-base sm:text-lg max-w-2xl mx-auto px-2">
            Birlikte çalıştığımız markalar
          </p>
          {/* Orange divider */}
          <div className="mt-4 mx-auto w-12 h-0.5" style={{ background: "#f89821" }} />

          {/* Stats row */}
          <div className="mt-6 flex items-center justify-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-white">{brands.length}+</span>
              <span className="text-xs text-white/40 tracking-widest uppercase">Marka</span>
            </div>
            <div className="w-px h-8" style={{ background: "rgba(248,152,33,0.3)" }} />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-white">100+</span>
              <span className="text-xs text-white/40 tracking-widest uppercase">Proje</span>
            </div>
            <div className="w-px h-8" style={{ background: "rgba(248,152,33,0.3)" }} />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: "#f89821" }}>%100</span>
              <span className="text-xs text-white/40 tracking-widest uppercase">Memnuniyet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Carousel — full-width, no px padding so edge fades reach screen edges */}
      <div className="relative">
        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #111111, transparent)" }}
        />
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #111111, transparent)" }}
        />

        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 md:gap-8 hide-scrollbar cursor-grab active:cursor-grabbing px-4 sm:px-6"
          style={{
            scrollBehavior: "auto",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Duplicate brands for seamless loop */}
          {[...brands, ...brands].map((brand, index) => {
            const itemStyle = getItemStyle(index);
            return (
              <div
                key={`${brand.id}-${index}`}
                className="group flex flex-col items-center flex-shrink-0"
                style={{
                  minWidth: "200px",
                  width: "200px",
                  transform: itemStyle.transform,
                  opacity: itemStyle.opacity,
                  transition: itemStyle.transition,
                  transformOrigin: "center center",
                }}
              >
                {/* Dark glass outer frame */}
                <div
                  className="w-full aspect-square mb-3 rounded-2xl p-2.5 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(248,152,33,0.35)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 32px rgba(248,152,33,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.10)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                  }}
                >
                  {/* White inner logo stage — handles any logo type */}
                  <div
                    className="w-full h-full rounded-xl flex items-center justify-center p-3"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 opacity-75 group-hover:opacity-100 transition-all duration-300"
                      style={{ maxWidth: "85%", maxHeight: "85%" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Brand name */}
                {brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 text-xs sm:text-sm font-normal text-center hover:text-white/80 transition-colors duration-300 underline-offset-2 hover:underline px-2 leading-tight"
                  >
                    {brand.name}
                  </a>
                ) : (
                  <span className="text-white/50 text-xs sm:text-sm font-normal text-center group-hover:text-white/70 transition-colors duration-300 px-2 leading-tight">
                    {brand.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-white/20 text-xs mt-6 tracking-widest uppercase">
          ← sürükleyerek kaydırın →
        </p>
      </div>

      {/* Smooth bottom fade to Services section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #111111 0%, rgba(17, 17, 17, 0.7) 40%, rgba(17, 17, 17, 0.3) 70%, transparent 100%)",
        }}
      />
    </section>
  );
}

