"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const CHAPTERS = ["home", "about", "skills", "experience", "projects", "stack", "certifications", "contact"];
const ICE = "#d9eaff";
const CYAN = "#79e5ff";
const TITANIUM = "#8c9eb5";

/** Bevels catch the studio light, so the machinery reads as machined metal. */
function Block({
  size,
  position = [0, 0, 0],
  radius = 0.06,
  children,
}: {
  size: [number, number, number];
  position?: [number, number, number];
  radius?: number;
  children: ReactNode;
}) {
  const [width, height, depth] = size;
  const geometry = useMemo(
    () => new RoundedBoxGeometry(width, height, depth, 2, Math.min(radius, depth / 2, height / 2, width / 2)),
    [width, height, depth, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh position={position} geometry={geometry}>{children}</mesh>;
}

/** An asset-free photographic light rig baked once into an environment map. */
function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const previous = scene.environment;
    const room = new RoomEnvironment();
    // A dark photographic studio gives glass a transparent body and crisp
    // reflected edges. The stock white room otherwise reads as frosted plastic.
    room.traverse((object) => {
      if (object instanceof THREE.Light) object.intensity *= 0.07;
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if (material instanceof THREE.MeshStandardMaterial) material.color.set("#101722");
        if (material instanceof THREE.MeshLambertMaterial) material.emissiveIntensity *= 0.13;
      }
    });
    const lights = [
      { position: [-4, 3, 4], size: [0.6, 8], color: new THREE.Color(5.0, 5.5, 6.0) },
      { position: [5, 1, 2], size: [0.8, 7], color: new THREE.Color(1.2, 2.0, 4.5) },
      { position: [0, 5, -3], size: [7, 0.5], color: new THREE.Color(5.0, 5.0, 5.0) },
    ];
    for (const light of lights) {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(light.size[0], light.size[1]),
        new THREE.MeshBasicMaterial({ color: light.color, side: THREE.DoubleSide, toneMapped: false }),
      );
      panel.position.set(light.position[0], light.position[1], light.position[2]);
      panel.lookAt(0, 0, 0);
      room.add(panel);
    }
    const generator = new THREE.PMREMGenerator(gl);
    let environment: THREE.WebGLRenderTarget;
    try {
      environment = generator.fromScene(room, 0.025, 0.1, 100);
    } finally {
      room.dispose();
      generator.dispose();
    }
    scene.environment = environment.texture;
    invalidate();
    return () => {
      scene.environment = previous;
      environment.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}

/** A continuous, asymmetric glass lens, with its own original silhouette. */
function makeLiquidLens(compact: boolean) {
  const rings = compact ? 88 : 144;
  const sides = compact ? 20 : 32;
  const positions: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];
  for (let ring = 0; ring < rings; ring++) {
    const u = (ring / rings) * Math.PI * 2;
    const radius = 1.56 + Math.sin(u - 0.45) * 0.13 + Math.cos(u * 2 + 0.2) * 0.07;
    const thickness = 0.43 + Math.sin(u + 0.7) * 0.115;
    for (let side = 0; side < sides; side++) {
      const v = (side / sides) * Math.PI * 2;
      const localRadius = radius + Math.cos(v) * thickness;
      positions.push(
        Math.cos(u) * localRadius * 0.88,
        Math.sin(u) * localRadius * 1.13,
        Math.sin(v) * thickness * 0.92 + Math.sin(u * 2 - 0.3) * 0.2,
      );
      uvs.push(ring / rings, side / sides);
      // Shared seam vertices keep the optical surface smooth all the way around.
      const a = ring * sides + side;
      const b = ((ring + 1) % rings) * sides + side;
      const c = ring * sides + (side + 1) % sides;
      const d = ((ring + 1) % rings) * sides + (side + 1) % sides;
      indices.push(a, b, c, b, d, c);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function LiquidLens({ compact }: { compact: boolean }) {
  const geometry = useMemo(() => makeLiquidLens(compact), [compact]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group rotation={[0.16, -0.22, -0.29]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#f5faff"
          metalness={0}
          roughness={0.035}
          transmission={1}
          thickness={0.78}
          ior={1.36}
          attenuationColor="#9cb5dc"
          attenuationDistance={6}
          clearcoat={0.35}
          clearcoatRoughness={0.025}
          iridescence={0.12}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[100, 340]}
          envMapIntensity={1.8}
        />
      </mesh>
      <mesh position={[1.41, 1.48, -0.4]} scale={[0.18, 0.27, 0.18]} rotation={[0.1, 0, -0.42]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshPhysicalMaterial color="#f5faff" transmission={1} roughness={0.03} thickness={0.38} ior={1.36} clearcoat={0.35} envMapIntensity={1.15} />
      </mesh>
      <mesh position={[-1.45, -1.8, 0.1]} scale={[0.11, 0.15, 0.11]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshPhysicalMaterial color="#a4a4ff" metalness={0.25} roughness={0.09} clearcoat={1} envMapIntensity={2.2} />
      </mesh>
    </group>
  );
}

/** Opaque, low-contrast contours give the lens actual scene detail to refract. */
function OpticalBackdrop() {
  return (
    <group position={[0, 0, -2.8]} rotation={[0, 0.12, -0.08]}>
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[80, 60]} />
        <shaderMaterial
          depthWrite={false}
          vertexShader={`varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`varying vec2 vUv;
            void main() {
              vec2 uv = (vUv - 0.5) * vec2(80.0 / 13.0, 60.0 / 12.0) + 0.5;
              float halo = exp(-length((uv - vec2(0.56, 0.54)) * vec2(4.4, 3.8)) * 2.4);
              float violet = exp(-length((uv - vec2(0.36, 0.31)) * 5.0) * 3.0);
              vec3 base = vec3(0.00152, 0.00243, 0.00439);
              gl_FragColor = vec4(base + vec3(0.012, 0.048, 0.085) * halo + vec3(0.021, 0.013, 0.056) * violet, 1.0);
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }`}
        />
      </mesh>
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((offset) => (
        <group key={offset}>
          <mesh position={[offset, 0, 0]}>
            <boxGeometry args={[0.009, 4.5 - Math.abs(offset) * 0.45, 0.009]} />
            <meshBasicMaterial color="#17232e" />
          </mesh>
          <mesh position={[0, offset, 0]}>
            <boxGeometry args={[4.5 - Math.abs(offset) * 0.45, 0.009, 0.009]} />
            <meshBasicMaterial color="#14212e" />
          </mesh>
        </group>
      ))}
      <mesh position={[0.9, -0.4, 0.01]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.018, 3.25, 0.012]} />
        <meshBasicMaterial color="#43697a" />
      </mesh>
    </group>
  );
}

function ControlCore() {
  return (
    <group rotation={[0.12, -0.22, 0.025]}>
      <Block size={[2.14, 1.8, 0.59]} radius={0.15}>
        <meshStandardMaterial color="#5c6c83" metalness={0.94} roughness={0.26} envMapIntensity={1.4} />
      </Block>
      <Block size={[2.02, 1.67, 0.1]} position={[0, 0, 0.31]} radius={0.1}>
        <meshPhysicalMaterial color="#c1d8eb" metalness={0.65} roughness={0.18} clearcoat={1} />
      </Block>
      <Block size={[1.88, 1.53, 0.07]} position={[0, 0, 0.365]} radius={0.1}>
        <meshPhysicalMaterial color="#101f34" roughness={0.22} metalness={0.35} clearcoat={1} />
      </Block>
      <Block size={[1.47, 0.66, 0.03]} position={[0, 0.3, 0.42]} radius={0.045}>
        <meshStandardMaterial color="#061828" emissive="#1a4267" emissiveIntensity={0.7} roughness={0.25} />
      </Block>
      {[0.23, 0.38, 0.19, 0.3, 0.47, 0.34, 0.43, 0.28].map((height, index) => (
        <mesh key={index} position={[-0.56 + index * 0.16, 0.08 + height / 2, 0.446]}>
          <boxGeometry args={[0.055, height, 0.008]} />
          <meshBasicMaterial color={index < 5 ? CYAN : "#b2a5ff"} />
        </mesh>
      ))}
      {[-0.56, 0, 0.56].map((x, index) => (
        <group key={x} position={[x, -0.37, 0.44]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.065, 24]} />
            <meshStandardMaterial color={index === 1 ? "#7597b4" : "#bacbdd"} metalness={0.9} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0, 0.041]} rotation={[0, 0, index * -0.6]}>
            <boxGeometry args={[0.018, 0.09, 0.012]} />
            <meshBasicMaterial color={CYAN} />
          </mesh>
        </group>
      ))}
      {[-0.75, 0.75].flatMap((x) => [-0.61, 0.61].map((y) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.413]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
          <meshStandardMaterial color={TITANIUM} metalness={1} roughness={0.25} />
        </mesh>
      )))}
      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
        <mesh key={index} position={[1.082, -0.53 + index * 0.17, 0]}>
          <boxGeometry args={[0.015, 0.045, 0.29]} />
          <meshStandardMaterial color="#19283c" metalness={0.65} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[-0.56, -0.63, 0.415]}>
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshBasicMaterial color={CYAN} />
      </mesh>
    </group>
  );
}

function MarineEngine({ reducedMotion }: { reducedMotion: boolean }) {
  const wheel = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (wheel.current && !reducedMotion) wheel.current.rotation.z += Math.min(delta, 0.05) * 0.2;
  });
  return (
    <group rotation={[0.12, -0.35, 0]}>
      <Block size={[4.25, 1.14, 1.18]} radius={0.16}>
        <meshStandardMaterial color="#677c96" metalness={0.91} roughness={0.29} />
      </Block>
      <Block size={[3.89, 0.77, 0.055]} position={[0, 0, 0.604]} radius={0.02}>
        <meshPhysicalMaterial color="#25465f" metalness={0.65} roughness={0.2} clearcoat={1} />
      </Block>
      {[-1.47, -0.49, 0.49, 1.47].map((x) => (
        <group key={x} position={[x, 0.63, 0]}>
          <mesh>
            <cylinderGeometry args={[0.32, 0.36, 0.9, 28]} />
            <meshStandardMaterial color="#9eaebe" metalness={0.93} roughness={0.24} />
          </mesh>
          {[0.1, 0.2, 0.3].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.035, 28]} />
              <meshStandardMaterial color="#3c526b" metalness={0.86} roughness={0.29} />
            </mesh>
          ))}
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[0.37, 0.37, 0.12, 28]} />
            <meshStandardMaterial color="#7daecb" metalness={0.9} roughness={0.19} />
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <cylinderGeometry args={[0.17, 0.19, 0.04, 24]} />
            <meshStandardMaterial color="#b9c9d9" metalness={0.95} roughness={0.16} />
          </mesh>
          <mesh position={[0, -0.63, 0.66]}>
            <boxGeometry args={[0.032, 0.42, 0.025]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.32} />
          </mesh>
          <mesh position={[0, -0.95, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.082, 0.082, 0.09, 16]} />
            <meshStandardMaterial color={ICE} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.01, -0.37]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 3.58, 24]} />
        <meshStandardMaterial color="#adbacb" metalness={0.98} roughness={0.16} />
      </mesh>
      <mesh position={[0, -0.68, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.105, 0.105, 4.62, 24]} />
        <meshStandardMaterial color="#d9e5f1" metalness={0.98} roughness={0.18} />
      </mesh>
      <group position={[2.22, -0.62, 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <group ref={wheel}>
          <mesh>
            <torusGeometry args={[0.66, 0.115, 16, 64]} />
            <meshStandardMaterial color="#acc8e6" metalness={0.96} roughness={0.16} />
          </mesh>
          {[0, Math.PI / 3, Math.PI * 2 / 3].map((angle) => (
            <mesh key={angle} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.06, 1.23, 0.07]} />
              <meshStandardMaterial color="#75869c" metalness={0.94} roughness={0.2} />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.34, 24]} />
            <meshStandardMaterial color="#7dbfe2" metalness={0.89} roughness={0.18} />
          </mesh>
        </group>
      </group>
      <Block size={[4.61, 0.14, 1.5]} position={[0, -0.83, 0]} radius={0.05}>
        <meshStandardMaterial color="#3a4e68" metalness={0.87} roughness={0.28} />
      </Block>
    </group>
  );
}

function AutomationArtifacts({ compact, reducedMotion }: { compact: boolean; reducedMotion: boolean }) {
  const gear = useRef<THREE.Group>(null);
  const robot = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    if (gear.current) gear.current.rotation.z += Math.min(delta, 0.05) * 0.055;
    if (robot.current) robot.current.rotation.y = Math.sin(clock.elapsedTime * 0.17) * 0.12;
  });
  return (
    <group>
      <group position={[2.27, 1.43, -0.35]} scale={compact ? 0.26 : 0.37} rotation={[0.25, 0.35, 0.1]}>
        <group ref={gear}>
          <mesh>
            <torusGeometry args={[0.72, 0.21, 12, 48]} />
            <meshStandardMaterial color="#a3b4c9" metalness={0.97} roughness={0.22} />
          </mesh>
          {Array.from({ length: 12 }, (_, index) => index * Math.PI / 6).map((angle) => (
            <mesh key={angle} position={[Math.cos(angle) * 0.93, Math.sin(angle) * 0.93, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.27, 0.22, 0.2]} />
              <meshStandardMaterial color="#a9c2dc" metalness={0.95} roughness={0.22} />
            </mesh>
          ))}
        </group>
      </group>
      <group ref={robot} position={[-2.1, 1.27, -0.4]} scale={compact ? 0.3 : 0.42}>
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.53, 0.6, 0.23, 24]} />
          <meshStandardMaterial color="#6c809b" metalness={0.9} roughness={0.23} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <sphereGeometry args={[0.23, 20, 20]} />
          <meshStandardMaterial color={CYAN} metalness={0.8} roughness={0.2} />
        </mesh>
        <group position={[0, -0.21, 0]} rotation={[0, 0, -0.42]}>
          <Block size={[0.25, 0.99, 0.29]} position={[0, 0.45, 0]}>
            <meshStandardMaterial color="#afbed0" metalness={0.9} roughness={0.25} />
          </Block>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.21, 20, 20]} />
            <meshStandardMaterial color="#5f9abb" metalness={0.86} roughness={0.18} />
          </mesh>
          <group position={[0, 0.91, 0]} rotation={[0, 0, 0.88]}>
            <Block size={[0.19, 0.76, 0.22]} position={[0, 0.35, 0]}>
              <meshStandardMaterial color="#c1cadb" metalness={0.91} roughness={0.2} />
            </Block>
            <mesh position={[0, 0.75, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color={CYAN} metalness={0.74} roughness={0.19} />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.09, 0.94, 0]} rotation={[0, 0, side * -0.24]}>
                <boxGeometry args={[0.055, 0.23, 0.11]} />
                <meshStandardMaterial color={ICE} metalness={0.95} roughness={0.16} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
      {!compact && <>
        <group position={[-2.06, -1.62, 0.1]} scale={0.41} rotation={[0.1, 0.15, 0.13]}>
          <Block size={[1.05, 1.5, 0.44]} radius={0.08}>
            <meshStandardMaterial color="#8a9db4" metalness={0.9} roughness={0.27} />
          </Block>
          <Block size={[0.86, 1.23, 0.045]} position={[0, 0, 0.24]} radius={0.02}>
            <meshPhysicalMaterial color="#243d56" metalness={0.6} roughness={0.2} clearcoat={1} />
          </Block>
          {[0, 1, 2, 3].map((index) => (
            <mesh key={index} position={[-0.25 + index * 0.17, 0.35, 0.278]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshBasicMaterial color={index < 3 ? CYAN : "#bcacff"} />
            </mesh>
          ))}
          {[-0.3, -0.1, 0.1, 0.3].map((x) => (
            <mesh key={x} position={[x, -0.34, 0.28]}>
              <boxGeometry args={[0.07, 0.26, 0.025]} />
              <meshStandardMaterial color="#b9c8df" metalness={0.86} roughness={0.24} />
            </mesh>
          ))}
        </group>
        <group position={[2.1, -1.48, -0.4]} scale={0.4} rotation={[0.15, -0.25, -0.11]}>
          <Block size={[1.73, 1.05, 0.13]} radius={0.04}>
            <meshPhysicalMaterial color="#304760" metalness={0.69} roughness={0.25} clearcoat={1} />
          </Block>
          {[-0.32, 0, 0.32].map((y, index) => (
            <group key={y}>
              <mesh position={[0, y, 0.09]}>
                <boxGeometry args={[1.29, 0.017, 0.015]} />
                <meshBasicMaterial color={index === 1 ? "#a3a0ff" : CYAN} />
              </mesh>
              <Block size={[0.24, 0.18, 0.03]} position={[index % 2 ? -0.22 : 0.3, y, 0.11]} radius={0.01}>
                <meshStandardMaterial color="#b3c6db" metalness={0.86} roughness={0.18} />
              </Block>
            </group>
          ))}
        </group>
      </>}
    </group>
  );
}

function SceneDirector({ compact, reducedMotion }: { compact: boolean; reducedMotion: boolean }) {
  const world = useRef<THREE.Group>(null);
  const lens = useRef<THREE.Group>(null);
  const controls = useRef<THREE.Group>(null);
  const marine = useRef<THREE.Group>(null);
  const artifacts = useRef<THREE.Group>(null);
  const stage = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    if (reducedMotion) {
      stage.current = 0;
      pointer.current = { x: 0, y: 0 };
      invalidate();
      return;
    }
    let offsets: number[] = [];
    let measureFrame = 0;
    const onScroll = () => {
      const scroll = window.scrollY;
      let chapter = 0;
      for (let index = 0; index < offsets.length - 1; index++) {
        if (scroll >= offsets[index]) chapter = index;
      }
      const start = offsets[chapter] ?? 0;
      const end = offsets[chapter + 1] ?? start + window.innerHeight;
      stage.current = chapter + THREE.MathUtils.clamp((scroll - start) / Math.max(1, end - start), 0, 1);
    };
    const measure = () => {
      offsets = CHAPTERS.map((id) => {
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
      });
      onScroll();
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(measure);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion) return;
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.y = event.clientY / window.innerHeight * 2 - 1;
    };
    const resetPointer = () => { pointer.current = { x: 0, y: 0 }; };
    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(measureFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", resetPointer);
    };
  }, [reducedMotion, invalidate]);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const time = reducedMotion ? 0 : clock.elapsedTime;
    const scroll = reducedMotion ? 0 : stage.current;
    const marinePhase = THREE.MathUtils.smoothstep(scroll, 0.65, 1.65);
    const systemsPhase = THREE.MathUtils.smoothstep(scroll, 2.05, 3.25);
    const closingPhase = THREE.MathUtils.smoothstep(scroll, 6.1, 7);
    const lerp = THREE.MathUtils.lerp;
    const damp = (current: number, target: number) => reducedMotion ? target : THREE.MathUtils.damp(current, target, 3.1, delta);
    const aspect = size.width / size.height;
    const visibleWidth = 2 * Math.tan(THREE.MathUtils.degToRad(36 / 2)) * 10.5 * aspect;

    if (world.current) {
      const heroX = compact ? visibleWidth * 0.15 : visibleWidth * 0.235;
      const chapterX = compact ? 0.35 : visibleWidth * lerp(0.23, 0.18, systemsPhase);
      world.current.position.x = damp(world.current.position.x, lerp(heroX, chapterX, marinePhase));
      const heroY = compact ? 1.5 : 0.07;
      const chapterY = compact ? 0.6 : -0.09;
      world.current.position.y = damp(world.current.position.y, lerp(heroY, chapterY, marinePhase) + Math.sin(time * 0.28) * 0.045);
      world.current.rotation.x = damp(world.current.rotation.x, (reducedMotion ? 0 : pointer.current.y * -0.035) + 0.03);
      world.current.rotation.y = damp(world.current.rotation.y, (reducedMotion ? 0 : pointer.current.x * 0.07) + Math.sin(scroll * 0.7) * 0.12);
      const scale = compact ? Math.min(0.5, aspect * 1.05) : Math.min(0.99, aspect * 0.63);
      world.current.scale.setScalar(damp(world.current.scale.x, scale));
    }

    camera.position.x = damp(camera.position.x, compact || reducedMotion ? 0 : pointer.current.x * 0.07);
    camera.position.y = damp(camera.position.y, reducedMotion ? 0 : pointer.current.y * -0.055);
    camera.position.z = damp(camera.position.z, 10.5 - Math.sin(Math.min(scroll, 7) / 7 * Math.PI) * 0.55);
    camera.lookAt(0, 0, 0);

    if (lens.current) {
      lens.current.rotation.y = damp(lens.current.rotation.y, -0.06 + Math.sin(time * 0.14) * 0.14 + marinePhase * 0.46 + systemsPhase * 0.28);
      lens.current.rotation.z = damp(lens.current.rotation.z, Math.sin(time * 0.11) * 0.085 + marinePhase * -0.18 + closingPhase * 0.22);
      lens.current.position.z = damp(lens.current.position.z, -marinePhase * 1.9 + closingPhase * 0.9);
      lens.current.scale.setScalar(damp(lens.current.scale.x, 1 + marinePhase * 0.29 - closingPhase * 0.13));
    }
    if (controls.current) {
      controls.current.scale.setScalar(damp(controls.current.scale.x, lerp(0.83, 0.43, marinePhase) + closingPhase * 0.32));
      controls.current.position.y = damp(controls.current.position.y, 0.02 + marinePhase * 1.85 - closingPhase * 1.65);
      controls.current.position.z = damp(controls.current.position.z, 0.1 + Math.sin(time * 0.2) * 0.045);
      controls.current.rotation.y = damp(controls.current.rotation.y, Math.sin(time * 0.15) * 0.1 + scroll * 0.095);
    }
    if (marine.current) {
      const scale = 0.001 + marinePhase * (0.81 - systemsPhase * 0.16) * (1 - closingPhase * 0.97);
      marine.current.visible = scale > 0.02;
      marine.current.scale.setScalar(damp(marine.current.scale.x, scale));
      marine.current.position.y = damp(marine.current.position.y, -0.46 - systemsPhase * 0.28);
      marine.current.position.z = damp(marine.current.position.z, 0.15 + marinePhase * 0.6);
      marine.current.rotation.y = damp(marine.current.rotation.y, Math.sin(time * 0.12) * 0.085 + systemsPhase * -0.3);
    }
    if (artifacts.current) {
      const scale = 0.001 + systemsPhase * 0.99 * (1 - closingPhase * 0.62);
      artifacts.current.visible = scale > 0.02;
      artifacts.current.scale.setScalar(damp(artifacts.current.scale.x, scale));
      artifacts.current.rotation.z = damp(artifacts.current.rotation.z, Math.sin(time * 0.1) * 0.025);
    }
  });

  return (
    <group ref={world} position={[compact ? 0.5 : 2.4, compact ? 1.5 : 0.07, 0]} scale={compact ? 0.5 : 0.95}>
      <OpticalBackdrop />
      <group ref={lens}><LiquidLens compact={compact} /></group>
      <group ref={controls} scale={0.83}><ControlCore /></group>
      <group ref={marine} scale={0.001} visible={false}><MarineEngine reducedMotion={reducedMotion} /></group>
      <group ref={artifacts} scale={0.001} visible={false}><AutomationArtifacts compact={compact} reducedMotion={reducedMotion} /></group>
    </group>
  );
}

function RendererLifecycle({ onUnavailable }: { onUnavailable: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [gl, onUnavailable]);
  return null;
}

export function WorldCanvas({ fallback }: { fallback?: ReactNode }) {
  const [active, setActive] = useState(() => typeof document === "undefined" || !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [compact, setCompact] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 760px), (pointer: coarse)").matches);
  const [unavailable, setUnavailable] = useState(false);
  const handleUnavailable = useCallback(() => setUnavailable(true), []);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layout = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateLayout = () => setCompact(layout.matches);
    const updateVisibility = () => setActive(!document.hidden);
    updateMotion();
    updateLayout();
    updateVisibility();
    motion.addEventListener("change", updateMotion);
    layout.addEventListener("change", updateLayout);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      motion.removeEventListener("change", updateMotion);
      layout.removeEventListener("change", updateLayout);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  if (unavailable) return <>{fallback}</>;

  return (
    <Canvas
      dpr={[1, compact ? 1.1 : 1.5]}
      camera={{ position: [0, 0, 10.5], fov: 36, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true, depth: true, powerPreference: "low-power", preserveDrawingBuffer: false, stencil: false }}
      frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
      fallback={fallback}
    >
      <color attach="background" args={["#05080e"]} />
      <RendererLifecycle onUnavailable={handleUnavailable} />
      <StudioEnvironment />
      <ambientLight color="#b4ceee" intensity={0.8} />
      <directionalLight position={[-3, 6, 7]} color="#f2f8ff" intensity={3.6} />
      <directionalLight position={[5, 1, -2]} color="#a4b8ff" intensity={2.4} />
      <pointLight position={[0, -3, 4]} color="#67d8ff" intensity={14} distance={14} />
      <SceneDirector compact={compact} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
