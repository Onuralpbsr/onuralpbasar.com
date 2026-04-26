"use client";

const brands = [
  {
    name: "Sony",
    featured: true,
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="w-full h-full">
        <text
          x="60"
          y="30"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="28"
          letterSpacing="6"
        >
          SONY
        </text>
      </svg>
    ),
  },
  {
    name: "Apple",
    svg: (
      <svg viewBox="0 0 814 1000" fill="currentColor" className="w-full h-full">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.4-150.3-109.2C34 330.6 0 201.2 0 176.8c0-131.5 73.9-200.9 146.8-200.9 52.4 0 95.6 34.1 128.1 34.1 30.3 0 78.4-36.6 138.2-36.6 22.7 0 108.2 2.6 168.6 100.3zm-234.5-161.8c-5.8-29.1-14.8-57.6-29.9-81.6-27-46.5-68.4-81.6-115.9-81.6-2 0-4 .2-6 .5 27 41.1 44.2 89.6 44.2 138.5 0 4.5-.2 9-.5 13.5 2 .2 4 .5 6 .5 21.7 0 62.1-12.9 102.1-89.8z" />
      </svg>
    ),
  },
  {
    name: "Adobe",
    svg: (
      <svg viewBox="0 0 240 234" fill="currentColor" className="w-full h-full">
        <path d="M42.5 0h65L240 234h-65zm155 0h-65L0 234h65zM120 90l40.7 98h-81.4z" />
      </svg>
    ),
  },
  {
    name: "DJI",
    svg: (
      <svg viewBox="0 0 200 60" fill="currentColor" className="w-full h-full">
        <text
          x="100"
          y="46"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="44"
          letterSpacing="4"
        >
          DJI
        </text>
      </svg>
    ),
  },
  {
    name: "Tamron",
    svg: (
      <svg viewBox="0 0 260 50" fill="currentColor" className="w-full h-full">
        <text
          x="130"
          y="38"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="32"
          letterSpacing="3"
        >
          TAMRON
        </text>
      </svg>
    ),
  },
  {
    name: "Meta",
    svg: (
      <svg viewBox="0 0 287.56 191" fill="currentColor" className="w-full h-full">
        <path d="M31.06 126.8C31.06 145.6 36.32 160.2 44.68 169.54C53.04 178.88 64.36 183.68 76.58 183.68C89.44 183.68 99.32 179.74 109.56 169.44C119.8 159.14 127.78 143.54 137.16 119.22L143.1 103.76L152.36 119.14C162.22 135.26 165.58 150.32 165.58 165.38C165.58 177.12 163.12 187.42 158.46 196.26L143.1 189.56C147.44 181.06 149.58 172.24 149.58 163.38C149.58 153.16 147.46 143.82 141.82 133.06C133.86 155.98 124.88 172.46 113.28 183.62C99.38 196.96 84.36 202.94 67.8 202.94C50.62 202.94 35.26 196.7 24.12 184.96C12.98 173.22 7 156.2 7 134.42C7 115.98 10.78 100.24 17.52 86.74L31.06 93.16C25.04 104.2 22.06 116.4 22.06 130C22.06 129.6 31.06 126.8 31.06 126.8ZM250.5 126.8C250.5 129.6 259.5 129.6 259.5 130C259.5 116.4 256.52 104.2 250.5 93.16L264.04 86.74C270.78 100.24 274.56 115.98 274.56 134.42C274.56 156.2 268.58 173.22 257.44 184.96C246.3 196.7 230.94 202.94 213.76 202.94C197.2 202.94 182.18 196.96 168.28 183.62C156.68 172.46 147.7 155.98 139.74 133.06C134.1 143.82 132 153.16 132 163.38C132 172.24 134.12 181.06 138.46 189.56L123.1 196.26C118.44 187.42 116 177.12 116 165.38C116 150.32 119.34 135.26 129.2 119.14L135.14 103.76L141.08 119.22C150.46 143.54 158.44 159.14 168.68 169.44C178.92 179.74 188.8 183.68 201.66 183.68C213.88 183.68 225.2 178.88 233.56 169.54C241.92 160.2 247.18 145.6 247.18 126.8C247.18 112.18 244.2 99.96 238.18 88.92L250.5 82.82C256.9 95.96 260.5 111.08 260.5 128C260.5 127.6 250.5 126.8 250.5 126.8ZM140.78 9.26C159.72 9.26 176.82 19.86 190.7 37.34C204.54 54.76 214.26 80.28 218.12 110.8L201.96 112.92C198.58 86.06 190.72 64.02 179.78 49.44C168.84 34.86 155.34 26 140.78 26C126.22 26 112.72 34.86 101.78 49.44C90.84 64.02 82.98 86.06 79.6 112.92L63.44 110.8C67.3 80.28 77.02 54.76 90.86 37.34C104.74 19.86 121.84 9.26 140.78 9.26Z" />
      </svg>
    ),
  },
  {
    name: "Google Ads",
    svg: (
      <svg viewBox="0 0 192 192" fill="currentColor" className="w-full h-full">
        <path d="M96 8C48.6 8 10 46.6 10 94s38.6 86 86 86 86-38.6 86-86S143.4 8 96 8zm-8 134H56V50h32v92zm0-106H56V18h32v18zm48 106h-32V82h32v60zm0-74h-32V18h32v50z" />
      </svg>
    ),
  },
];

export default function TechBrands() {
  const featured = brands.filter((b) => b.featured);
  const rest = brands.filter((b) => !b.featured);

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-white/10" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
            Güvendiğim Markalar
          </p>
          <div className="w-8 h-px bg-white/20 mx-auto" />
        </div>

        {/* Sony — featured */}
        <div className="flex justify-center mb-12">
          {featured.map((brand) => (
            <div
              key={brand.name}
              className="group relative flex items-center justify-center"
            >
              <div className="relative w-52 h-16 text-white/50 hover:text-white/90 transition-all duration-500 drop-shadow-[0_0_20px_rgba(255,255,255,0)] hover:drop-shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                {brand.svg}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* Other brands */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 items-center justify-items-center">
          {rest.map((brand) => (
            <div
              key={brand.name}
              className="group flex flex-col items-center gap-3"
            >
              <div className="relative w-16 h-10 text-white/30 hover:text-white/70 transition-all duration-500 drop-shadow-[0_0_0px_rgba(255,255,255,0)] hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]">
                {brand.svg}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors duration-300">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-t from-transparent to-white/10" />
    </section>
  );
}
