"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type ProjectCardProps = { id: string; systemNote: string; children: ReactNode };

export function ProjectCard({ id, systemNote, children }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mounted = useRef(false);
  const card = useRef<HTMLElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const pointerActive = useRef(false);
  const reduceMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const lift = useMotionValue(0);
  const springConfig = { stiffness: 180, damping: 24, mass: 0.7 };
  const rotateX = useSpring(tiltX, springConfig);
  const rotateY = useSpring(tiltY, springConfig);
  const y = useSpring(lift, springConfig);
  const detailId = "project-details-" + id;

  const resetPointer = useCallback(() => {
    pointerActive.current = false;
    bounds.current = null;
    tiltX.set(0);
    tiltY.set(0);
    lift.set(0);
    card.current?.style.setProperty("--glass-x", "50%");
    card.current?.style.setProperty("--glass-y", "50%");
    card.current?.style.setProperty("--glass-hover", "0");
  }, [lift, tiltX, tiltY]);

  function updatePointer(event: PointerEvent<HTMLElement>) {
    if (!pointerActive.current) return;
    if (
      reduceMotion ||
      event.pointerType === "touch" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      resetPointer();
      return;
    }

    const rect = (bounds.current ??=
      event.currentTarget.getBoundingClientRect());
    const localX = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    const localY = Math.min(
      1,
      Math.max(0, (event.clientY - rect.top) / rect.height),
    );
    tiltX.set((0.5 - localY) * 5);
    tiltY.set((localX - 0.5) * 5);
    lift.set(-5);
    event.currentTarget.style.setProperty("--glass-x", `${localX * 100}%`);
    event.currentTarget.style.setProperty("--glass-y", `${localY * 100}%`);
    event.currentTarget.style.setProperty("--glass-hover", "1");
  }

  function refreshLayout() {
    void import("gsap/ScrollTrigger")
      .then(({ ScrollTrigger }) => {
        if (mounted.current) ScrollTrigger.refresh();
      })
      .catch(() => {
        /* Expansion also works with native scrolling. */
      });
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const invalidateBounds = () => {
      bounds.current = null;
    };
    window.addEventListener("scroll", invalidateBounds, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", invalidateBounds, { passive: true });
    return () => {
      window.removeEventListener("scroll", invalidateBounds, true);
      window.removeEventListener("resize", invalidateBounds);
    };
  }, []);

  useEffect(() => {
    bounds.current = null;
  }, [expanded]);

  useEffect(() => {
    resetPointer();
    if (reduceMotion) {
      rotateX.jump(0);
      rotateY.jump(0);
      y.jump(0);
    }
  }, [reduceMotion, resetPointer, rotateX, rotateY, y]);

  return (
    <motion.article
      ref={card}
      className={"project-card glass-surface project-card-" + id}
      style={{
        transformPerspective: 1400,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        y: reduceMotion ? 0 : y,
      }}
      onPointerEnter={(event) => {
        pointerActive.current = true;
        bounds.current = null;
        updatePointer(event);
      }}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      onPointerCancel={resetPointer}
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
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
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
