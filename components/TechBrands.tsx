"use client";

// Sony: featured / large — beyaz (filter)
// Apple, Adobe, DJI, Tamron, Meta: beyaz (filter)
// Google Ads: renkli (3 renkli bar ikonuyla tanınır)

const others = [
  { name: "Apple",      src: "/logos/apple.svg",      w: "w-7",   white: true  },
  { name: "Adobe",      src: "/logos/adobe.svg",       w: "w-28",  white: true  },
  { name: "DJI",        src: "/logos/dji.svg",         w: "w-20",  white: true  },
  { name: "Tamron",     src: "/logos/tamron.svg",      w: "w-28",  white: true  },
  { name: "Meta",       src: "/logos/meta.svg",        w: "w-28",  white: true  },
  { name: "Google Ads", src: "/logos/google-ads.svg",  w: "w-8",   white: false },
];

export default function TechBrands() {
  return (
    <section className="relative py-20 px-6">
      {/* Soft top line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/25 mb-12">
          Güvendiğim Markalar
        </p>

        {/* Sony — featured */}
        <div className="flex justify-center mb-12">
          <div className="group flex flex-col items-center gap-3">
            <img
              src="/logos/sony.svg"
              alt="Sony"
              className="h-10 w-auto opacity-55 hover:opacity-95 transition-all duration-500
                         brightness-0 invert
                         drop-shadow-[0_0_0px_rgba(255,255,255,0)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              draggable={false}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* Other brands — mobilde 3 sütunlu grid, masaüstünde flex */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center items-center gap-8 sm:gap-14">
          {others.map((brand) => (
            <div key={brand.name} className="group flex items-center justify-center">
              <img
                src={brand.src}
                alt={brand.name}
                className={[
                  "h-7 w-auto transition-all duration-500",
                  brand.white
                    ? "opacity-30 hover:opacity-70 brightness-0 invert"
                    : "opacity-40 hover:opacity-80",
                  brand.w,
                ].join(" ")}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Soft bottom line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}
