"use client";

const packages = [
  {
    id: "baslangic",
    name: "BAŞLANGIÇ",
    subtitle: "Temel Dijital Varlık",
    price: "12.000",
    features: [
      "4 post tasarımı / ay",
      "Haftalık 1 video içerik",
      "1 platform yönetimi",
      "1 Sosyal Medya Platformu",
      "İçerik planlaması & takvim",
    ],
    popular: false,
  },
  {
    id: "orta",
    name: "ORTA",
    subtitle: "Büyüme Odaklı",
    price: "18.000",
    features: [
      "8 post tasarımı / ay",
      "Haftalık 2 video içerik",
      "2 platform yönetimi",
      "2 Sosyal Medya Platformu",
      "Meta Ads yönetimi",
      "Reklam bütçesi hariç",
      "Aylık performans raporu",
      "Rakip & hedef kitle analizi",
    ],
    popular: true,
  },
  {
    id: "ust-duzey",
    name: "ÜST DÜZEY",
    subtitle: "Tam Kapsamlı",
    price: "30.000",
    features: [
      "12 post tasarımı / ay",
      "Haftalık 4 video içerik",
      "3 platform yönetimi",
      "3 Sosyal Medya Platformu",
      "Meta Ads + Google Ads",
      "Reklam bütçesi hariç",
      "Aylık strateji raporu",
      "Büyüme & içerik stratejisi",
      "Aylık 1 fotoğraf çekim seansı",
      "Öncelikli destek",
    ],
    popular: false,
  },
];

const extras = [
  { name: "Drone çekimi (Yarım Gün)", price: "6.000" },
  { name: "Drone çekimi (Tam Gün)", price: "10.000" },
  { name: "Kısa tanıtım filmi (30–60 sn)", price: "8.000" },
  { name: "Uzun tanıtım filmi (2–5 dk)", price: "20.000" },
  { name: "Reklam hesabı kurulum ücreti", price: "2.500" },
  { name: "Ek post tasarımı (Adet)", price: "1.000" },
  { name: "Logo & kurumsal kimlik", price: "8.000" },
  { name: "Video Düzenleme (Reels)", price: "1.000" },
];

export default function Packages() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="packages"
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "#111111", marginTop: "-1px" }}
    >
      {/* top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #111111 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-3 sm:mb-4 text-white uppercase">
            Hizmet Paketleri
          </h2>
          <p className="text-white/60 font-normal text-base sm:text-lg max-w-2xl mx-auto px-2">
            2026 · Markanızı birlikte büyütelim
          </p>
          {/* orange divider */}
          <div className="mt-5 mx-auto w-16 h-0.5" style={{ background: "#f89821" }} />
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-xl overflow-hidden ${
                pkg.popular
                  ? "border-2 shadow-lg"
                  : "border border-white/15"
              }`}
              style={
                pkg.popular
                  ? { borderColor: "#f89821", boxShadow: "0 0 40px rgba(248,152,33,0.15)" }
                  : {}
              }
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div
                  className="text-center py-1.5 text-xs font-bold tracking-widest uppercase"
                  style={{ background: "#f89821", color: "#0a0a0a" }}
                >
                  POPÜLER
                </div>
              )}

              <div className="flex flex-col flex-1 p-6 sm:p-8 bg-white/5 backdrop-blur-xl">
                {/* Package name */}
                <div className="mb-6">
                  <h3
                    className="text-xl sm:text-2xl font-bold tracking-widest uppercase mb-1"
                    style={pkg.popular ? { color: "#f89821" } : { color: "#fff" }}
                  >
                    {pkg.name}
                  </h3>
                  <p className="text-white/50 text-sm">{pkg.subtitle}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-3xl sm:text-4xl font-bold"
                      style={pkg.popular ? { color: "#f89821" } : { color: "#fff" }}
                    >
                      {pkg.price}
                    </span>
                    <span className="text-white/50 text-sm font-normal ml-1">₺ / aylık</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">KDV dahil değildir</p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span
                        className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                        style={
                          pkg.popular
                            ? { background: "rgba(248,152,33,0.2)", color: "#f89821" }
                            : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }
                        }
                      >
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={scrollToContact}
                  className="w-full py-3 text-sm font-bold tracking-widest uppercase rounded-lg"
                  style={
                    pkg.popular
                      ? { background: "#f89821", color: "#0a0a0a" }
                      : {
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#fff",
                        }
                  }
                >
                  Teklif Al
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Services */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <div
            className="px-6 sm:px-8 py-4 border-b border-white/10"
            style={{ background: "rgba(248,152,33,0.08)" }}
          >
            <h3 className="text-base sm:text-lg font-bold tracking-widest uppercase text-white">
              Ek Hizmetler{" "}
              <span className="text-white/40 font-normal text-sm normal-case tracking-normal ml-2">
                — Paket Dışı Ücretlendirmeler
              </span>
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {extras.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 sm:px-8 py-3.5 hover:bg-white/5"
              >
                <span className="text-white/80 text-sm">{item.name}</span>
                <span className="font-bold text-sm whitespace-nowrap ml-4" style={{ color: "#f89821" }}>
                  {item.price} ₺
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer notes */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs text-white/30 text-center">
          <span>* Fiyatlara KDV dahil değildir.</span>
          <span>* Reklam bütçeleri paket ücretine dahil değildir.</span>
          <span>Hizmet bölgeleri: Adana · Mersin · Gaziantep</span>
        </div>

        {/* Fatura notu */}
        <div className="mt-5 flex items-center justify-center gap-2.5">
          <div className="h-px flex-1 max-w-24" style={{ background: "rgba(248,152,33,0.2)" }} />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium" style={{ borderColor: "rgba(248,152,33,0.25)", color: "rgba(248,152,33,0.8)", background: "rgba(248,152,33,0.06)" }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tüm hizmetlerimiz için e-arşiv fatura kesilmektedir.
          </div>
          <div className="h-px flex-1 max-w-24" style={{ background: "rgba(248,152,33,0.2)" }} />
        </div>
      </div>

      {/* bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #111111 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
