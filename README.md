# Amal Joy — Robotics & Automation Engineer

A single-page portfolio built around one continuous systems narrative: control engineering, field experience, marine automation, and selected aerospace and industrial projects.

## Stack

- Next.js 15 App Router with TypeScript and a static export
- React Three Fiber / Three.js for the interactive control and propulsion scene
- GSAP + ScrollTrigger for reveals, the pinned horizontal project archive, and scroll progress
- Lenis for smooth wheel scrolling, connected to ScrollTrigger
- Tailwind CSS plus a custom glass-and-cyan visual system
- Framer Motion for the magnetic resume and contact links

## Run locally

Use Node.js 22 and pnpm 11:

    pnpm install
    pnpm dev

To build the static files locally:

    pnpm build

## Publish

GitHub Pages deploys the static export through .github/workflows/deploy.yml. The repository Pages source must be set to GitHub Actions. The workflow builds with /portfolio as the base path and publishes the out/ directory.

For a host that serves the site from its domain root, leave NEXT_PUBLIC_BASE_PATH unset. A Vercel project can use the same Next.js static build; set NEXT_PUBLIC_SITE_URL to its public origin to generate the matching canonical and sitemap URLs.

## Accessibility and motion

The page keeps native anchors and keyboard navigation, provides a skip link and a mobile menu, respects prefers-reduced-motion, and uses a static scene fallback when WebGL is unavailable. The decorative Three.js canvas is capped at a 1.4 device-pixel ratio and does not load external image assets.
