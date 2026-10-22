"use client";

import { useEffect } from "react";

/** Pointer lighting is event-driven; CSS handles the slow ambient movement. */
export function LiquidEffects() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let surface: HTMLElement | null = null;
    let previous: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous?.style.removeProperty("--glass-hover");
      previous = null;
      surface = null;
    };
    const paint = () => {
      frame = 0;
      const bounds = surface?.getBoundingClientRect();
      if (previous !== surface) previous?.style.removeProperty("--glass-hover");
      previous = surface;
      if (!surface || !bounds?.width || !bounds.height) return;
      surface.style.setProperty(
        "--glass-x",
        `${Math.max(0, Math.min(100, ((x - bounds.left) / bounds.width) * 100))}%`,
      );
      surface.style.setProperty(
        "--glass-y",
        `${Math.max(0, Math.min(100, ((y - bounds.top) / bounds.height) * 100))}%`,
      );
      surface.style.setProperty("--glass-hover", "1");
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || !pointer.matches || event.pointerType === "touch")
        return;
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(".glass-surface")
          : null;
      // Project cards own their tilt and pointer coordinates independently.
      surface = target?.classList.contains("project-card") ? null : target;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    motion.addEventListener("change", reset);
    pointer.addEventListener("change", reset);
    return () => {
      reset();
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
      motion.removeEventListener("change", reset);
      pointer.removeEventListener("change", reset);
    };
  }, []);

  return (
    <div className="liquid-atmosphere" aria-hidden="true">
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="ambient-orb ambient-orb-three" />
      <div className="atmosphere-grid" />
    </div>
  );
}

export function LiquidEmblem() {
  return (
    <span className="liquid-emblem" aria-hidden="true">
      <span className="emblem-orbit" />
      <span className="emblem-core" />
      <span className="emblem-glint" />
    </span>
  );
}
