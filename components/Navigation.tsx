"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

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
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled
          ? "bg-white/5 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-3xl text-white hover:text-gray-300 transition-colors"
            style={{ fontFamily: "var(--font-signature), cursive" }}
          >
            Onuralp Başar
          </button>
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
        </div>
      </div>
    </nav>
  );
}

