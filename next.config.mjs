import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev server only: Next 16 blocks hot-reload/hydration requests from any origin
  // other than "localhost", so a page opened via 127.0.0.1 would never become
  // interactive. No effect on production builds.
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  images: {
    remotePatterns: [{ protocol: "https", hostname: "assets.aceternity.com" }],
  },

  // Next 16 no longer reads an `eslint` key from this file (the old
  // `ignoreDuringBuilds` was a silent no-op). Lint separately: `npm run lint`.

  async redirects() {
    return [
      // This app is MySkillsGuru only; the root URL goes to its landing page
      // (a real server redirect, so crawlers and bookmarks follow it).
      { source: "/", destination: "/myskillguru", permanent: false },
      // The brand is spelled "MySkillsGuru" (with an s) in the logo, so people
      // will type that. The canonical route stays /myskillguru.
      { source: "/myskillsguru", destination: "/myskillguru", permanent: false },
      { source: "/myskillsguru/:path*", destination: "/myskillguru/:path*", permanent: false },
    ];
  },

  async rewrites() {
    // Resolved ONCE at build time and frozen into routes-manifest.json (see
    // the API_URL env var at build). Default is the MySkillGuru
    // backend (5051) — NOT the LMS backend (8000/5050).
    const API_URL = process.env.API_URL || "http://127.0.0.1:5051";
    return [
      // Exact base path: /:path* does not match zero segments in Next.js,
      // so GET /api/self-learner/roadmap and POST /api/self-learner/roadmap
      // require this explicit rule.
      {
        source: "/api/self-learner/roadmap",
        destination: `${API_URL}/api/self-learner/roadmap`,
      },
      // Sub-paths: preserves the /api prefix, which this router is mounted under.
      {
        source: "/api/self-learner/roadmap/:path*",
        destination: `${API_URL}/api/self-learner/roadmap/:path*`,
      },
      // Self-learner course material upload (roadmap-creation grounding) —
      // its own router is registered WITH an /api/self-learner/course-material
      // prefix, same reasoning as the roadmap rule above. Exact base path
      // needed too: POST /api/self-learner/course-material has zero extra
      // segments, which :path* does not match on its own.
      {
        source: "/api/self-learner/course-material",
        destination: `${API_URL}/api/self-learner/course-material`,
      },
      {
        source: "/api/self-learner/course-material/:path*",
        destination: `${API_URL}/api/self-learner/course-material/:path*`,
      },
      // ai_tutor.py's router is also registered WITH an /api/ai-tutor prefix
      // (unlike most other routers, which mount at root) — same reasoning
      // as the roadmap rule above, must come before the generic catch-all.
      {
        source: "/api/ai-tutor/:path*",
        destination: `${API_URL}/api/ai-tutor/:path*`,
      },
      // All other API calls: strips the /api prefix — these routers mount at root.
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },

};

export default withNextIntl(nextConfig);
