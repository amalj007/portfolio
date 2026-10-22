"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollDirector({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const select = (selector: string) =>
        gsap.utils.toArray<HTMLElement>(selector, scope);
      const media = gsap.matchMedia();
      let disposed = false;
      let refreshFrame = 0;
      const refresh = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
      };

      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // Server-rendered content stays readable before the optional motion starts.
          gsap.fromTo(
            select("#hero-title .split-word"),
            { yPercent: 38, opacity: 0.7 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.25,
              stagger: 0.12,
              ease: "power4.out",
              clearProps: "transform,opacity",
            },
          );
          gsap.fromTo(
            select(".hero-intro"),
            { y: 20, opacity: 0.7 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.07,
              delay: 0.12,
              ease: "power3.out",
              clearProps: "transform,opacity",
            },
          );

          select(".story-section h2").forEach((heading) => {
            const words = heading.querySelectorAll(".split-word");
            if (!words.length) return;
            if (heading.classList.contains("statement")) {
              gsap.fromTo(
                words,
                { opacity: 0.24 },
                {
                  opacity: 1,
                  stagger: 0.2,
                  ease: "none",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 82%",
                    end: "bottom 45%",
                    scrub: 0.6,
                  },
                },
              );
            } else {
              gsap.fromTo(
                words,
                { yPercent: 24, opacity: 0.55 },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 1,
                  stagger: 0.06,
                  ease: "power3.out",
                  immediateRender: false,
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 91%",
                    once: true,
                  },
                },
              );
            }
          });

          select("[data-reveal]").forEach((element) => {
            // Project containers stay still while their image owns its transform.
            if (
              element.classList.contains("project-card") ||
              element.querySelector("h2 .split-word")
            )
              return;
            gsap.fromTo(
              element,
              { y: 28, opacity: 0.65 },
              {
                y: 0,
                opacity: 1,
                duration: 1.05,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                  trigger: element,
                  start: "top 93%",
                  once: true,
                },
              },
            );
          });

          // A short, bounded travel inside clipped images gives depth without pinning
          // the document or changing native touch and keyboard navigation.
          select(".hero-image, .project-photo img").forEach((image) => {
            const frame = image.closest(".hero-image-wrap, .project-media");
            if (!frame) return;
            gsap.fromTo(
              image,
              { yPercent: -5 },
              {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.1,
                },
              },
            );
          });
          select(".project-art-frame svg").forEach((art) => {
            gsap.fromTo(
              art,
              { scale: 1.08 },
              {
                scale: 1,
                duration: 1.6,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: { trigger: art, start: "top 94%", once: true },
              },
            );
          });
          const star = scope.querySelector(".contact-star");
          if (star)
            gsap.fromTo(
              star,
              { rotate: -35 },
              {
                rotate: 35,
                ease: "none",
                scrollTrigger: {
                  trigger: "#contact",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.5,
                },
              },
            );
        },
        scope,
      );

      const images = Array.from(scope.querySelectorAll("img"));
      images.forEach((image) => image.addEventListener("load", refresh));
      void document.fonts?.ready.then(() => {
        if (!disposed) refresh();
      });
      window.addEventListener("load", refresh);
      refresh();
      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        images.forEach((image) => image.removeEventListener("load", refresh));
        window.removeEventListener("load", refresh);
        media.revert();
      };
    },
    { scope: root },
  );

  return (
    <div className="site-root" ref={root}>
      {children}
    </div>
  );
}
