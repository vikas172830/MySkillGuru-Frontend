import { IconChartBar, IconChecklist, IconCode, IconRobot, IconTarget } from "@tabler/icons-react";
import Reveal from "./Reveal";

function SectionHeading({ id, eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--msg-orange-deep)]">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl font-black tracking-tight text-[color:var(--msg-navy)] sm:text-3xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-sm leading-relaxed text-[color:var(--msg-muted)] sm:text-base">{children}</p>}
    </div>
  );
}

const FEATURES = [
  {
    icon: IconTarget,
    title: "Personalized roadmaps",
    text: "A week-by-week plan built around your subject, your goal and how much time you have.",
  },
  {
    icon: IconRobot,
    title: "Homework help & AI notes",
    text: "Upload a problem set or study material and get worked solutions or clean, structured notes back.",
  },
  {
    icon: IconChecklist,
    title: "Practice tests",
    text: "Tests generated from what you're studying right now, with feedback as soon as you finish.",
  },
  {
    icon: IconChartBar,
    title: "Progress you can see",
    text: "Review your results and analytics over time, so you know what's solid and what needs another pass.",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="features-title" eyebrow="What you get" title="Everything you need to study with focus">
          One place to plan, learn, practice and track, so you spend your time learning instead of figuring out what to do next.
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={i * 0.07} className="h-full">
                <div className="h-full rounded-2xl border border-[color:var(--msg-line)] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(15,39,72,0.08)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--msg-warm)] text-[color:var(--msg-orange-deep)]">
                    <f.icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[color:var(--msg-navy)]">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--msg-muted)]">{f.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "1", title: "Tell us your goal", text: "Pick a subject and say what you're aiming for: an exam, a skill, or a syllabus to catch up on." },
  { n: "2", title: "Get your roadmap", text: "MySkillsGuru lays out a week-by-week plan, broken into topics you can actually finish." },
  { n: "3", title: "Learn, practice, track", text: "Work through notes, homework help and tests, and watch your progress build up week by week." },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="scroll-mt-20 bg-[color:var(--msg-wash)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="how-title" eyebrow="How it works" title="From “where do I start?” to a clear plan" />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n}>
              <Reveal delay={i * 0.09} className="h-full">
                <div className="h-full rounded-2xl border border-[color:var(--msg-line)] bg-white p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--msg-navy)] text-sm font-black text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[color:var(--msg-navy)]">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--msg-muted)]">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ComingSoon() {
  return (
    <section id="coming-soon" aria-labelledby="soon-title" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[color:var(--msg-navy)] to-[color:var(--msg-blue)] p-7 text-white sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <IconCode size={28} aria-hidden="true" />
              </span>
              <div>
                <span className="inline-block rounded-full bg-[color:var(--msg-orange)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--msg-navy)]">
                  Coming soon
                </span>
                <h2 id="soon-title" className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Write and run code, right next to your roadmap
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                  An online compiler is on its way, so you can practice programming exercises without leaving
                  MySkillsGuru. More learning tools are on the way too.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
