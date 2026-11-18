// Single source of truth for the MySkillsGuru landing page: brand name, routes
// and the palette (taken from the real logo — navy, orange, gold).
//
// NOTE: the display brand is "MySkillsGuru" (as in the logo). Routes and
// backend identifiers deliberately stay "myskillguru" — renaming those is a
// breaking change (URLs, DB field `hasMySkillGuruAccess`), not a copy edit.

export const BRAND = {
  name: "MySkillsGuru",
  tagline: "The Personal Learning Assistant",
};

export const ROUTES = {
  home: "/myskillguru",
  login: "/myskillguru/login",
  register: "/myskillguru/register",
  dashboard: "/self-learner/dashboard",
};

// Applied as CSS variables on the page root, used via Tailwind arbitrary
// values such as `text-[color:var(--msg-navy)]`.
// Contrast (WCAG): navy on white 14:1, muted on white 6.4:1, navy on orange 6.2:1.
export const THEME_VARS = {
  "--msg-navy": "#0F2748",
  "--msg-blue": "#17407A",
  "--msg-orange": "#F28C28",
  "--msg-orange-deep": "#C2570C",
  "--msg-gold": "#D9A441",
  "--msg-muted": "#506279",
  "--msg-line": "#E3EAF2",
  "--msg-wash": "#F6F9FC",
  "--msg-warm": "#FFF8EE",
};
