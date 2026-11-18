"use client";
import { useId, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

const FAQS = [
  {
    q: "Do I need an account?",
    a: "Yes. Create an account to keep your own roadmaps, notes and test history. Sign-up takes a minute and you can log in straight away.",
  },
  {
    q: "How does the AI build my roadmap?",
    a: "You tell it the subject, your goal and your pace. It lays out a week-by-week plan broken into topics, so you always know what to study next.",
  },
  {
    q: "Does homework help just give me the answers?",
    a: "You get worked solutions and structured notes from the problem or material you upload. They're meant to help you understand the topic, not just hand you a finished answer sheet.",
  },
  {
    q: "What can I study?",
    a: "Whatever you're working on. The roadmap adapts to the subject and goal you give it.",
  },
  {
    q: "How are practice tests made?",
    a: "Tests are generated from what you're currently studying, and you get feedback as soon as you finish so you know what to revisit.",
  },
  {
    q: "When is the code compiler coming?",
    a: "It's in the works. We'll announce it here and inside the app when it's ready.",
  },
];

function Item({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const panelId = `${uid}-panel`;
  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--msg-line)] bg-white">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--msg-navy)]"
        >
          <span className="text-sm font-bold text-[color:var(--msg-navy)] sm:text-base">{q}</span>
          <IconChevronDown
            size={18}
            aria-hidden="true"
            className={`shrink-0 text-[color:var(--msg-orange-deep)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div id={panelId} role="region" hidden={!open} className="px-5 pb-5">
        <p className="text-sm leading-relaxed text-[color:var(--msg-muted)]">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-[color:var(--msg-wash)] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--msg-orange-deep)]">FAQ</p>
          <h2 id="faq-title" className="mt-2 text-2xl font-black tracking-tight text-[color:var(--msg-navy)] sm:text-3xl">
            Questions, answered
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
