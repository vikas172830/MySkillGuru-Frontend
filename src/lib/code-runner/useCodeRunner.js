"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { LANGUAGES, LIMITS } from "./config";
import { buildSandboxHtml } from "./sandbox";

const IDLE = { status: "idle", segments: [], durationMs: null, error: null };

/**
 * Runs learner code in a sandboxed iframe (see sandbox.js for the isolation
 * model) and exposes the run as React state.
 *
 *   const { status, segments, durationMs, error, run, stop, reset } = useCodeRunner();
 *   run({ language: "python", code, stdin })
 *
 * status: idle | starting | running | done | failed | timeout | stopped
 * segments: [{ stream: "out" | "err", text }] — consecutive same-stream output is merged.
 */
export function useCodeRunner() {
  const [state, setState] = useState(IDLE);

  const frameRef = useRef(null); // { iframe, loaded: Promise<void> }
  const runRef = useRef(null); // the active run, or null
  const idRef = useRef(0);
  const bufferRef = useRef({ segments: [], chars: 0, raf: 0 });

  const destroyFrame = useCallback(() => {
    frameRef.current?.iframe.remove(); // removing the iframe kills its workers
    frameRef.current = null;
  }, []);

  const ensureFrame = useCallback(() => {
    if (frameRef.current) return frameRef.current;
    const iframe = document.createElement("iframe");
    // No allow-same-origin => opaque origin: no cookies/storage/parent access.
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.title = "Code runner sandbox";
    // Not display:none — hidden frames can have their timers throttled.
    iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    const loaded = new Promise((resolve) => iframe.addEventListener("load", resolve, { once: true }));
    iframe.srcdoc = buildSandboxHtml();
    document.body.appendChild(iframe);
    frameRef.current = { iframe, loaded };
    return frameRef.current;
  }, []);

  const flushOutput = useCallback(() => {
    const buffer = bufferRef.current;
    buffer.raf = 0;
    setState((s) => ({ ...s, segments: [...buffer.segments] }));
  }, []);

  const appendOutput = useCallback(
    (stream, text) => {
      const buffer = bufferRef.current;
      const last = buffer.segments[buffer.segments.length - 1];
      if (last && last.stream === stream) last.text += text;
      else buffer.segments.push({ stream, text });
      buffer.chars += text.length;
      // Batch bursts of output into one render per animation frame.
      if (!buffer.raf) buffer.raf = requestAnimationFrame(flushOutput);
    },
    [flushOutput],
  );

  const endRun = useCallback(
    (status, error = null) => {
      const active = runRef.current;
      if (!active) return;
      clearTimeout(active.loadTimer);
      clearTimeout(active.runTimer);
      runRef.current = null;

      const buffer = bufferRef.current;
      cancelAnimationFrame(buffer.raf);
      buffer.raf = 0;
      const durationMs = active.startedAt ? Math.round(performance.now() - active.startedAt) : null;
      setState({ status, segments: [...buffer.segments], durationMs, error });
    },
    [],
  );

  /** Kill the sandbox (and with it any runaway program), then finish the run. */
  const terminate = useCallback(
    (status, error = null) => {
      destroyFrame();
      endRun(status, error);
    },
    [destroyFrame, endRun],
  );

  const run = useCallback(
    async ({ language, code, stdin = "" }) => {
      const config = LANGUAGES[language];
      if (!config) return;
      if (runRef.current) terminate("stopped");

      if (code.length > LIMITS.maxCodeChars) {
        setState({ ...IDLE, status: "failed", error: "Your code is too long to run (limit: 100,000 characters)." });
        return;
      }

      const active = { id: ++idRef.current, startedAt: null, loadTimer: 0, runTimer: 0 };
      runRef.current = active;
      bufferRef.current = { segments: [], chars: 0, raf: 0 };
      setState({ status: "starting", segments: [], durationMs: null, error: null });

      active.loadTimer = setTimeout(
        () => terminate("timeout", `The ${config.label} runtime took too long to start. Check your connection and try again.`),
        LIMITS.loadMs,
      );

      const frame = ensureFrame();
      await frame.loaded;
      if (runRef.current !== active) return; // stopped while the frame was loading

      frame.iframe.contentWindow.postMessage(
        { type: "run", runId: active.id, language, code, stdin: stdin.slice(0, LIMITS.maxStdinChars) },
        "*", // the sandbox has an opaque origin; the payload is just the learner's own code
      );
    },
    [ensureFrame, terminate],
  );

  const stop = useCallback(() => terminate("stopped"), [terminate]);

  const reset = useCallback(() => {
    if (runRef.current) terminate("stopped");
    setState(IDLE);
  }, [terminate]);

  // Messages from the sandbox.
  useEffect(() => {
    const onMessage = (event) => {
      const frame = frameRef.current;
      const active = runRef.current;
      if (!frame || !active || event.source !== frame.iframe.contentWindow) return;
      const message = event.data;
      if (!message || message.runId !== active.id) return;

      switch (message.type) {
        case "started":
          clearTimeout(active.loadTimer);
          active.startedAt = performance.now();
          setState((s) => ({ ...s, status: "running" }));
          active.runTimer = setTimeout(
            () =>
              terminate(
                "timeout",
                `Stopped: your program ran for more than ${LIMITS.runMs / 1000} seconds. It may contain an infinite loop.`,
              ),
            LIMITS.runMs,
          );
          break;
        case "out":
        case "err":
          appendOutput(message.type, String(message.text));
          if (bufferRef.current.chars > LIMITS.maxOutputChars) {
            terminate("failed", "Output limit reached, so your program was stopped.");
          }
          break;
        case "done":
          endRun(message.ok ? "done" : "failed", message.error || null);
          break;
        default:
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      const active = runRef.current;
      if (active) {
        clearTimeout(active.loadTimer);
        clearTimeout(active.runTimer);
        runRef.current = null;
      }
      cancelAnimationFrame(bufferRef.current.raf);
      destroyFrame();
    };
  }, [appendOutput, destroyFrame, endRun, terminate]);

  return { ...state, run, stop, reset };
}
