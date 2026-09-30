"use client";

import type Lenis from "lenis";
import type { ReactNode } from "react";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let generation = 0;
    let instance: Lenis | undefined;
    let destroy: (() => void) | undefined;
    let refreshFrame = 0;

    const scrollToPosition = (event: Event) => {
      const detail = (event as CustomEvent<{ top: number; immediate?: boolean }>).detail;
      if (!detail) return;
      const { top, immediate = false } = detail;
      if (!Number.isFinite(top)) return;
      if (instance) instance.scrollTo(top, { immediate });
      else window.scrollTo({ top, behavior: "auto" });
    };

    async function initialize() {
      const currentGeneration = ++generation;
      destroy?.();
      destroy = undefined;
      instance = undefined;
      cancelAnimationFrame(refreshFrame);
      if (reducedMotion.matches) return;

      const runtime = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]).catch(() => null);
      // Native scrolling remains available if an optional animation chunk fails.
      if (!runtime || cancelled || currentGeneration !== generation || reducedMotion.matches) return;
      const [{ default: LenisConstructor }, { gsap }, { ScrollTrigger }] = runtime;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new LenisConstructor({
        autoRaf: false,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -100 },
        // Preserve native gestures and keyboard scrolling inside the carousel.
        prevent: (node) => !!node.closest('[data-scroll-mode="native"] .project-track'),
      });
      instance = lenis;
      const updateScroll = () => ScrollTrigger.update();
      const tick = (time: number) => lenis.raf(time * 1000);
      const resize = () => lenis.resize();

      lenis.on("scroll", updateScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.addEventListener("refresh", resize);

      destroy = () => {
        lenis.off("scroll", updateScroll);
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener("refresh", resize);
        lenis.destroy();
      };
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    const updateMotionPreference = () => { void initialize(); };
    reducedMotion.addEventListener("change", updateMotionPreference);
    window.addEventListener("portfolio:scroll-to", scrollToPosition);
    void initialize();

    return () => {
      cancelled = true;
      generation += 1;
      cancelAnimationFrame(refreshFrame);
      reducedMotion.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("portfolio:scroll-to", scrollToPosition);
      destroy?.();
    };
  }, []);

  return <>{children}</>;
}
