"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[200] h-[2px] pointer-events-none"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(to right, #f89821, rgba(248,152,33,0.6))",
        transition: "width 0.08s linear",
        boxShadow: "0 0 6px rgba(248,152,33,0.5)",
      }}
    />
  );
}
