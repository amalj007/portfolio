"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const links = [
  ["About", "#about"],
  ["Expertise", "#skills"],
  ["Experience", "#experience"],
  ["Selected work", "#projects"],
  ["Contact", "#contact"],
] as const;

const resumeUrl =
  (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/assets/docs/Amal_Joy_Resume.pdf";

type MagneticLinkProps = {
  href: string;
  magnet?: number;
  className?: string;
  children?: ReactNode;
  target?: string;
  rel?: string;
  download?: string | boolean;
  "aria-label"?: string;
};

export function MagneticLink({
  href,
  magnet = 0.15,
  className,
  children,
  ...props
}: MagneticLinkProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.45 });

  function move(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * magnet);
    y.set((event.clientY - rect.top - rect.height / 2) * magnet);
  }

  function reset(event: ReactPointerEvent<HTMLAnchorElement>) {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={move}
      onPointerLeave={reset}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.985 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.querySelectorAll("#site-nav a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.querySelectorAll("#site-nav a").forEach((link) => {
        link.removeEventListener("click", closeMenu);
      });
    };
  }, []);

  return (
    <header className={"site-header" + (menuOpen ? " menu-open" : "")}>
      <a className="brand" href="#home" aria-label="Amal Joy, home">
        <span className="brand-mark" aria-hidden="true">
          <span>AJ</span>
          <i />
        </span>
        <span className="brand-name">
          <strong>AMAL JOY</strong>
          <small>ROBOTICS / AUTOMATION</small>
        </span>
      </a>

      <button
        className="nav-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-controls="site-nav"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <nav id="site-nav" className="site-nav glass-panel" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
        <MagneticLink
          className="nav-resume"
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Amal Joy's resume in a new tab"
        >
          Resume <span aria-hidden="true">↗</span>
        </MagneticLink>
      </nav>
    </header>
  );
}

export function ScrollProgress() {
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let trigger: { kill: () => void } | undefined;
    let cancelled = false;

    async function createProgress() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !progress.current) return;
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (progress.current) {
            gsap.set(progress.current, { scaleX: self.progress });
          }
        },
      });
    }

    void createProgress();
    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-fill" ref={progress} />
    </div>
  );
}

export function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cursor.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || !finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let clientX = -80;
    let clientY = -80;
    let active = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!element) return;
        element.style.transform =
          "translate3d(" + clientX + "px, " + clientY + "px, 0) translate(-50%, -50%)";
        element.classList.add("is-visible");
      });
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target;
      const nextActive =
        target instanceof Element &&
        Boolean(target.closest("a, button, [data-cursor='active']"));
      if (active !== nextActive) {
        active = nextActive;
        element.classList.toggle("is-active", active);
      }
    };
    const onLeave = () => element.classList.remove("is-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOver);
    window.addEventListener("blur", onLeave);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOver);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true" ref={cursor}>
      <span />
    </div>
  );
}
