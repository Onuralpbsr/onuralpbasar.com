"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:opacity-75 flex items-center"
            aria-label="ONR Dijital Medya Ajansı - Ana Sayfa"
          >
            <Image
              src="/logo-dark-bg.svg"
              alt="ONR Dijital Medya Ajansı"
              width={120}
              height={72}
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("videos")}
              className="text-sm font-normal tracking-wide text-white/80 hover:text-white transition-colors"
            >
              Videolar
            </button>
            <button
              onClick={() => scrollToSection("references")}
              className="text-sm font-normal tracking-wide text-white/80 hover:text-white transition-colors"
            >
              Referanslar
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-sm font-normal tracking-wide text-white/80 hover:text-white transition-colors"
            >
              Hizmetler
            </button>
            <button
              onClick={() => scrollToSection("packages")}
              className="text-sm font-bold tracking-wide hover:opacity-80 transition-colors"
              style={{ color: "#f89821" }}
            >
              Paketler
            </button>
            <button
              onClick={() => scrollToSection("equipment")}
              className="text-sm font-normal tracking-wide text-white/80 hover:text-white transition-colors"
            >
              Ekipmanlar
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-normal tracking-wide text-white/80 hover:text-white transition-colors"
            >
              İletişim
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Menü"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pb-4 border-t border-white/10 mt-4 pt-4">
            <button
              onClick={() => scrollToSection("videos")}
              className="text-base font-normal tracking-wide text-white/80 hover:text-white transition-colors text-left py-2"
            >
              Videolar
            </button>
            <button
              onClick={() => scrollToSection("references")}
              className="text-base font-normal tracking-wide text-white/80 hover:text-white transition-colors text-left py-2"
            >
              Referanslar
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-base font-normal tracking-wide text-white/80 hover:text-white transition-colors text-left py-2"
            >
              Hizmetler
            </button>
            <button
              onClick={() => scrollToSection("packages")}
              className="text-base font-bold tracking-wide text-left py-2 hover:opacity-80"
              style={{ color: "#f89821" }}
            >
              Paketler
            </button>
            <button
              onClick={() => scrollToSection("equipment")}
              className="text-base font-normal tracking-wide text-white/80 hover:text-white transition-colors text-left py-2"
            >
              Ekipmanlar
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-base font-normal tracking-wide text-white/80 hover:text-white transition-colors text-left py-2"
            >
              İletişim
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

