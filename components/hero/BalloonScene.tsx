"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Text3D, useFont } from "@react-three/drei";
import { Color, MeshPhysicalMaterial, type Group } from "three";
import { tiltFromPointer } from "@/lib/tilt";

const FONT = "/fonts/fredoka-bold.typeface.json";
const SIZE = 1.4;
const KERN = -0.04; // balloon letters huddle a little
const FPS = 30; // gentle floating doesn't need 60fps; saves battery

/** Reads the theme's balloon colour and follows theme changes. */
function useBalloonColor() {
  const read = () => getComputedStyle(document.documentElement).getPropertyValue("--color-balloon").trim() || "#a9dc8f";
  const [color, setColor] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setColor(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return color;
}

/** One letter: bobs on its own rhythm, squishes and bounces when tapped. */
function Balloon({ ch, x, width, i, material }: { ch: string; x: number; width: number; i: number; material: MeshPhysicalMaterial }) {
  const g = useRef<Group>(null);
  const bounce = useRef({ y: 0, v: 0 });
  const speed = 0.8 + ((i * 37) % 10) / 25;
  const phase = i * 1.7;

  useFrame((state, dt) => {
    const el = g.current;
    if (!el) return;
    const t = state.clock.elapsedTime;
    // spring for the tap bounce
    const b = bounce.current;
    const step = Math.min(dt, 0.05);
    b.v += (-90 * b.y - 9 * b.v) * step;
    b.y += b.v * step;
    el.position.y = Math.sin(t * speed + phase) * 0.07 + b.y * 0.6;
    el.rotation.z = Math.sin(t * speed * 0.7 + phase) * 0.05;
    el.scale.set(1 - b.y * 0.12, 1 + b.y * 0.2, 1);
  });

  return (
    <group ref={g} position={[x + width / 2, 0, 0]}>
      <Text3D
        font={FONT}
        position={[-width / 2, -SIZE * 0.36, 0]}
        size={SIZE}
        height={0.1}
        curveSegments={20}
        bevelEnabled
        bevelThickness={0.32}
        bevelSize={0.066}
        bevelSegments={18}
        smooth={0.0005}
        material={material}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
        onPointerDown={() => (bounce.current.v += 5)}
      >
        {ch}
      </Text3D>
    </group>
  );
}

/** The word: letters laid out from the font's own advances, leaning toward the pointer. */
function Word({ text, box, onReady }: { text: string; box: React.RefObject<HTMLDivElement | null>; onReady: () => void }) {
  const font = useFont(FONT);
  const group = useRef<Group>(null);
  const target = useRef({ yaw: 0, pitch: 0 });
  const lastMove = useRef(0);
  const viewport = useThree((s) => s.viewport);
  const color = useBalloonColor();

  const material = useMemo(
    () => new MeshPhysicalMaterial({ metalness: 0.5, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.03, iridescence: 0.3, iridescenceIOR: 1.3, envMapIntensity: 1 }),
    [],
  );
  useEffect(() => {
    material.color = new Color(color);
    // Night: the foil glows a touch
    material.emissive = new Color(color).multiplyScalar(document.documentElement.dataset.theme === "night" ? 0.18 : 0);
    material.needsUpdate = true;
  }, [color, material]);
  useEffect(() => () => material.dispose(), [material]);

  const letters = useMemo(() => {
    const { glyphs, resolution } = font.data as unknown as { glyphs: Record<string, { ha: number }>; resolution: number };
    let x = 0;
    const out = [...text].map((ch, i) => {
      const width = ((glyphs[ch]?.ha ?? 500) / resolution) * SIZE;
      const l = { ch, x, width, i };
      x += width + KERN;
      return l;
    });
    const total = x - KERN;
    return { out: out.map((l) => ({ ...l, x: l.x - total / 2 })), total };
  }, [font, text]);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(onReady)); // after the first frame with letters
  }, [onReady]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !box.current) return;
      target.current = tiltFromPointer(e.clientX, e.clientY, box.current.getBoundingClientRect(), { yaw: 0.2, pitch: 0.14 });
      lastMove.current = performance.now();
    };
    const onLeave = () => (target.current = { yaw: 0, pitch: 0 });
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [box]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const idle = performance.now() - lastMove.current > 2500;
    const goal = idle ? { yaw: 0, pitch: 0 } : target.current;
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 4);
    g.rotation.y += (goal.yaw - g.rotation.y) * k;
    g.rotation.x += (goal.pitch - g.rotation.x) * k;
  });

  const scale = Math.min((viewport.width * 0.72) / letters.total, (viewport.height * 0.6) / (SIZE * 0.95));
  return (
    <group ref={group} scale={scale}>
      {letters.out.map((l) => (
        <Balloon key={l.i} {...l} material={material} />
      ))}
    </group>
  );
}

/** Draws at a calm frame rate while the title is on screen and the tab is visible. */
function Ticker({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const start = () => {
      clearInterval(id);
      if (!document.hidden) id = window.setInterval(() => invalidate(), 1000 / FPS);
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", start);
    };
  }, [active, invalidate]);
  return null;
}

/** three.js scene for the balloon title. Loaded lazily by BalloonTitle. */
export default function BalloonScene({ text, onReady, onLost }: { text: string; onReady: () => void; onLost: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? "demand" : "never"}
        camera={{ position: [0, 0, 10], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onLost, { once: true })}
      >
        <Ticker active={visible} />
        {/* a soft, bright studio: big diffuse panels, no dark bands */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#b9b9b4"]} />
          <Lightformer intensity={2} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[16, 8, 1]} />
          <Lightformer intensity={1.2} position={[-6, 1, 4]} rotation-y={Math.PI / 2.4} scale={[8, 6, 1]} />
          <Lightformer intensity={1.2} position={[6, 1, 4]} rotation-y={-Math.PI / 2.4} scale={[8, 6, 1]} />
          {/* little round softboxes: the shiny spots on a foil balloon */}
          <Lightformer intensity={6} position={[-2.5, 2.5, 7]} rotation-y={Math.PI} scale={[1.6, 1.6, 1]} form="circle" />
          <Lightformer intensity={4} position={[3, 1.2, 7]} rotation-y={Math.PI} scale={[0.9, 0.9, 1]} form="circle" />
          <Lightformer intensity={2.5} position={[0, -1.5, 7]} rotation-y={Math.PI} scale={[6, 0.5, 1]} />
          <Lightformer intensity={0.6} color="#8a8a84" position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[16, 8, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Word text={text} box={box} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
