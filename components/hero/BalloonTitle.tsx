"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/format";

const BalloonScene = dynamic(() => import("./BalloonScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // only checking, give it back
    return !!gl;
  } catch {
    return false;
  }
}

/** If the 3D scene throws (font fails, WebGL breaks), fall back to the flat title. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The big title as floating balloon letters. Puffy CSS lettering paints first
 * (and stays for reduced motion or no WebGL); the 3D balloons load after and
 * fade in over it.
 */
export function BalloonTitle({ text }: { text: string }) {
  const still = useReducedMotion();
  const [use3d, setUse3d] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setUse3d(!still && hasWebGL()), [still]);
  const fallBack = () => {
    setReady(false);
    setUse3d(false);
  };

  return (
    <div className="relative mx-auto h-[clamp(8.5rem,24vw,17rem)] w-full max-w-[64rem]">
      <h1 className="sr-only">{text}</h1>
      <p
        aria-hidden
        className={cn(
          "balloon-text absolute inset-0 flex items-center justify-center text-[clamp(4.5rem,13vw,9.5rem)] leading-none tracking-[-0.02em] transition-opacity duration-500",
          ready && "opacity-0",
        )}
      >
        {text}
      </p>
      {use3d && (
        <div aria-hidden className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
          <SceneBoundary onError={fallBack}>
            <BalloonScene text={text} onReady={() => setReady(true)} onLost={fallBack} />
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
