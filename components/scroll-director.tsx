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
      const scope = root.current;
      if (!scope) return;

      const select = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, scope);
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
        {
          immersive: "(min-width: 1024px) and (min-height: 720px) and (pointer: fine)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { immersive, reducedMotion } = context.conditions!;
          const stage = scope.querySelector<HTMLElement>(".work-stage");
          const track = scope.querySelector<HTMLElement>(".project-track");
          const chapters = select(".story-section");
          const previousMode = stage?.dataset.scrollMode;
          const cleanup: Array<() => void> = [];

          if (stage && track) {
            stage.dataset.scrollMode = immersive && !reducedMotion ? "cinematic" : "native";
            if (!immersive || reducedMotion) {
              // Every project remains reachable on touch, short viewports,
              // and when the visitor requests reduced movement.
              gsap.set(stage, { height: "auto", minHeight: 0, overflow: "visible" });
              gsap.set(track, { x: 0, width: "100%", overflowX: "auto" });
            }
          }

          const restore = () => {
            cleanup.forEach((dispose) => dispose());
            scope.style.removeProperty("--journey-progress");
            chapters.forEach((section) => section.style.removeProperty("--chapter-progress"));
            if (stage) {
              stage.style.removeProperty("--project-progress");
              if (previousMode) stage.dataset.scrollMode = previousMode;
              else delete stage.dataset.scrollMode;
            }
          };

          if (reducedMotion) return restore;

          // Content is visible in server HTML. A partially visible entrance
          // keeps loading and restored deep links from showing a blank hero.
          gsap.fromTo(select("#hero-title .split-word"), { yPercent: 24, opacity: 0.66 }, {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.09,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
          gsap.fromTo(select(".hero-intro"), { y: 14, opacity: 0.72 }, {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.055,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });

          ScrollTrigger.create({
            trigger: scope,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => scope.style.setProperty("--journey-progress", self.progress.toFixed(4)),
            onRefresh: (self) => scope.style.setProperty("--journey-progress", self.progress.toFixed(4)),
          });

          chapters.forEach((section) => {
            ScrollTrigger.create({
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              onUpdate: (self) => section.style.setProperty("--chapter-progress", self.progress.toFixed(4)),
              onRefresh: (self) => section.style.setProperty("--chapter-progress", self.progress.toFixed(4)),
            });

            const words = section.querySelectorAll("h2 .split-word");
            if (words.length) {
              gsap.fromTo(words, { yPercent: 28, opacity: 0.62 }, {
                yPercent: 0,
                opacity: 1,
                duration: 0.95,
                stagger: 0.075,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: { trigger: words[0].closest("h2"), start: "top 88%", once: true },
              });
            }

            const wash = section.querySelector(".section-wash");
            if (wash && immersive) {
              gsap.fromTo(wash, { yPercent: -7 }, {
                yPercent: 8,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
              });
            }
          });

          select("[data-reveal], .about-copy > p").forEach((element) => {
            // Framer Motion owns card transforms. Heading words and about
            // paragraphs have their own choreography; avoid moving them twice.
            if (element.matches(".project-card, .about-copy") || element.querySelector("h2 .split-word")) return;
            gsap.fromTo(element, { y: 26, opacity: 0.62 }, {
              y: 0,
              opacity: 1,
              duration: 1.05,
              ease: "power3.out",
              immediateRender: false,
              scrollTrigger: { trigger: element, start: "top 91%", once: true },
            });
          });

          select(".proof-stat-value[data-count]").forEach((element) => {
            const finalText = element.textContent;
            const counter = { value: 0 };
            gsap.to(counter, {
              value: Number(element.dataset.count || 0),
              duration: 1.5,
              ease: "power2.out",
              snap: { value: 1 },
              scrollTrigger: { trigger: element, start: "top 90%", once: true },
              onUpdate: () => { element.textContent = String(counter.value).padStart(2, "0"); },
              onComplete: () => { element.textContent = finalText; },
            });
            cleanup.push(() => { element.textContent = finalText; });
          });

          select(".timeline-item").forEach((item) => {
            const line = item.querySelector(".timeline-rail i");
            const node = item.querySelector(".timeline-rail span");
            if (line) {
              gsap.fromTo(line, { scaleY: 0.12, opacity: 0.25 }, {
                scaleY: 1,
                opacity: 0.72,
                transformOrigin: "top center",
                ease: "none",
                immediateRender: false,
                scrollTrigger: { trigger: item, start: "top 75%", end: "bottom 60%", scrub: 0.65 },
              });
            }
            if (node) {
              gsap.fromTo(node, { rotate: -12, scale: 0.9 }, {
                rotate: 0,
                scale: 1,
                duration: 0.85,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: { trigger: item, start: "top 84%", once: true },
              });
            }
          });

          gsap.to(select(".hero-visual"), {
            yPercent: 9,
            scale: 0.97,
            ease: "none",
            scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 1 },
          });

          let horizontal: gsap.core.Tween | undefined;
          if (stage && track && immersive) {
            const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
            horizontal = gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => "+=" + Math.max(distance(), 1),
                pin: true,
                scrub: 0.85,
                anticipatePin: 1,
                refreshPriority: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => stage.style.setProperty("--project-progress", self.progress.toFixed(4)),
              },
            });

            const cards = Array.from(track.querySelectorAll<HTMLElement>(".project-card"));
            const projectProgress = (card: HTMLElement) => gsap.utils.clamp(
              0,
              1,
              (card.offsetLeft - (stage.clientWidth - card.offsetWidth) / 2) / Math.max(distance(), 1),
            );
            const showProject = (card: HTMLElement) => {
              const trigger = horizontal?.scrollTrigger;
              if (!trigger || !distance()) return;
              const progress = projectProgress(card);
              const top = trigger.start + progress * (trigger.end - trigger.start);
              window.dispatchEvent(new CustomEvent("portfolio:scroll-to", { detail: { top, immediate: true } }));
              trigger.update();
              trigger.getTween()?.progress(1);
              horizontal?.progress(progress);
            };
            const bringFocusedProjectIntoView = (event: FocusEvent) => {
              if (!(event.target instanceof HTMLElement) || !event.target.matches(":focus-visible")) return;
              const card = event.target.closest<HTMLElement>(".project-card");
              if (card) showProject(card);
            };
            const navigateProjects = (event: KeyboardEvent) => {
              if (event.target !== track || !cards.length) return;
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const progress = horizontal?.progress() ?? 0;
              const current = cards.reduce((nearest, card, index) => (
                Math.abs(projectProgress(card) - progress) < Math.abs(projectProgress(cards[nearest]) - progress)
                  ? index
                  : nearest
              ), 0);
              const next = event.key === "Home" ? 0
                : event.key === "End" ? cards.length - 1
                  : gsap.utils.clamp(0, cards.length - 1, current + (event.key === "ArrowRight" ? 1 : -1));
              showProject(cards[next]);
            };
            track.addEventListener("focusin", bringFocusedProjectIntoView);
            track.addEventListener("keydown", navigateProjects);
            cleanup.push(() => {
              track.removeEventListener("focusin", bringFocusedProjectIntoView);
              track.removeEventListener("keydown", navigateProjects);
            });
          }

          select(".project-card").forEach((card) => {
            const art = card.querySelector(".project-art-frame svg");
            const wipe = card.querySelector(".project-art-wipe");
            const initiallyVisible = stage ? card.offsetLeft < stage.clientWidth : true;
            const trigger = horizontal && !initiallyVisible
              ? { trigger: card, containerAnimation: horizontal, start: "left 94%", once: true }
              : { trigger: stage || card, start: "top 88%", once: true };
            if (wipe) {
              gsap.fromTo(wipe, { scaleY: 1 }, {
                scaleY: 0,
                duration: 1.1,
                ease: "power3.inOut",
                immediateRender: false,
                scrollTrigger: trigger,
              });
            }
            if (art) {
              gsap.fromTo(art, { scale: 1.065, opacity: 0.7 }, {
                scale: 1,
                opacity: 1,
                duration: 1.6,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: trigger,
              });
            }
          });

          refresh();
          return restore;
        },
        scope,
      );

      void document.fonts?.ready.then(() => { if (!disposed) refresh(); });
      window.addEventListener("load", refresh);
      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        window.removeEventListener("load", refresh);
        media.revert();
      };
    },
    { scope: root },
  );

  return <div className="site-root" ref={root}>{children}</div>;
}
