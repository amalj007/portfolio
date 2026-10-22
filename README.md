# Amal Joy — Robotics & Automation Engineer

A single-page portfolio for Amal Joy's marine, aerospace, and industrial automation work. The editorial design combines oversized typography, an ivory and charcoal palette, a lime contact section, and locally optimized engineering photography.

## Stack

- Next.js 15 App Router, React, and TypeScript with a static export
- GSAP + ScrollTrigger for text entrances, scroll-linked reading, and image parallax
- Lenis for smooth wheel scrolling with native touch and keyboard navigation
- Framer Motion for magnetic links and expandable project notes
- Tailwind CSS and custom responsive CSS

## Run locally

Use Node.js 22 and pnpm 11:

    pnpm install
    pnpm dev

Build the static files:

    pnpm build

## Publish

GitHub Pages deploys the static export through `.github/workflows/deploy.yml`. The workflow builds with `/portfolio` as the base path and publishes `out/`. Pull requests run the same build without changing the live website. Merging to `main` publishes the update.

For hosting at a domain root, leave `NEXT_PUBLIC_BASE_PATH` unset. Set `NEXT_PUBLIC_SITE_URL` to the public origin for matching canonical and sitemap URLs.

## Accessibility and motion

Content is present in the server HTML and remains readable if animation code is unavailable. The site includes native anchors, a skip link, a keyboard-accessible mobile menu, labeled contact fields, and expandable project notes. It respects `prefers-reduced-motion`, with no pinned scrolling or forced touch-scroll animation. Motion only updates during scrolling or interaction.

The contact form opens a draft in the visitor's email application. It does not submit messages to a server. Photography represents engineering contexts; it does not claim to depict Amal's installations. See `PHOTO_CREDITS.md` for sources and licensing.
