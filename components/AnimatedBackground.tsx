"use client";

import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Luxury blobs (fluid-like shapes)
    const blobs: Blob[] = [];
    const blobCount = 4;

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 200 + Math.random() * 300,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: i === 0 
          ? "rgba(184, 134, 11, 0.08)" 
          : i === 1 
          ? "rgba(255, 215, 0, 0.06)"
          : i === 2
          ? "rgba(139, 69, 19, 0.05)"
          : "rgba(120, 119, 198, 0.04)",
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      blobs.forEach((blob, index) => {
        // Update position with smooth movement
        blob.x += blob.speedX;
        blob.y += blob.speedY;

        // Bounce off edges
        if (blob.x < -blob.radius || blob.x > canvas.width + blob.radius) {
          blob.speedX *= -1;
        }
        if (blob.y < -blob.radius || blob.y > canvas.height + blob.radius) {
          blob.speedY *= -1;
        }

        // Keep within bounds
        blob.x = Math.max(-blob.radius, Math.min(canvas.width + blob.radius, blob.x));
        blob.y = Math.max(-blob.radius, Math.min(canvas.height + blob.radius, blob.y));

        // Draw luxury blob with organic shape
        ctx.beginPath();
        const points = 8;
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const radiusVariation = blob.radius + Math.sin(time + i) * 50;
          const x = blob.x + Math.cos(angle) * radiusVariation;
          const y = blob.y + Math.sin(angle) * radiusVariation;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        // Gradient fill
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fill();

        // Soft glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = blob.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

