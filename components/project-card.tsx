"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ProjectCardProps = {
  id: string;
  systemNote: string;
  children: ReactNode;
};

export function ProjectCard({ id, systemNote, children }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const card = useRef<HTMLElement>(null);
  const mounted = useRef(false);
  const reduceMotion = useReducedMotion();
  const detailId = "project-details-" + id;

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--spot-x", (x * 100).toFixed(1) + "%");
    event.currentTarget.style.setProperty("--spot-y", (y * 100).toFixed(1) + "%");
  }

  function resetLight() {
    card.current?.style.setProperty("--spot-x", "50%");
    card.current?.style.setProperty("--spot-y", "50%");
  }

  function refreshLayout() {
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (mounted.current) ScrollTrigger.refresh();
    });
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const element = card.current;
    if (!element) return;
    const updateOverflow = () => setScrollable(element.scrollHeight > element.clientHeight + 1);
    // Observe the contents too: an expanded note can grow inside a capped card.
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    updateOverflow();
    return () => observer.disconnect();
  }, [expanded]);

  return (
    <motion.article
      ref={card}
      className="project-card glass-card"
      data-reveal
      data-lenis-prevent-wheel={scrollable ? "" : undefined}
      style={{ "--spot-x": "50%", "--spot-y": "50%" } as React.CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetLight}
      onPointerCancel={resetLight}
      whileHover={reduceMotion ? undefined : { y: -7 }}
      transition={{ type: "spring", stiffness: 180, damping: 21 }}
    >
      {children}
      <button
        className="project-expand-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={detailId}
        onClick={() => setExpanded((open) => !open)}
      >
        <span>{expanded ? "CLOSE SYSTEM NOTES" : "EXPLORE SYSTEM"}</span>
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false} onExitComplete={refreshLayout}>
        {expanded && (
          <motion.div
            id={detailId}
            className="project-expanded"
            initial={reduceMotion ? false : { height: 0, opacity: 0, y: 8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 6 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={refreshLayout}
          >
            <span className="mono-label">SYSTEM VIEW / {id}</span>
            <p>{systemNote}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

