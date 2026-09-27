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
