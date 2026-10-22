"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ProjectCardProps = { id: string; systemNote: string; children: ReactNode };

export function ProjectCard({ id, systemNote, children }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mounted = useRef(false);
  const reduceMotion = useReducedMotion();
  const detailId = "project-details-" + id;

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

  return (
    <article className={"project-card project-card-" + id}>
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
    </article>
  );
}
