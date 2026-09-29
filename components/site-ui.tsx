"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
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
  const reducedMotion = useReducedMotion();
  const bounds = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.45 });

  function move(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch" || reducedMotion) return;
    const rect = bounds.current || event.currentTarget.getBoundingClientRect();
    bounds.current = rect;
    x.set((event.clientX - rect.left - rect.width / 2) * magnet);
    y.set((event.clientY - rect.top - rect.height / 2) * magnet);
  }

  function reset() {
    bounds.current = null;
    x.set(0);
    y.set(0);
  }

  useEffect(() => {
    const invalidateBounds = () => {
      bounds.current = null;
      x.set(0);
      y.set(0);
    };
    // Nested scroll regions can move a link without another pointer-enter event.
    window.addEventListener("scroll", invalidateBounds, { capture: true, passive: true });
    window.addEventListener("resize", invalidateBounds, { passive: true });
    return () => {
      window.removeEventListener("scroll", invalidateBounds, true);
      window.removeEventListener("resize", invalidateBounds);
    };
  }, [x, y]);

  useEffect(() => {
    if (reducedMotion) {
      bounds.current = null;
      x.set(0);
      y.set(0);
    }
  }, [reducedMotion, x, y]);

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: reducedMotion ? 0 : springX, y: reducedMotion ? 0 : springY }}
      onPointerEnter={(event) => {
        if (!reducedMotion && event.pointerType !== "touch") {
          bounds.current = event.currentTarget.getBoundingClientRect();
        }
      }}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
      whileHover={reducedMotion ? undefined : { scale: 1.025 }}
      whileTap={reducedMotion ? undefined : { scale: 0.975 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 959px)");
    const updateViewport = () => {
      if (mobile.matches && header.current?.querySelector("nav")?.contains(document.activeElement)) {
        toggle.current?.focus({ preventScroll: true });
      }
      setIsMobile(mobile.matches);
      setMenuOpen(false);
    };
    updateViewport();
    mobile.addEventListener("change", updateViewport);
    return () => mobile.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    const closeOutside = (event: Event) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const sections = ["#home", ...links.map(([, href]) => href)]
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.18, 0.35, 0.55] },
    );
    sections.forEach((section) => observer.observe(section));

    let frame = 0;
    const updateScrolled = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 20);
      });
    };
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrolled);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const surfaces = [
      ".site-header", ".glass-card", ".skill-card", ".stack-card",
      ".project-card", ".message-form", ".message-field", ".timeline-item",
      ".button", ".nav-resume", ".certification-row", ".field-note", ".brand-mark",
      ".education-card", ".contact-panel", "[data-glass-reflection]",
    ].join(",");
    let frame = 0;
    let previous: HTMLElement | null = null;
    let pending: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const reset = (element: HTMLElement) => {
      element.style.setProperty("--glass-x", "82%");
      element.style.setProperty("--glass-y", "0%");
    };
    const update = () => {
      frame = 0;
      // Read only the latest surface once per frame, before writing any styles.
      const surface = pending;
      const bounds = surface?.getBoundingClientRect();
      if (previous && previous !== surface) reset(previous);
      previous = surface;
      if (!surface || !bounds || !bounds.width || !bounds.height) return;
      const x = Math.max(0, Math.min(100, ((pointerX - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((pointerY - bounds.top) / bounds.height) * 100));
      surface.style.setProperty("--glass-x", x.toFixed(1) + "%");
      surface.style.setProperty("--glass-y", y.toFixed(1) + "%");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target;
      pending = target instanceof Element ? target.closest<HTMLElement>(surfaces) : null;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onPointerLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (previous) reset(previous);
      previous = null;
      pending = null;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    return () => {
      onPointerLeave();
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, [reducedMotion]);

  return (
    <header
      ref={header}
      className={"site-header" + (menuOpen ? " menu-open" : "") + (scrolled ? " is-scrolled" : "")}
    >
      <a className="brand" href="#home" aria-label="Amal Joy, home" onClick={() => setMenuOpen(false)}>
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
        ref={toggle}
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

      <nav
        id="site-nav"
        className="site-nav"
        aria-label="Main navigation"
        aria-hidden={isMobile && !menuOpen ? true : undefined}
        inert={isMobile && !menuOpen}
        onClick={(event) => {
          const anchor = event.target instanceof Element ? event.target.closest("a") : null;
          if (!anchor) return;
          if (isMobile && menuOpen) {
            const href = anchor.getAttribute("href");
            const destination = href?.startsWith("#") ? document.getElementById(href.slice(1)) : null;
            const focusTarget = destination?.querySelector<HTMLElement>("h1, h2") || destination;
            if (focusTarget) {
              if (!focusTarget.hasAttribute("tabindex")) {
                focusTarget.setAttribute("tabindex", "-1");
                focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
              }
              focusTarget.focus({ preventScroll: true });
            } else {
              toggle.current?.focus({ preventScroll: true });
            }
          }
          setMenuOpen(false);
        }}
      >
        {links.map(([label, href]) => (
          <a href={href} key={href} aria-current={activeSection === href.slice(1) ? "location" : undefined}>
            {activeSection === href.slice(1) && (
              <motion.span
                className="nav-active-surface"
                layoutId={reducedMotion ? undefined : "navigation-glass"}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                aria-hidden="true"
              />
            )}
            <span className="nav-label">{label}</span>
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
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = cursor.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!element || !finePointer.matches || reducedMotion) return;

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
    const onLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      active = false;
      element.classList.remove("is-visible", "is-active");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      onLeave();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [reducedMotion]);

  return (
    <div className="custom-cursor" aria-hidden="true" ref={cursor}>
      <span />
    </div>
  );
}
