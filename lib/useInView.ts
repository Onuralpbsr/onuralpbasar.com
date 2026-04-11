"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useReveal — Scroll-triggered stagger reveal for a group of elements.
 *
 * Usage:
 *   const ref = useReveal();
 *   <div ref={ref}>
 *     <div data-reveal data-delay="0">First</div>
 *     <div data-reveal data-delay="150">Second</div>
 *   </div>
 *
 * When the container enters the viewport, each [data-reveal] child gets the
 * "revealed" class added (with its individual transition-delay from data-delay).
 * Pair with .reveal / .reveal-left / .reveal-right / .reveal-scale CSS classes.
 */
export function useReveal(threshold = 0.12) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    targets.forEach((el) => {
      const delay = el.dataset.delay;
      if (delay) el.style.transitionDelay = `${delay}ms`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          targets.forEach((el) => el.classList.add("revealed"));
          observer.unobserve(container);
        }
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [threshold]);

  return containerRef;
}

/**
 * useInView — Returns { ref, isVisible } for a single element.
 * Useful for triggering JS-based animations (e.g. number count-up).
 */
export function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
