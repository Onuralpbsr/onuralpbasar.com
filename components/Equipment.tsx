"use client";

import { useState, useEffect, useRef } from "react";

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface EquipmentProps {
  equipment: EquipmentItem[];
  categories: string[];
}

export default function Equipment({ equipment, categories }: EquipmentProps) {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const filteredEquipment =
    selectedCategory === "Tümü"
      ? equipment
      : equipment.filter((item) => item.category === selectedCategory);

  const allCategories = ["Tümü", ...categories];

  return (
    <section
      ref={sectionRef}
      id="equipment"
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: "#1a1a1a" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-medium tracking-wider mb-4 text-white">
            Ekipmanlar
          </h2>
          <p className="text-white/70 font-normal text-lg max-w-2xl mx-auto">
            Kullandığım profesyonel ekipmanlar ve yazılımlar
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-200 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 font-normal tracking-wide transition-all duration-300 ${
                selectedCategory === category
                  ? "border border-white/50 text-white bg-white/10"
                  : "border border-white/20 text-white/60 hover:text-white hover:border-white/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item, index) => (
            <div
              key={item.id}
              className={`p-6 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:bg-white/10 rounded-lg shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="text-sm text-white/50 font-normal mb-2">
                {item.category}
              </div>
              <h3 className="text-xl font-medium tracking-wide mb-2 text-white">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-white/60 text-sm font-normal">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Smooth bottom fade to Contact section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #1a1a1a 0%, rgba(26, 26, 26, 0.7) 40%, rgba(26, 26, 26, 0.3) 70%, transparent 100%)",
        }}
      />
    </section>
  );
}

