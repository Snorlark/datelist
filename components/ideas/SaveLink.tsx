"use client";

import { useState } from "react";
import type { DateIdea, ExtractedLink, PersonId } from "@/types";
import { Sheet } from "@/components/ui/Sheet";
import { Polaroid } from "@/components/ui/Polaroid";
import { Pet } from "@/components/illustrations/Pet";
import { pill, softPill } from "@/components/ui/Pill";
import { cn, priceMarks } from "@/lib/utils/format";

type Step = "paste" | "looking" | "found" | "saving";

const field = "w-full rounded-card bg-card px-4 py-3.5 outline-none ring-1 ring-line placeholder:text-faint focus:ring-ink";

/** Paste a link → we find what it is → save it to the list. */
export function SaveLink({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: (idea: DateIdea) => void }) {
  const [step, setStep] = useState<Step>("paste");
  const [url, setUrl] = useState("");
  const [found, setFound] = useState<ExtractedLink | null>(null);
  const [who, setWho] = useState<PersonId>("lark");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep("paste");
      setUrl("");
      setFound(null);
      setNote("");
      setError(null);
    }, 300);
  };

  async function look(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStep("looking");
    const res = await fetch("/api/extract", { method: "POST", body: JSON.stringify({ url }) });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setStep("paste");
      return;
    }
    setFound(json);
    setStep("found");
  }

  async function save() {
    if (!found) return;
    setStep("saving");
    const res = await fetch("/api/ideas", { method: "POST", body: JSON.stringify({ link: found, savedBy: who, notes: note || undefined }) });
    if (!res.ok) {
      setError("That didn't save. Try again in a moment.");
      setStep("found");
      return;
    }
    onSaved(await res.json());
    close();
  }

  return (
    <Sheet open={open} onClose={close} label="Save a link">
      {step === "paste" || step === "looking" ? (
        <form onSubmit={look} className="pt-5">
          <label htmlFor="save-url" className="font-serif text-title">
            Save a link
          </label>
          <p className="mt-1.5 text-label text-muted">From Instagram, TikTok, Google Maps or any website.</p>
          <input
            id="save-url"
            type="url"
            inputMode="url"
            required
            placeholder="https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={cn(field, "mt-5")}
          />
          {error && (
            <p role="alert" className="mt-3 flex items-center gap-2 text-label text-sophia">
              <Pet who="sophia" mood="oops" size={28} />
              {error}
            </p>
          )}
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={step === "looking" || !url} className={cn(pill, "flex-1 py-3.5")}>
              {step === "looking" ? "Looking…" : "Find it"}
            </button>
            <button type="button" onClick={() => setUrl("https://www.instagram.com/p/toyo-eatery")} className={cn(softPill, "py-3.5")}>
              Try an example
            </button>
          </div>
        </form>
      ) : (
        found && (
          <div className="pt-5">
            <p className="font-serif text-title">Found it</p>
            <div className="mt-5 grid grid-cols-[7rem_1fr] items-center gap-5">
              <Polaroid scene={found.scene} alt="" aspect="aspect-square" tilt={-3} caption={found.source} sizes="7rem" />
              <div>
                <p className="font-medium">{found.title}</p>
                <p className="text-label text-muted">{found.area}</p>
                <p className="mt-1 text-label text-muted">{[found.cuisine, found.rating && `${found.rating} ★`, priceMarks(found.price)].filter(Boolean).join(" · ")}</p>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="text-label font-medium text-muted">Who&apos;s saving it?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["lark", "sophia"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={who === p}
                    onClick={() => setWho(p)}
                    className={cn("rounded-full py-2.5 text-label font-medium capitalize transition-colors", who === p ? (p === "lark" ? "bg-lark text-white" : "bg-sophia text-white") : "bg-sage text-muted")}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="mt-5 block">
              <span className="sr-only">Why you saved it</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why? “the dessert looked unreal”" className={field} />
            </label>
            {error && (
              <p role="alert" className="mt-3 flex items-center gap-2 text-label text-sophia">
                <Pet who="sophia" mood="oops" size={28} />
                {error}
              </p>
            )}
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={save} disabled={step === "saving"} className={cn(pill, "flex-1 py-3.5")}>
                {step === "saving" ? "Saving…" : "Save to ideas"}
              </button>
              <button type="button" onClick={() => setStep("paste")} className={cn(softPill, "py-3.5")}>
                Different link
              </button>
            </div>
          </div>
        )
      )}
    </Sheet>
  );
}
