"use client";

import { useEffect, useRef } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const photographs = [
  { chapter: "home", file: "hero-robotics-real.webp", label: "Industrial robot working in a laboratory" },
  { chapter: "about", file: "ship-bridge-real.webp", label: "Navigation bridge of a commercial vessel" },
  { chapter: "skills", file: "control-cabinet-real.webp", label: "Installed industrial PLC control cabinet" },
  { chapter: "experience", file: "engine-control-real.webp", label: "Engine control room aboard a vessel" },
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** A continuous, photographic backdrop with restrained, two-dimensional movement. */
export function SceneLayer() {
  const layers = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointer = 0;

    const render = () => {
      const viewport = window.innerHeight;
      const scroll = window.scrollY;
      const offsets = photographs.map(({ chapter }) => {
        const section = document.getElementById(chapter);
        return section ? section.getBoundingClientRect().top + scroll : 0;
      });
      const fades = offsets.slice(1).map((offset) =>
        smooth((scroll - (offset - viewport * 0.68)) / Math.max(1, viewport * 0.38)),
      );

      layers.current.forEach((layer, index) => {
        if (!layer) return;
        const entered = index === 0 ? 1 : fades[index - 1];
        const leaving = index === photographs.length - 1 ? 0 : fades[index];
        layer.style.opacity = String(entered * (1 - leaving));
        if (!motion.matches) {
          const chapterLength = Math.max(1, (offsets[index + 1] ?? offsets[index] + viewport * 1.8) - offsets[index]);
          const travel = clamp((scroll - offsets[index]) / chapterLength);
          layer.style.setProperty("--photo-y", `${((travel - 0.5) * 30).toFixed(1)}px`);
          layer.style.setProperty("--photo-x", `${(pointer * (index % 2 ? -7 : 7)).toFixed(1)}px`);
        }
      });
      frame = 0;
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch" || motion.matches) return;
      pointer = event.clientX / window.innerWidth * 2 - 1;
      schedule();
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return <div className="scene-layer photographic-scene" aria-hidden="true">
    {photographs.map(({ chapter, file, label }, index) => <div
      className={`photo-stage photo-stage-${chapter}`}
      key={chapter}
      ref={(element) => { layers.current[index] = element; }}
      style={{ opacity: index === 0 ? 1 : 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${basePath}/assets/images/${file}`}
        alt={label}
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "auto"}
        decoding="async"
      />
    </div>)}
    <div className="photo-vignette" />
    <div className="photo-grain" />
  </div>;
}

