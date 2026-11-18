// Languages the Code Lab can run, and the safety limits applied to every run.
// To add a language, add an entry here and a matching runtime in sandbox.js
// (or, for server-side languages like C++/Java, a hosted-runner adapter).

export const LANGUAGES = {
  python: {
    id: "python",
    label: "Python",
    // Version note: runs on Pyodide (CPython compiled to WebAssembly).
    starter: `# Welcome to the Code Lab!
name = input("What's your name? ")
print(f"Hello, {name}!")

for i in range(1, 4):
    print(i, "squared is", i * i)
`,
    defaultStdin: "Learner",
  },
  javascript: {
    id: "javascript",
    label: "JavaScript",
    starter: `// Welcome to the Code Lab!
// input() reads the next line from the Input box.
const name = input() ?? "friend";
console.log(\`Hello, \${name}!\`);

for (let i = 1; i <= 3; i++) {
  console.log(i, "squared is", i * i);
}
`,
    defaultStdin: "Learner",
  },
};

export const LANGUAGE_IDS = Object.keys(LANGUAGES);
export const DEFAULT_LANGUAGE = "python";

export const LIMITS = {
  /** Max time user code may run once it has started (stops infinite loops). */
  runMs: 10_000,
  /** Max time to download/initialise a runtime (Python is ~10 MB on first use). */
  loadMs: 90_000,
  /** Output beyond this is cut and the run is stopped (prevents UI freezes). */
  maxOutputChars: 100_000,
  maxCodeChars: 100_000,
  maxStdinChars: 10_000,
};

/** Pyodide release the Python runtime is loaded from (pinned for stability). */
export const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
