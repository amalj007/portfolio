"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;

    async function initialize() {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
      });
      const updateScroll = () => ScrollTrigger.update();
      const tick = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", updateScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      destroy = () => {
        lenis.off("scroll", updateScroll);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
      window.setTimeout(() => ScrollTrigger.refresh(), 120);
    }

    void initialize();
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return <>{children}</>;
}
