/** Shown while a page loads: a little trail of paw prints walking across. */
export default function Loading() {
  return (
    <div role="status" className="content flex min-h-[60dvh] flex-col items-center justify-center gap-4">
      <div className="paw-walk flex items-end gap-3" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-5 w-5 fill-coral" style={{ marginBottom: i % 2 ? 10 : 0, rotate: "70deg" }}>
            <ellipse cx="10" cy="13.5" rx="5" ry="4.2" />
            <ellipse cx="4" cy="8" rx="2" ry="2.5" />
            <ellipse cx="8" cy="4.5" rx="2" ry="2.5" />
            <ellipse cx="12.5" cy="4.5" rx="2" ry="2.5" />
            <ellipse cx="16.3" cy="8" rx="2" ry="2.5" />
          </svg>
        ))}
      </div>
      <p className="font-type text-[0.8125rem] text-muted">on our way…</p>
    </div>
  );
}
