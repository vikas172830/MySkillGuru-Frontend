"use client";
import { useId } from "react";

const STATUS = {
  idle: { label: "Ready", tone: "bg-slate-100 text-slate-700" },
  starting: { label: "Starting…", tone: "bg-sky-100 text-sky-800" },
  running: { label: "Running…", tone: "bg-sky-100 text-sky-800" },
  done: { label: "Finished", tone: "bg-emerald-100 text-emerald-800" },
  failed: { label: "Finished with an error", tone: "bg-red-100 text-red-800" },
  timeout: { label: "Timed out", tone: "bg-amber-100 text-amber-900" },
  stopped: { label: "Stopped", tone: "bg-slate-100 text-slate-700" },
};

export default function OutputPanel({ status, segments, durationMs, error, language }) {
  const titleId = useId();
  const { label, tone } = STATUS[status] ?? STATUS.idle;
  const empty = segments.length === 0;

  return (
    <section
      aria-labelledby={titleId}
      data-testid="output-panel"
      className="flex min-h-[200px] flex-col rounded-2xl border border-[color:var(--msg-line)] bg-white"
    >
      <header className="flex items-center justify-between gap-3 border-b border-[color:var(--msg-line)] px-4 py-2.5">
        <h2 id={titleId} className="text-xs font-bold uppercase tracking-wider text-[color:var(--msg-muted)]">
          Output
        </h2>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}>
          {label}
          {status === "done" && durationMs != null ? ` in ${durationMs} ms` : ""}
        </span>
      </header>

      <div className="flex-1 overflow-auto px-4 py-3">
        {status === "starting" && language === "python" && (
          <p className="mb-2 text-xs text-[color:var(--msg-muted)]">
            Starting Python. The first run downloads the runtime (about 10 MB) and can take a few seconds; later runs are instant.
          </p>
        )}

        {/* role="log" announces new output to screen readers without stealing focus */}
        <pre role="log" aria-live="polite" className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed">
          {empty && status === "idle" && (
            <span className="text-[color:var(--msg-muted)]">Run your code to see the output here.</span>
          )}
          {segments.map((segment, i) => (
            <span key={i} className={segment.stream === "err" ? "text-red-700" : "text-[color:var(--msg-navy)]"}>
              {segment.text}
            </span>
          ))}
        </pre>

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
