"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ChevronDown, Code2 } from "lucide-react";

// The workspace (editor + sandbox) is heavy, so it only loads once a learner
// actually opens the panel.
const CodeLabWorkspace = dynamic(() => import("@/components/code-lab/CodeLabWorkspace"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-slate-100" aria-hidden="true" />,
});

const JAVASCRIPT_HINT = /\b(javascript|typescript|node(\.?js)?|react|vue|angular|express|js)\b/i;

/** Python is the default; JavaScript when the subject is clearly about the web/JS stack. */
export function guessLanguage(subject = "") {
  return JAVASCRIPT_HINT.test(subject) ? "javascript" : "python";
}

/** Collapsible "try it yourself" panel shown under technology lessons. */
export default function LessonCodePractice({ subject }) {
  const [opened, setOpened] = useState(false);

  return (
    <details
      className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs"
      onToggle={(event) => {
        if (event.currentTarget.open) setOpened(true);
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EEFF] text-[#6C63FF]">
            <Code2 size={18} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Practice</span>
            <span className="mt-0.5 block text-xs font-semibold text-slate-500">
              Try it yourself in the Code Lab, right here.
            </span>
          </span>
        </span>
        <ChevronDown size={16} className="text-[#6C63FF] transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>

      {opened && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <CodeLabWorkspace initialLanguage={guessLanguage(subject)} compact />
        </div>
      )}
    </details>
  );
}
