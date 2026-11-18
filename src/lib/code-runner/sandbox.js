// The code that actually executes learner programs.
//
// Isolation model (defence in depth):
//   1. The page hosts a hidden <iframe sandbox="allow-scripts" srcdoc=...>.
//      Without `allow-same-origin` it gets an opaque origin: no cookies, no
//      localStorage, no access to the parent page or the app's /api.
//   2. Inside that iframe, each language runs in a Web Worker, so a busy loop
//      never blocks the UI thread.
//   3. The parent kills the whole iframe if a run exceeds its time limit.
//
// The functions below are serialised with Function#toString() and run inside
// the frame/workers, so each must be fully SELF-CONTAINED (no references to
// anything outside its own body).
import { PYODIDE_INDEX_URL } from "./config";

/** Runs inside a Worker. Loads Pyodide once, then runs each program in a fresh namespace. */
function pythonWorker(cfg) {
  let loading = null;
  const load = () => {
    if (!loading) {
      loading = (async () => {
        importScripts(cfg.indexURL + "pyodide.js");
        return await loadPyodide({ indexURL: cfg.indexURL });
      })();
      loading.catch(() => {
        loading = null; // allow a retry on the next run
      });
    }
    return loading;
  };

  // Keep only the learner's part of a Python traceback (drop Pyodide internals).
  const cleanTraceback = (message) => {
    const i = message.indexOf('File "<exec>"');
    return i >= 0 ? "Traceback (most recent call last):\n  " + message.slice(i) : message;
  };

  self.onmessage = async ({ data }) => {
    let py;
    try {
      py = await load();
    } catch (e) {
      postMessage({
        type: "done",
        ok: false,
        error: "Could not load the Python runtime. Check your connection and try again.",
      });
      return;
    }

    const lines = String(data.stdin || "").split("\n");
    if (lines.length && lines[lines.length - 1] === "") lines.pop();
    let next = 0;
    py.setStdin({ stdin: () => (next < lines.length ? lines[next++] : undefined) });
    py.setStdout({ batched: (text) => postMessage({ type: "out", text: text + "\n" }) });
    py.setStderr({ batched: (text) => postMessage({ type: "err", text: text + "\n" }) });

    const globals = py.globals.get("dict")();
    try {
      // Download any scientific packages the program imports (numpy, pandas...).
      await py.loadPackagesFromImports(data.code);
      postMessage({ type: "started" }); // the run timer starts here, after loading
      await py.runPythonAsync(data.code, { globals });
      postMessage({ type: "done", ok: true });
    } catch (e) {
      postMessage({ type: "err", text: cleanTraceback(String((e && e.message) || e)) + "\n" });
      postMessage({ type: "done", ok: false });
    } finally {
      try {
        globals.destroy();
      } catch (_) {
        /* already released */
      }
    }
  };
}

/** Runs inside a Worker. A fresh worker is created for every JavaScript run. */
function javascriptWorker() {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  const show = (value) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.stack || String(value);
    if (typeof value === "object" && value !== null) {
      try {
        return JSON.stringify(value, null, 2);
      } catch (_) {
        return String(value);
      }
    }
    return String(value);
  };

  // Learner code has no business making network calls or spawning workers.
  for (const name of [
    "fetch", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts",
    "indexedDB", "caches", "Worker", "SharedWorker", "BroadcastChannel",
  ]) {
    try {
      Object.defineProperty(self, name, { value: undefined, configurable: true });
    } catch (_) {
      /* not defined in this environment */
    }
  }

  self.onmessage = async ({ data }) => {
    const out = (type) => (...args) => postMessage({ type, text: args.map(show).join(" ") + "\n" });
    const console = { log: out("out"), info: out("out"), debug: out("out"), warn: out("err"), error: out("err") };

    const lines = String(data.stdin || "").split("\n");
    if (lines.length && lines[lines.length - 1] === "") lines.pop();
    let next = 0;
    const input = () => (next < lines.length ? lines[next++] : null);

    postMessage({ type: "started" });
    try {
      await new AsyncFunction("console", "input", '"use strict";\n' + data.code)(console, input);
      postMessage({ type: "done", ok: true });
    } catch (e) {
      postMessage({ type: "err", text: show(e) + "\n" });
      postMessage({ type: "done", ok: false });
    }
  };
}

/** Runs in the sandboxed iframe's main thread: relays runs to workers and messages back to the page. */
function frameMain(sources) {
  const FRESH_WORKER_PER_RUN = { javascript: true };
  const urls = {};
  const workers = {};

  const post = (message) => parent.postMessage(message, "*");
  const urlFor = (language) =>
    (urls[language] ||= URL.createObjectURL(new Blob([sources[language]], { type: "text/javascript" })));

  window.addEventListener("message", (event) => {
    if (event.source !== parent) return;
    const message = event.data;
    if (!message || message.type !== "run" || !Object.prototype.hasOwnProperty.call(sources, message.language)) {
      return;
    }

    const { runId, language } = message;
    let worker = workers[language];
    if (!worker || FRESH_WORKER_PER_RUN[language]) {
      if (worker) worker.terminate();
      worker = new Worker(urlFor(language));
      workers[language] = worker;
    }

    worker.onmessage = (e) => post({ ...e.data, runId });
    worker.onerror = (e) => {
      e.preventDefault();
      post({ type: "done", ok: false, error: e.message || "The program crashed.", runId });
    };
    worker.postMessage({ code: message.code, stdin: message.stdin });
  });
}

/** The full HTML document loaded into the sandboxed iframe. */
export function buildSandboxHtml() {
  const sources = {
    python: `(${pythonWorker})(${JSON.stringify({ indexURL: PYODIDE_INDEX_URL })})`,
    javascript: `(${javascriptWorker})()`,
  };
  const script = `(${frameMain})(${JSON.stringify(sources)})`;
  // "</script" inside the inline script would end it early.
  return `<!doctype html><meta charset="utf-8"><script>${script.replace(/<\/script/gi, "<\\/script")}</script>`;
}
