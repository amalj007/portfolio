"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

function ControlCore({ motionDisabled }: { motionDisabled: RefObject<boolean> }) {
  const body = useRef<THREE.Group>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (motionDisabled.current) return;
    const time = clock.elapsedTime;
    if (body.current) {
      body.current.rotation.y += delta * 0.12;
      body.current.position.y = Math.sin(time * 0.38) * 0.075;
    }
    if (outerRing.current) outerRing.current.rotation.z += delta * 0.08;
    if (innerRing.current) innerRing.current.rotation.x -= delta * 0.11;
  });

  return (
    <group ref={body} rotation={[0.18, -0.34, -0.08]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.55, 2.1, 1.15]} />
        <meshStandardMaterial color="#111c20" metalness={0.82} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0, 0.61]}>
        <boxGeometry args={[2.25, 1.78, 0.08]} />
        <meshPhysicalMaterial
          color="#91daca"
          metalness={0.16}
          roughness={0.12}
          transmission={0.62}
          thickness={0.45}
          clearcoat={1}
          transparent
          opacity={0.84}
        />
      </mesh>
      <mesh position={[0, 0.58, 0.69]}>
        <boxGeometry args={[1.23, 0.57, 0.035]} />
        <meshStandardMaterial
          color="#10252a"
          emissive="#48f2d0"
          emissiveIntensity={0.26}
          metalness={0.38}
          roughness={0.2}
        />
      </mesh>
      {[-0.52, 0, 0.52].map((x, index) => (
        <mesh key={x} position={[x, -0.25, 0.72]}>
          <boxGeometry args={[0.35, 0.28 + (index % 2) * 0.12, 0.045]} />
          <meshStandardMaterial
            color="#132c30"
            emissive={index === 1 ? "#70f8d7" : "#208c88"}
            emissiveIntensity={index === 1 ? 0.64 : 0.24}
            roughness={0.28}
          />
        </mesh>
      ))}
      <mesh position={[-0.84, -0.66, 0.72]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshBasicMaterial color="#8dffdf" />
      </mesh>
      <mesh position={[-0.58, -0.66, 0.72]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#4d9ef5" />
      </mesh>
      <mesh position={[0.84, -0.66, 0.72]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#b1c6c3" />
      </mesh>
      <mesh ref={outerRing} rotation={[Math.PI / 2.6, 0.2, 0.36]}>
        <torusGeometry args={[1.82, 0.027, 12, 96]} />
        <meshStandardMaterial color="#00e5ff" metalness={0.78} roughness={0.24} emissive="#39cdb7" emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={innerRing} rotation={[0.8, -0.4, 0.15]}>
        <torusGeometry args={[1.48, 0.012, 10, 96]} />
        <meshBasicMaterial color="#bbf7ea" transparent opacity={0.56} />
      </mesh>
      <mesh position={[0, 0, -0.74]}>
        <cylinderGeometry args={[0.14, 0.14, 0.95, 24]} />
        <meshStandardMaterial color="#4c6764" metalness={0.91} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -1.24]}>
        <torusGeometry args={[0.48, 0.035, 12, 48]} />
        <meshStandardMaterial color="#a2eee0" metalness={0.86} roughness={0.2} emissive="#4ec4ba" emissiveIntensity={0.17} />
      </mesh>
    </group>
  );
}

function MarineEngine({ motionDisabled }: { motionDisabled: RefObject<boolean> }) {
  const assembly = useRef<THREE.Group>(null);
  const shaft = useRef<THREE.Mesh>(null);
  const wheel = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (motionDisabled.current) return;
    const time = clock.elapsedTime;
    if (assembly.current) {
      assembly.current.rotation.y = -0.45 + Math.sin(time * 0.16) * 0.045;
      assembly.current.rotation.z = Math.sin(time * 0.19) * 0.018;
    }
    if (shaft.current) shaft.current.rotation.x += delta * 0.36;
    if (wheel.current) wheel.current.rotation.x += delta * 0.36;
  });

  return (
    <group ref={assembly} position={[0, -0.18, 0]} rotation={[0.12, -0.45, 0.015]}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[4.35, 1.23, 1.32]} />
        <meshStandardMaterial color="#17272a" metalness={0.86} roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.1, 0.68]}>
        <boxGeometry args={[3.92, 0.89, 0.045]} />
        <meshPhysicalMaterial
          color="#80d7c7"
          metalness={0.25}
          roughness={0.19}
          transmission={0.38}
          transparent
          opacity={0.67}
          clearcoat={1}
        />
      </mesh>
      {[-1.48, -0.52, 0.52, 1.48].map((x, index) => (
        <group key={x} position={[x, 0.67, 0.02]}>
          <mesh>
            <cylinderGeometry args={[0.29, 0.34, 0.92, 24]} />
            <meshStandardMaterial color={index % 2 ? "#253d3f" : "#1d3336"} metalness={0.78} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
            <meshStandardMaterial color="#00e5ff" metalness={0.84} roughness={0.24} emissive="#3cae9d" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, -0.57, 0.32]} rotation={[0.22, 0, 0.08]}>
            <cylinderGeometry args={[0.055, 0.075, 0.9, 12]} />
            <meshStandardMaterial color="#91bdb3" metalness={0.9} roughness={0.22} />
          </mesh>
          <mesh position={[0, -0.84, 0.39]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#68c9b5" metalness={0.82} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh ref={shaft} position={[0, -0.76, 0.35]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.105, 0.105, 3.5, 24]} />
        <meshStandardMaterial color="#b1cfca" metalness={0.95} roughness={0.16} />
      </mesh>
      <mesh ref={wheel} position={[2.23, -0.73, 0.36]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.78, 0.12, 16, 64]} />
        <meshStandardMaterial color="#75e3cf" metalness={0.9} roughness={0.17} emissive="#2d9b8a" emissiveIntensity={0.24} />
      </mesh>
      <mesh position={[2.23, -0.73, 0.36]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.48, 24]} />
        <meshStandardMaterial color="#203f40" metalness={0.88} roughness={0.2} />
      </mesh>
      <mesh position={[-2.31, -0.78, -0.28]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.07, 12, 48]} />
        <meshStandardMaterial color="#9cddd2" metalness={0.88} roughness={0.24} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[4.7, 0.18, 1.7]} />
        <meshStandardMaterial color="#101a1c" metalness={0.82} roughness={0.3} />
      </mesh>
    </group>
  );
}

function FloatingMarkers({ motionDisabled }: { motionDisabled: RefObject<boolean> }) {
  const markers = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (motionDisabled.current || !markers.current) return;
    markers.current.rotation.y = Math.sin(clock.elapsedTime * 0.14) * 0.1;
    markers.current.rotation.z += delta * 0.025;
  });

  return (
    <group ref={markers}>
      {[
        [-2.45, 1.5, 0.6],
        [2.52, 1.18, -0.4],
        [-2.2, -1.65, -0.65],
        [2.4, -1.6, 0.55],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <icosahedronGeometry args={[index === 1 ? 0.11 : 0.075, 1]} />
          <meshPhysicalMaterial
            color={index % 2 ? "#96c9ff" : "#a6ffe3"}
            emissive={index % 2 ? "#3a7cc6" : "#45d3ad"}
            emissiveIntensity={0.28}
            metalness={0.42}
            roughness={0.16}
            clearcoat={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function AutomationArtifacts({ motionDisabled }: { motionDisabled: RefObject<boolean> }) {
  const gear = useRef<THREE.Group>(null);
  const robot = useRef<THREE.Group>(null);
  const plc = useRef<THREE.Group>(null);
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (motionDisabled.current) return;
    const time = clock.elapsedTime;
    if (gear.current) gear.current.rotation.z = time * 0.045;
    if (robot.current) {
      robot.current.rotation.y = Math.sin(time * 0.19) * 0.06;
      robot.current.rotation.z = Math.sin(time * 0.23) * 0.025;
    }
    if (plc.current) plc.current.position.y = -1.68 + Math.sin(time * 0.32) * 0.045;
  });

  if (size.width < 760) return null;

  const toothAngles = Array.from({ length: 8 }, (_, index) => (index * Math.PI * 2) / 8);
  return (
    <group>
      <group ref={gear} position={[-3.15, 1.55, 0.45]} scale={0.35}>
        <mesh>
          <torusGeometry args={[0.9, 0.12, 10, 48]} />
          <meshStandardMaterial color="#a8fff0" metalness={0.84} roughness={0.2} emissive="#1a827d" emissiveIntensity={0.14} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.42, 0.055, 8, 32]} />
          <meshPhysicalMaterial color="#c8fff8" metalness={0.64} roughness={0.16} transmission={0.12} clearcoat={1} />
        </mesh>
        {toothAngles.map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 0.94, Math.sin(angle) * 0.94, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.28, 0.21, 0.16]} />
            <meshStandardMaterial color="#8bb8b5" metalness={0.86} roughness={0.22} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.25, 20]} />
          <meshStandardMaterial color="#18282b" metalness={0.92} roughness={0.19} />
        </mesh>
      </group>

      <group ref={plc} position={[-2.95, -1.68, 0.62]} scale={0.42}>
        <mesh>
          <boxGeometry args={[1.15, 1.7, 0.42]} />
          <meshStandardMaterial color="#26383a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.23]}>
          <boxGeometry args={[0.84, 1.37, 0.045]} />
          <meshPhysicalMaterial color="#9cb7b2" metalness={0.15} roughness={0.17} transmission={0.52} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.31, 0.27]}>
          <boxGeometry args={[0.57, 0.36, 0.035]} />
          <meshStandardMaterial color="#092326" emissive="#00d9e8" emissiveIntensity={0.35} roughness={0.22} />
        </mesh>
        {[-0.34, -0.11, 0.12, 0.35].map((x, index) => (
          <mesh key={x} position={[x, -0.29, 0.27]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color={index === 1 ? "#00e5ff" : "#8ea7a2"} />
          </mesh>
        ))}
      </group>

      <group ref={robot} position={[3.05, 1.2, 0.16]} scale={0.34}>
        <mesh position={[0, -0.54, 0]}>
          <cylinderGeometry args={[0.5, 0.56, 0.22, 28]} />
          <meshStandardMaterial color="#17282b" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.29, 0]}>
          <sphereGeometry args={[0.23, 20, 20]} />
          <meshStandardMaterial color="#82d5c8" metalness={0.78} roughness={0.2} emissive="#184c4c" emissiveIntensity={0.2} />
        </mesh>
        <group position={[0, -0.24, 0]} rotation={[0, 0, -0.38]}>
          <mesh position={[0, 0.43, 0]}>
            <boxGeometry args={[0.22, 0.96, 0.25]} />
            <meshStandardMaterial color="#29474a" metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.2, 18, 18]} />
            <meshStandardMaterial color="#91e6d7" metalness={0.78} roughness={0.19} />
          </mesh>
          <group position={[0, 0.91, 0]} rotation={[0, 0, 0.76]}>
            <mesh position={[0, 0.33, 0]}>
              <boxGeometry args={[0.16, 0.75, 0.18]} />
              <meshStandardMaterial color="#254043" metalness={0.84} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.73, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="#00dff0" metalness={0.68} roughness={0.2} emissive="#146979" emissiveIntensity={0.32} />
            </mesh>
            <mesh position={[0.1, 0.86, 0]} rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.3, 0.08, 0.1]} />
              <meshStandardMaterial color="#a9cbc4" metalness={0.88} roughness={0.16} />
            </mesh>
          </group>
        </group>
      </group>

      <group position={[3.0, -1.62, -0.72]} rotation={[0, -0.08, 0.06]} scale={0.36}>
        <mesh>
          <boxGeometry args={[1.7, 1.05, 0.12]} />
          <meshStandardMaterial color="#0e2227" metalness={0.66} roughness={0.3} emissive="#082e39" emissiveIntensity={0.16} />
        </mesh>
        {[
          [-0.5, 0.15, 0.075, 0.58, 0.035],
          [-0.18, 0.15, 0.075, 0.035, 0.38],
          [-0.18, -0.04, 0.075, 0.67, 0.035],
          [0.18, -0.04, 0.075, 0.035, 0.42],
          [0.18, -0.23, 0.075, 0.55, 0.035],
        ].map(([x, y, z, width, height], index) => (
          <mesh key={index} position={[x, y, z]}>
            <boxGeometry args={[width, height, 0.018]} />
            <meshStandardMaterial color={index % 2 ? "#5bc8d3" : "#5bd8b6"} emissive={index % 2 ? "#246a86" : "#286b60"} emissiveIntensity={0.28} />
          </mesh>
        ))}
        {[-0.58, 0.58].map((x) => (
          <mesh key={x} position={[x, -0.39, 0.09]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SceneDirector() {
  const world = useRef<THREE.Group>(null);
  const controls = useRef<THREE.Group>(null);
  const marine = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);
  const { camera, size } = useThree();

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const page = document.documentElement;
      const max = Math.max(1, page.scrollHeight - window.innerHeight);
      progress.current = window.scrollY / max;
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const scroll = THREE.MathUtils.clamp(progress.current, 0, 1);
    const marinePhase = THREE.MathUtils.smoothstep(scroll, 0.12, 0.38);
    const narrow = size.width < 680;
    const damp = (current: number, target: number) =>
      THREE.MathUtils.damp(current, target, 2.4, delta);

    if (world.current) {
      const desiredX = narrow ? 0.1 : 1.75 - marinePhase * 0.55;
      const desiredY = 0.1 + Math.sin(time * 0.24) * 0.05 - marinePhase * 0.24;
      world.current.position.x = damp(world.current.position.x, desiredX);
      world.current.position.y = damp(world.current.position.y, desiredY);
      world.current.rotation.y = damp(
        world.current.rotation.y,
        (reducedMotion.current ? 0 : pointer.current.x * 0.035) - 0.12,
      );
      world.current.rotation.x = damp(
        world.current.rotation.x,
        reducedMotion.current ? 0.04 : pointer.current.y * -0.025 + 0.04,
      );
      const scale = narrow ? 0.6 : 0.88;
      const sceneScale = scale * (1 - marinePhase * 0.08);
      world.current.scale.setScalar(damp(world.current.scale.x, sceneScale));
    }

    camera.position.x = damp(
      camera.position.x,
      (narrow ? 0 : pointer.current.x * 0.075) + Math.sin(scroll * Math.PI) * 0.18,
    );
    camera.position.y = damp(
      camera.position.y,
      reducedMotion.current ? 0 : -scroll * 0.2 + pointer.current.y * -0.045,
    );
    camera.position.z = damp(camera.position.z, 10 - Math.sin(scroll * Math.PI) * 0.3);
    camera.lookAt(0, 0, 0);

    if (controls.current) {
      const scale = THREE.MathUtils.lerp(1, 0.48, marinePhase);
      controls.current.scale.setScalar(damp(controls.current.scale.x, scale));
      controls.current.position.y = damp(controls.current.position.y, marinePhase * 0.42);
    }

    if (marine.current) {
      const scale = THREE.MathUtils.lerp(0.35, 0.78, marinePhase);
      marine.current.scale.setScalar(damp(marine.current.scale.x, scale));
      marine.current.position.y = damp(marine.current.position.y, -0.32 + marinePhase * 0.08);
      marine.current.position.x = damp(marine.current.position.x, -0.3);
    }
  });

  return (
    <group ref={world}>
      <group ref={controls} position={[0, 0.12, 0]}>
        <ControlCore motionDisabled={reducedMotion} />
      </group>
      <group ref={marine} position={[-0.3, -0.32, -0.6]}>
        <MarineEngine motionDisabled={reducedMotion} />
      </group>
      <AutomationArtifacts motionDisabled={reducedMotion} />
      <FloatingMarkers motionDisabled={reducedMotion} />
    </group>
  );
}

export function WorldCanvas() {
  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [0, 0, 10], fov: 38, near: 0.1, far: 60 }}
      gl={{
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: "low-power",
        preserveDrawingBuffer: false,
        stencil: false,
      }}
      frameloop="always"
      fallback={<div className="scene-fallback" />}
    >
      <ambientLight color="#b8d8d2" intensity={1.15} />
      <directionalLight position={[3.5, 5, 5]} color="#f1fff9" intensity={2.6} />
      <pointLight position={[-4, 1, 2]} color="#55efcf" intensity={17} />
      <pointLight position={[1.5, -3, -3]} color="#4c8df0" intensity={9} />
      <SceneDirector />
    </Canvas>
  );
}

