"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollDirector({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      gsap.fromTo(
        "#hero-title .split-word",
        { yPercent: 118, opacity: 0, filter: "blur(12px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.25,
          stagger: 0.075,
          ease: "power4.out",
          delay: 0.18,
        },
      );

      gsap.fromTo(
        ".hero-intro",
        { y: 20, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.55,
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 34, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".proof-stat-value[data-count]").forEach((element) => {
        const end = Number(element.dataset.count || 0);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: end,
          duration: 1.35,
          ease: "power2.out",
          snap: { value: 1 },
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            element.textContent = String(counter.value).padStart(2, "0");
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".timeline-rail i").forEach((line) => {
        const item = line.closest<HTMLElement>(".timeline-item");
        if (!item) return;
        gsap.fromTo(
          line,
          { scaleY: 0, opacity: 0.25 },
          {
            scaleY: 1,
            opacity: 0.72,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 78%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".timeline-rail span").forEach((node) => {
        const item = node.closest<HTMLElement>(".timeline-item");
        if (!item) return;
        gsap.fromTo(
          node,
          { rotate: -18, scale: 0.82, opacity: 0.4 },
          {
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: "back.out(1.8)",
            scrollTrigger: { trigger: item, start: "top 82%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".project-art-wipe").forEach((element) => {
        gsap.fromTo(
          element,
          { scaleY: 1 },
          {
            scaleY: 0,
            transformOrigin: "bottom center",
            duration: 1.25,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.to(".hero-visual", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      const media = gsap.matchMedia();
      media.add("(min-width: 820px)", () => {
        const stage = document.querySelector<HTMLElement>(".work-stage");
        const track = document.querySelector<HTMLElement>(".project-track");
        if (!stage || !track) return;

        const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth + 44);
        return gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div className="site-root" ref={root}>
      {children}
    </div>
  );
}

