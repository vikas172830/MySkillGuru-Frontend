import { IconCheck, IconSparkles } from "@tabler/icons-react";
import AuthCtas from "./AuthCtas";
import Reveal from "./Reveal";

// Illustrative only — makes the product tangible without screenshots or
// invented numbers. Clearly labelled "Sample".
const SAMPLE_WEEKS = [
  { week: "Week 1", title: "Variables & data types", state: "done" },
  { week: "Week 2", title: "Loops & functions", state: "done" },
  { week: "Week 3", title: "Lists & dictionaries", state: "current" },
  { week: "Week 4", title: "Mini project & mock test", state: "todo" },
];

function RoadmapPreview() {
  return (
    <figure
      className="relative w-full max-w-md rounded-3xl border border-[color:var(--msg-line)] bg-white p-5 shadow-[0_24px_60px_rgba(15,39,72,0.12)]"
      aria-label="Sample roadmap preview"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--msg-muted)]">Your roadmap</p>
          <p className="mt-0.5 text-base font-black text-[color:var(--msg-navy)]">Python for beginners</p>
        </div>
        <span className="rounded-full bg-[color:var(--msg-warm)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--msg-orange-deep)] ring-1 ring-[color:var(--msg-gold)]/40">
          Sample
        </span>
      </div>

      <ol className="space-y-2.5">
        {SAMPLE_WEEKS.map((w) => (
          <li
            key={w.week}
            className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${
              w.state === "current"
                ? "border-[color:var(--msg-orange)] bg-[color:var(--msg-warm)]"
                : "border-[color:var(--msg-line)] bg-[color:var(--msg-wash)]"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                w.state === "done"
                  ? "bg-[color:var(--msg-blue)] text-white"
                  : w.state === "current"
                  ? "bg-[color:var(--msg-orange)] text-[color:var(--msg-navy)]"
                  : "bg-white text-[color:var(--msg-muted)] ring-1 ring-[color:var(--msg-line)]"
              }`}
            >
              {w.state === "done" ? <IconCheck size={14} aria-hidden="true" /> : w.week.replace("Week ", "")}
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold text-[color:var(--msg-muted)]">{w.week}</span>
              <span className="block truncate text-sm font-bold text-[color:var(--msg-navy)]">{w.title}</span>
            </span>
          </li>
        ))}
      </ol>

      <figcaption className="mt-4 flex items-center gap-2 text-xs text-[color:var(--msg-muted)]">
        <IconSparkles size={14} className="text-[color:var(--msg-orange-deep)]" aria-hidden="true" />
        Built by AI from your subject, goal and pace.
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-[color:var(--msg-wash)] to-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[color:var(--msg-orange)]/10 blur-[110px]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Reveal>
          <p className="inline-flex items-center rounded-full border border-[color:var(--msg-line)] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--msg-blue)]">
            The Personal Learning Assistant
          </p>
          <h1
            id="hero-title"
            className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-[color:var(--msg-navy)] sm:text-5xl lg:text-[3.4rem]"
          >
            Learn any skill with a plan built{" "}
            <span className="text-[color:var(--msg-orange-deep)]">just for you.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--msg-muted)] sm:text-lg">
            Tell MySkillsGuru what you want to learn. Get a week-by-week roadmap, help with homework, AI-made notes and
            practice tests that show you what to revisit next.
          </p>
          <AuthCtas className="mt-7" />
        </Reveal>

        <Reveal delay={0.12} className="flex justify-center lg:justify-end">
          <RoadmapPreview />
        </Reveal>
      </div>
    </section>
  );
}
