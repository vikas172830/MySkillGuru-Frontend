import CodeLabWorkspace from "@/components/code-lab/CodeLabWorkspace";
import { THEME_VARS } from "@/components/myskillguru-landing/tokens";

export const metadata = {
  title: "Code Lab — MySkillsGuru",
  description: "Write and run Python or JavaScript right in your browser.",
};

export default function CodeLabPage() {
  return (
    <div style={THEME_VARS} className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[color:var(--msg-navy)]">Code Lab</h1>
        <p className="mt-1 text-sm text-[color:var(--msg-muted)]">
          Write and run Python or JavaScript right in your browser. Your code runs on your own device in a sandbox,
          never on our servers.
        </p>
      </header>
      <CodeLabWorkspace />
    </div>
  );
}
