import Image from "next/image";

interface ContactData {
  phone: string;
  email: string;
  location: string;
  website: string;
  socials: {
    instagram: string;
    linkedin: string;
  };
}

interface FooterProps {
  contactData: ContactData;
}

export default function Footer({ contactData }: FooterProps) {
  return (
    <footer
      className="border-t border-white/10 px-4 sm:px-6 pt-12 sm:pt-16 pb-8"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Ana içerik */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 mb-10">

          {/* Logo */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <Image
              src="/logo-dark-bg.svg"
              alt="ONR Dijital Medya Ajansı"
              width={140}
              height={84}
              className="h-16 sm:h-20 w-auto"
            />
            <p className="text-xs text-white/30 text-center sm:text-left leading-relaxed max-w-[180px]">
              Markanızı birlikte büyütelim.
            </p>
          </div>

          {/* İletişim */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className="text-xs text-white/40 tracking-widest uppercase mb-1">İletişim</span>
            <a
              href={`tel:${contactData.phone}`}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {contactData.phone}
            </a>
            <a
              href={`mailto:${contactData.email}`}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {contactData.email}
            </a>
            <span className="text-sm text-white/40">
              Adana · Mersin · Gaziantep
            </span>
          </div>

          {/* Sosyal medya */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className="text-xs text-white/40 tracking-widest uppercase mb-1">Sosyal Medya</span>
            <a
              href={contactData.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a
              href={contactData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/20">
          <span>© {new Date().getFullYear()} ONR Dijital Medya Ajansı. Tüm hakları saklıdır.</span>
          <span>e-Arşiv Fatura · KDV Dahil Değildir</span>
        </div>
      </div>
    </footer>
  );
}
