"use client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

// Created once so the editor isn't reconfigured on every render.
const EXTENSIONS = {
  python: [python()],
  javascript: [javascript()],
};

const SETUP = { foldGutter: false, highlightActiveLine: true };

// Loaded with next/dynamic (ssr: false) from the page: CodeMirror is
// browser-only and the Code Lab is the only screen that needs it.
export default function CodeEditor({ language, value, onChange, height = "360px" }) {
  return (
    <CodeMirror
      value={value}
      height={height}
      theme="light"
      extensions={EXTENSIONS[language]}
      basicSetup={SETUP}
      onChange={onChange}
    />
  );
}
