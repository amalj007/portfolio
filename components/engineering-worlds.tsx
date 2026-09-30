"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Point = [number, number, number];

const asset = (name: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/images/${name}`;

function PhotoSurface({ name, size, at, crop = 1, offset = 0 }: { name: string; size: [number, number]; at: Point; crop?: number; offset?: number }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let active = true;
    const loaded = new THREE.TextureLoader().load(asset(name), (image) => {
      if (!active) return;
      image.colorSpace = THREE.SRGBColorSpace;
      image.wrapS = THREE.ClampToEdgeWrapping;
      image.repeat.x = crop;
      image.offset.x = offset;
      image.anisotropy = 4;
      image.needsUpdate = true;
      setTexture(image);
    });
    return () => { active = false; loaded.dispose(); };
  }, [name, crop, offset]);
  if (!texture) return null;
  return <mesh position={at} receiveShadow>
    <planeGeometry args={size} />
    <meshBasicMaterial map={texture} toneMapped={false} />
  </mesh>;
}

function Box({ size, at = [0, 0, 0], color, metalness = 0.15, roughness = 0.45, glow }: {
  size: Point;
  at?: Point;
  color: string;
  metalness?: number;
  roughness?: number;
  glow?: string;
}) {
  return <mesh position={at} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} emissive={glow || "#000000"} emissiveIntensity={glow ? 0.7 : 0} />
  </mesh>;
}

function Cable({ points, color, radius = 0.018 }: { points: Point[]; color: string; radius?: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), [points]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 16, radius, 5, false), [curve, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry}>
    <meshStandardMaterial color={color} roughness={0.55} metalness={0.12} />
  </mesh>;
}

function PlcModule({ index, at }: { index: number; at: Point }) {
  const colors = ["#9daab9", "#748da7", "#8f9cac", "#5f7891"];
  return <group position={at}>
    <Box size={[0.48, 0.77, 0.23]} color={colors[index % colors.length]} metalness={0.3} />
    <Box size={[0.44, 0.12, 0.012]} at={[0, 0.27, 0.121]} color="#d7e2e7" />
    <Box size={[0.43, 0.22, 0.02]} at={[0, -0.04, 0.125]} color="#566b82" />
    {[0, 1, 2, 3, 4].map((dot) => <mesh key={dot} position={[-0.16 + dot * 0.08, -0.29, 0.132]}>
      <sphereGeometry args={[0.012, 8, 8]} />
      <meshBasicMaterial color={(index + dot) % 4 === 0 ? "#81eaf8" : "#344c56"} />
    </mesh>)}
    {[0, 1, 2, 3].map((slot) => <Box key={slot} size={[0.34, 0.015, 0.013]} at={[0, -0.11 + slot * 0.037, 0.14]} color="#24394f" />)}
  </group>;
}

/** A cutaway automation enclosure based on real cabinet construction. */
export function ControlCabinet({ compact, reducedMotion }: { compact: boolean; reducedMotion: boolean }) {
  const status = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (status.current && !reducedMotion) status.current.color.setHSL(0.52, 0.85, 0.5 + Math.sin(clock.elapsedTime * 1.2) * 0.09);
  });
  return <group rotation={[0.04, -0.22, -0.025]}>
    <Box size={[5.65, 4.02, 0.26]} at={[0, 0, -0.3]} color="#78818b" metalness={0.73} roughness={0.38} />
    <Box size={[5.47, 3.84, 0.025]} at={[0, 0, -0.155]} color="#c1c8cb" metalness={0.36} roughness={0.62} />
    <PhotoSurface name="control-cabinet.webp" size={[5.46, 3.83]} at={[0, 0, -0.125]} crop={0.53} offset={0.38} />
    <Box size={[0.18, 4.04, 0.7]} at={[-2.83, 0, 0.02]} color="#65717d" metalness={0.65} />
    <Box size={[0.18, 4.04, 0.7]} at={[2.83, 0, 0.02]} color="#65717d" metalness={0.65} />
    <Box size={[5.63, 0.18, 0.7]} at={[0, 2.03, 0.02]} color="#7c8791" metalness={0.65} />
    <Box size={[5.63, 0.18, 0.7]} at={[0, -2.03, 0.02]} color="#65717d" metalness={0.65} />
    {[-1.39, -0.35, 0.73, 1.56].map((y) => <Box key={y} size={[5.2, 0.095, 0.12]} at={[0, y, 0.015]} color="#9aa9b4" metalness={0.82} roughness={0.27} />)}
    {[-2.5, 0.88, 2.5].map((x) => <group key={x} position={[x, 0, 0.075]}>
      <Box size={[0.18, 3.68, 0.21]} color="#4b5863" metalness={0.37} />
      {Array.from({ length: 17 }, (_, index) => <Box key={index} size={[0.11, 0.055, 0.01]} at={[0, -1.67 + index * 0.205, 0.111]} color="#182733" />)}
    </group>)}
    {Array.from({ length: compact ? 5 : 7 }, (_, index) => <PlcModule key={index} index={index} at={[-1.98 + index * 0.53, -0.86, 0.2]} />)}
    {Array.from({ length: compact ? 5 : 7 }, (_, index) => <group key={index} position={[-1.95 + index * 0.56, 1.12, 0.19]}>
      <Box size={[0.43, 0.66, 0.28]} color={index % 3 ? "#8b979f" : "#556777"} metalness={0.52} />
      <Box size={[0.34, 0.19, 0.02]} at={[0, 0.19, 0.15]} color="#d3dde1" />
      <Box size={[0.18, 0.21, 0.07]} at={[0, -0.07, 0.19]} color="#263e4c" />
      <Box size={[0.05, 0.09, 0.025]} at={[0, -0.05, 0.238]} color="#b9c6ca" />
    </group>)}
    <group position={[1.76, 0.02, 0.27]}>
      <Box size={[1.05, 1.85, 0.51]} color="#202b36" metalness={0.64} roughness={0.39} />
      <Box size={[0.79, 0.56, 0.022]} at={[0, 0.42, 0.27]} color="#101d2e" roughness={0.2} />
      <Box size={[0.61, 0.08, 0.025]} at={[0, 0.5, 0.289]} color="#70c8e9" glow="#168cb4" />
      {[0, 1, 2].map((key) => <Box key={key} size={[0.11, 0.11, 0.03]} at={[-0.24 + key * 0.24, 0.07, 0.28]} color={key === 2 ? "#73c5a8" : "#718aa0"} />)}
      {Array.from({ length: 8 }, (_, index) => <Box key={index} size={[0.64, 0.024, 0.015]} at={[0, -0.23 - index * 0.07, 0.272]} color="#090f19" />)}
      <mesh position={[-0.33, 0.65, 0.273]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial ref={status} color="#80eaff" />
      </mesh>
    </group>
    {Array.from({ length: compact ? 7 : 13 }, (_, index) => {
      const x = -2.05 + index * 0.33;
      const bend = index % 2 ? 0.12 : -0.12;
      return <Cable key={index} points={[[x, 0.65, 0.19], [x + bend, 0.28, 0.32], [x + bend, -0.12, 0.3], [x, -0.42, 0.23]]} color={index % 4 === 0 ? "#49a8d5" : index % 7 === 0 ? "#d6bb64" : "#2c414e"} radius={0.014} />;
    })}
    <Box size={[5.6, 0.035, 0.04]} at={[0, -1.82, 0.2]} color="#83dff2" glow="#24586b" />
  </group>;
}

function BridgeScreen({ at, size = [1.08, 0.62, 0.06], index = 0 }: { at: Point; size?: Point; index?: number }) {
  return <group position={at} rotation={[-0.16, 0, 0]}>
    <Box size={size} color="#8799a8" metalness={0.72} roughness={0.26} />
    <Box size={[size[0] - 0.07, size[1] - 0.08, 0.015]} at={[0, 0, size[2] / 2 + 0.012]} color="#071a29" glow="#082436" />
    {[0, 1, 2].map((line) => <Box key={line} size={[size[0] * 0.64, 0.012, 0.016]} at={[0, 0.12 - line * 0.13, size[2] / 2 + 0.03]} color={line === index % 3 ? "#73dff4" : "#315e79"} />)}
    <mesh position={[size[0] * 0.3, 0.16, size[2] / 2 + 0.035]}>
      <ringGeometry args={[0.07, 0.081, 24]} />
      <meshBasicMaterial color="#70d6ef" side={THREE.DoubleSide} />
    </mesh>
  </group>;
}

/** A bridge interior: windows, night sea, consoles and operator seats. */
export function ShipBridge({ compact }: { compact: boolean; reducedMotion: boolean }) {
  return <group rotation={[0.06, -0.13, 0]}>
    <Box size={[6.75, 0.22, 3.2]} at={[0, -2.05, -0.06]} color="#24313d" metalness={0.32} />
    <Box size={[6.7, 0.26, 2.7]} at={[0, 2.16, -0.24]} color="#344657" metalness={0.55} />
    <Box size={[6.7, 3.65, 0.16]} at={[0, 0.05, -1.31]} color="#3c5363" metalness={0.46} />
    <PhotoSurface name="ship-bridge.webp" size={[6.57, 3.58]} at={[0, 0.05, -1.21]} crop={0.66} offset={0.19} />
    {[-3.2, -1.12, 1.12, 3.2].map((x) => <Box key={x} size={[0.13, 2.63, 0.22]} at={[x, 0.65, -1.04]} color="#7b929d" metalness={0.83} roughness={0.22} />)}
    <Box size={[6.5, 0.16, 0.28]} at={[0, 1.98, -1.04]} color="#8ba2aa" metalness={0.76} />
    <Box size={[6.5, 0.19, 0.34]} at={[0, -0.62, -1.02]} color="#82969e" metalness={0.76} />
    <Box size={[5.8, 0.8, 1.12]} at={[0, -0.98, -0.17]} color="#526779" metalness={0.68} roughness={0.31} />
    <Box size={[5.71, 0.035, 1.05]} at={[0, -0.55, -0.02]} color="#a1b1bb" metalness={0.79} roughness={0.18} />
    <Box size={[5.92, 0.04, 0.08]} at={[0, -0.25, 0.47]} color="#83e1f7" glow="#1a5f7b" />
    {[-1.95, -0.66, 0.66, 1.95].map((x, index) => <BridgeScreen key={x} at={[x, -0.75, 0.49]} index={index} />)}
    {!compact && <>
      {[-1.8, 1.8].map((x) => <group key={x} position={[x, -1.45, 1.14]}>
        <Box size={[0.09, 0.8, 0.08]} at={[0, -0.18, 0]} color="#8ba1b1" metalness={0.8} />
        <Box size={[0.64, 0.75, 0.18]} at={[0, 0.32, 0.08]} color="#1b2a39" roughness={0.62} />
        <Box size={[0.76, 0.16, 0.55]} at={[0, -0.11, 0.23]} color="#213448" roughness={0.59} />
      </group>)}
      <group position={[0, -1.55, 1.16]} rotation={[-0.23, 0, 0]}>
        <Box size={[2.35, 1.15, 0.38]} color="#667b8b" metalness={0.71} roughness={0.27} />
        <BridgeScreen at={[0, 0.06, 0.22]} size={[1.95, 0.82, 0.055]} index={2} />
        <Box size={[2.17, 0.025, 0.04]} at={[0, -0.5, 0.23]} color="#7ad7f0" glow="#245b73" />
      </group>
    </>}
    {[-2.7, 2.7].map((x) => <Box key={x} size={[0.16, 0.045, 2.0]} at={[x, 1.99, 0.04]} color="#8be5fa" glow="#236075" />)}
  </group>;
}

