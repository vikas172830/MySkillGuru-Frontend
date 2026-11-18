import Link from "next/link";
import { IconArrowRight, IconCode, IconSparkles } from "@tabler/icons-react";
import { THEME_VARS } from "@/components/myskillguru-landing/tokens";

export const metadata = {
  title: "Tools — MySkillsGuru",
  description: "Extra tools to practise and learn with.",
};

// Add a tool by adding an entry here; `href` makes it live, no `href` shows "Coming soon".
const TOOLS = [
  {
    id: "code-lab",
    title: "Code Lab",
    description: "Write and run Python or JavaScript right in your browser. No setup, nothing to install.",
    icon: IconCode,
    href: "/self-learner/code-lab",
  },
  {
    id: "more",
    title: "More tools",
    description: "We're building more tools to help you practise and learn. Check back soon.",
    icon: IconSparkles,
  },
];

export default function ToolsPage() {
  return (
    <div style={THEME_VARS} className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[color:var(--msg-navy)]">Tools</h1>
        <p className="mt-1 text-sm text-[color:var(--msg-muted)]">Extra tools to practise and learn with.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map(({ id, title, description, icon: Icon, href }) => {
          const card = (
            <div
              className={`flex h-full flex-col rounded-2xl border border-[color:var(--msg-line)] bg-white p-5 ${
                href ? "transition hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(15,39,72,0.08)]" : "opacity-80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--msg-warm)] text-[color:var(--msg-orange-deep)]">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    href ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {href ? "Available" : "Coming soon"}
                </span>
              </div>
              <h2 className="mt-4 text-base font-bold text-[color:var(--msg-navy)]">{title}</h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[color:var(--msg-muted)]">{description}</p>
              {href && (
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--msg-orange-deep)]">
                  Open <IconArrowRight size={16} aria-hidden="true" />
                </span>
              )}
            </div>
          );

          return (
            <li key={id}>
              {href ? (
                <Link
                  href={href}
                  className="block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--msg-navy)]"
                >
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
