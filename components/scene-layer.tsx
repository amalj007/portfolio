"use client";

import dynamic from "next/dynamic";

const WorldCanvas = dynamic(
  () => import("@/components/world-canvas").then((module) => module.WorldCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="scene-fallback" aria-hidden="true">
        <div className="fallback-orbit fallback-orbit-one" />
        <div className="fallback-orbit fallback-orbit-two" />
        <div className="fallback-core" />
      </div>
    ),
  },
);

export function SceneLayer() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <WorldCanvas />
    </div>
  );
}
