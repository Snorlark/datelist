"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

/** iOS-style bottom sheet (a centred dialog on desktop). Escape or a tap outside closes it; Tab stays inside. */
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  // keep the latest onClose without re-running the open/close effect on every render
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeRef.current();
      if (e.key !== "Tab") return;
      // keep Tab inside the dialog
      const items = focusables();
      if (!items.length) return e.preventDefault();
      const first = items[0];
      const last = items[items.length - 1];
      const here = document.activeElement;
      if (e.shiftKey && (here === first || here === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (here === last || !panel.current?.contains(here))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // first input if there is one (forms), otherwise the first link or button, otherwise the panel
    const t = setTimeout(() => {
      const items = focusables().filter((el) => !el.hasAttribute("data-close"));
      (items.find((el) => el.tagName === "INPUT") ?? items[0] ?? panel.current)?.focus();
    }, 60);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" data-close tabIndex={-1} className="fade-in absolute inset-0 bg-ink/25 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="sheet-up relative outline-none max-h-[88dvh] w-full max-w-[34rem] overflow-y-auto rounded-t-[1.75rem] bg-page px-5 lg:max-w-[44rem] lg:px-9 lg:pb-9 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3 sm:rounded-[1.75rem]"
      >
        <div className="mx-auto h-1 w-9 rounded-full bg-faint/70 sm:hidden" aria-hidden />
        <button data-close onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-sage text-muted hover:text-ink">
          <X size={16} strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  );
}
