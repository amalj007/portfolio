"use client";

import dynamic from "next/dynamic";
import { Component } from "react";
import type { ReactNode } from "react";

function GlassFallback() {
  return (
    <svg
      viewBox="0 0 600 700"
      fill="none"
      aria-hidden="true"
      style={{ position: "absolute", width: "min(72vw, 760px)", height: "80%", right: "max(-8vw, -50px)", top: "10%", opacity: 0.7 }}
    >
      <defs>
        <linearGradient id="glass-fallback-material" x1="150" y1="130" x2="460" y2="590" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e6f7ff" stopOpacity="0.85" />
          <stop offset="0.22" stopColor="#8eceee" stopOpacity="0.13" />
          <stop offset="0.52" stopColor="#9a9ede" stopOpacity="0.22" />
          <stop offset="0.73" stopColor="#c6edff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#649ec2" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="glass-fallback-edge" x1="150" y1="160" x2="450" y2="560" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.9" />
          <stop offset="0.34" stopColor="#c1e4ff" stopOpacity="0.06" />
          <stop offset="0.77" stopColor="#b6c9ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#c1e4ff" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <g transform="rotate(-20 300 350)">
        <path d="M300 139C405 125 451 231 451 355C451 467 393 559 290 561C188 563 148 461 154 347C160 234 204 152 300 139Z" stroke="url(#glass-fallback-material)" strokeWidth="78" />
        <path d="M300 100C431 84 490 220 490 355C490 486 419 598 289 600C162 602 108 479 115 345C122 214 180 117 300 100Z" stroke="url(#glass-fallback-edge)" strokeWidth="2" />
        <path d="M300 178C377 166 412 246 412 355C412 449 370 520 291 522C215 524 188 441 193 349C199 256 228 190 300 178Z" stroke="url(#glass-fallback-edge)" strokeWidth="2" />
      </g>
    </svg>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { unavailable: boolean }> {
  state = { unavailable: false };
  static getDerivedStateFromError() { return { unavailable: true }; }
  render() { return this.state.unavailable ? <GlassFallback /> : this.props.children; }
}

const WorldCanvas = dynamic(
  () => import("@/components/world-canvas").then((module) => module.WorldCanvas),
  {
    ssr: false,
    loading: GlassFallback,
  },
);

export function SceneLayer() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <SceneBoundary><WorldCanvas fallback={<GlassFallback />} /></SceneBoundary>
    </div>
  );
}
