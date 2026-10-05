"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEMES, THEME_KEY, isThemeId, type ThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils/format";

function apply(id: ThemeId) {
  const root = document.documentElement;
  if (id === "matcha") delete root.dataset.theme;
  else root.dataset.theme = id;
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {
    /* private mode: the theme still applies for this visit */
  }
}

/** A palette button that opens five swatches. The pick is remembered in this browser. */
export function ThemePicker({ align = "left", up }: { align?: "left" | "right"; up?: boolean }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("matcha");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setTheme(isThemeId(t) ? t : "matcha");
  }, []);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const current = THEMES.find((t) => t.id === theme)!;

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.8125rem] text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
      >
        <Palette size={15} strokeWidth={1.8} aria-hidden />
        <span>Theme</span>
        <span aria-hidden className="h-3 w-3 rounded-full ring-1 ring-ink/20" style={{ background: current.band }} />
        <span className="sr-only">: {current.label}</span>
      </button>

      {open && (
        <div
          role="radiogroup"
          aria-label="Theme"
          className={cn(
            "fade-in absolute z-50 w-52 rounded-xl bg-card p-1.5 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.35)] ring-1 ring-line",
            up ? "bottom-full mb-2" : "top-full mt-2",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {THEMES.map((t) => {
            const on = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  apply(t.id);
                  setTheme(t.id);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[0.875rem] transition-colors hover:bg-ink/[0.05]"
              >
                <span aria-hidden className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/15" style={{ background: t.page }}>
                  <span className="absolute inset-x-0 top-0 h-1/2" style={{ background: t.band }} />
                  <span className="absolute bottom-1 left-1.5 h-1.5 w-4 rounded-full" style={{ background: t.mark }} />
                </span>
                <span className="flex-1">{t.label}</span>
                {on && <Check size={15} strokeWidth={2.2} aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
