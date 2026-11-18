"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { IconPlayerPlayFilled, IconPlayerStopFilled, IconRefresh } from "@tabler/icons-react";
import OutputPanel from "@/components/code-lab/OutputPanel";
import { THEME_VARS } from "@/components/myskillguru-landing/tokens";
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_IDS, LIMITS } from "@/lib/code-runner/config";
import { loadDraft, loadLanguage, saveDraft, saveLanguage } from "@/lib/code-runner/drafts";
import { useCodeRunner } from "@/lib/code-runner/useCodeRunner";

// CodeMirror is browser-only and only needed where a workspace is shown.
const CodeEditor = dynamic(() => import("@/components/code-lab/CodeEditor"), {
  ssr: false,
  loading: () => <div className="h-[360px] animate-pulse rounded-xl bg-slate-100" aria-hidden="true" />,
});

const starterDrafts = () =>
  Object.fromEntries(LANGUAGE_IDS.map((id) => [id, { code: LANGUAGES[id].starter, stdin: LANGUAGES[id].defaultStdin }]));

const BUTTON =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--msg-navy)]";

/**
 * The complete editor + input + output experience, used by the Code Lab page
 * and embedded in lessons.
 *
 * @param {string}  [initialLanguage] Start in this language and don't restore/remember the
 *                                    last-used one (embedded use). Omit on the Code Lab page.
 * @param {boolean} [compact]         Shorter editor, for embedding.
 */
export default function CodeLabWorkspace({ initialLanguage, compact = false }) {
  const pinned = LANGUAGE_IDS.includes(initialLanguage);
  const [language, setLanguage] = useState(pinned ? initialLanguage : DEFAULT_LANGUAGE);
  const [drafts, setDrafts] = useState(starterDrafts);
  const [hydrated, setHydrated] = useState(false);
  const runner = useCodeRunner();
  const uid = useId();

  // Always holds the newest drafts, even before React re-renders. Running right
  // after typing (Ctrl+Enter) must execute what is in the editor, not the
  // previous render's value.
  const draftsRef = useRef(drafts);
  const commit = useCallback((next) => {
    draftsRef.current = next;
    setDrafts(next);
  }, []);

  const draft = drafts[language];
  const busy = runner.status === "starting" || runner.status === "running";

  // Restore saved drafts once on the client (localStorage doesn't exist on the server).
  useEffect(() => {
    const next = { ...draftsRef.current };
    for (const id of LANGUAGE_IDS) next[id] = loadDraft(id) ?? next[id];
    commit(next);
    if (!pinned) {
      const lastLanguage = loadLanguage();
      if (LANGUAGE_IDS.includes(lastLanguage)) setLanguage(lastLanguage);
    }
    setHydrated(true);
  }, [commit, pinned]);

  // Debounced save. Skipped until hydration so the starter never overwrites a saved draft.
  useEffect(() => {
    if (!hydrated) return undefined;
    const timer = setTimeout(() => {
      saveDraft(language, drafts[language]);
      if (!pinned) saveLanguage(language);
    }, 400);
    return () => clearTimeout(timer);
  }, [drafts, language, hydrated, pinned]);

  const update = useCallback(
    (patch) => {
      const current = draftsRef.current;
      commit({ ...current, [language]: { ...current[language], ...patch } });
    },
    [language, commit],
  );

  // Also bound to Ctrl/Cmd+Enter: pressing it during a run restarts the program.
  const handleRun = useCallback(() => {
    const { code, stdin } = draftsRef.current[language];
    runner.run({ language, code, stdin });
  }, [runner, language]);

  const handleLanguage = (id) => {
    if (id === language) return;
    runner.reset(); // stop any run and clear the previous language's output
    setLanguage(id);
  };

  const handleReset = () => {
    const starter = LANGUAGES[language].starter;
    if (draft.code === starter || window.confirm("Replace your code with the starter example?")) {
      update({ code: starter, stdin: LANGUAGES[language].defaultStdin });
    }
  };

  // Ctrl/Cmd + Enter runs. Captured before CodeMirror so it doesn't insert a blank line.
  const handleKeyDownCapture = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleRun();
    }
  };

  return (
    <div style={THEME_VARS} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Language" className="inline-flex rounded-xl border border-[color:var(--msg-line)] bg-white p-1">
          {LANGUAGE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={id === language}
              onClick={() => handleLanguage(id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-bold transition ${
                id === language
                  ? "bg-[color:var(--msg-navy)] text-white"
                  : "text-[color:var(--msg-muted)] hover:text-[color:var(--msg-navy)]"
              }`}
            >
              {LANGUAGES[id].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className={`${BUTTON} border border-[color:var(--msg-line)] bg-white text-[color:var(--msg-navy)] hover:border-[color:var(--msg-blue)]`}
          >
            <IconRefresh size={16} aria-hidden="true" /> Reset
          </button>
          {busy ? (
            <button type="button" onClick={runner.stop} className={`${BUTTON} bg-red-600 text-white hover:bg-red-700`}>
              <IconPlayerStopFilled size={16} aria-hidden="true" /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRun}
              className={`${BUTTON} bg-[color:var(--msg-orange)] text-[color:var(--msg-navy)] shadow-[0_8px_24px_rgba(242,140,40,0.28)] hover:brightness-105`}
            >
              <IconPlayerPlayFilled size={16} aria-hidden="true" /> Run
              <kbd className="hidden rounded bg-white/50 px-1.5 text-[10px] font-semibold sm:inline">Ctrl ⏎</kbd>
            </button>
          )}
        </div>
      </div>

      <div
        role="group"
        aria-label={`${LANGUAGES[language].label} code editor`}
        onKeyDownCapture={handleKeyDownCapture}
        className="overflow-hidden rounded-2xl border border-[color:var(--msg-line)] bg-white"
      >
        <CodeEditor
          key={language}
          language={language}
          value={draft.code}
          height={compact ? "260px" : "360px"}
          onChange={(code) => update({ code })}
        />
      </div>

      <div className={compact ? "grid gap-5" : "grid gap-5 lg:grid-cols-[1fr_2fr]"}>
        <section aria-labelledby={`${uid}-input`} className="rounded-2xl border border-[color:var(--msg-line)] bg-white">
          <header className="border-b border-[color:var(--msg-line)] px-4 py-2.5">
            <h2 id={`${uid}-input`} className="text-xs font-bold uppercase tracking-wider text-[color:var(--msg-muted)]">
              Input
            </h2>
          </header>
          <div className="p-3">
            <label htmlFor={`${uid}-stdin`} className="sr-only">
              Program input, one value per line
            </label>
            <textarea
              id={`${uid}-stdin`}
              data-testid="stdin"
              value={draft.stdin}
              maxLength={LIMITS.maxStdinChars}
              onChange={(e) => update({ stdin: e.target.value })}
              rows={compact ? 3 : 5}
              spellCheck={false}
              placeholder="One value per line. Each input() call reads the next line."
              className="w-full resize-y rounded-xl border border-[color:var(--msg-line)] bg-[color:var(--msg-wash)] p-3 font-mono text-[13px] text-[color:var(--msg-navy)] outline-none focus:border-[color:var(--msg-orange)] focus:ring-2 focus:ring-[color:var(--msg-orange)]/30"
            />
          </div>
        </section>

        <OutputPanel
          status={runner.status}
          segments={runner.segments}
          durationMs={runner.durationMs}
          error={runner.error}
          language={language}
        />
      </div>
    </div>
  );
}
