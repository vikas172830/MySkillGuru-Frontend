// Per-language drafts kept in localStorage so a refresh never loses the
// learner's code. Every access is wrapped: storage can be blocked or full
// (private windows, cleared site data) and the Code Lab must still work.

const key = (language) => `msg:code-lab:v1:${language}`;

export function loadDraft(language) {
  try {
    const raw = localStorage.getItem(key(language));
    const draft = raw ? JSON.parse(raw) : null;
    if (draft && typeof draft.code === "string") {
      return { code: draft.code, stdin: typeof draft.stdin === "string" ? draft.stdin : "" };
    }
  } catch (_) {
    /* unavailable or corrupt: fall back to the starter */
  }
  return null;
}

export function saveDraft(language, draft) {
  try {
    localStorage.setItem(key(language), JSON.stringify(draft));
  } catch (_) {
    /* ignore: persistence is a convenience only */
  }
}

const LANGUAGE_KEY = "msg:code-lab:v1:language";

/** The language the learner was last using, or null. */
export function loadLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY);
  } catch (_) {
    return null;
  }
}

export function saveLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (_) {
    /* ignore */
  }
}
