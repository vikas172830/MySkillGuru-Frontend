import "../globals.css";

export const metadata = {
  title: "MySkillsGuru — The Personal Learning Assistant",
  description:
    "Learn any skill with a plan built just for you: AI week-by-week roadmaps, homework help, AI notes and practice tests.",
  openGraph: {
    title: "MySkillsGuru — The Personal Learning Assistant",
    description:
      "AI week-by-week roadmaps, homework help, AI notes and practice tests for self-paced learning.",
    type: "website",
    images: ["/pics/Logo17.png"],
  },
};

// Public section: the landing, login and register pages under /myskillguru
// need no session (see PUBLIC_ROUTE_PREFIXES in ProtectedRoute). After login
// users land on /self-learner/dashboard, which has its own guard and layout.
export default function MySkillsGuruLayout({ children }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
