import Header from "@/components/myskillguru-landing/Header";
import Hero from "@/components/myskillguru-landing/Hero";
import { ComingSoon, Features, HowItWorks } from "@/components/myskillguru-landing/Sections";
import Faq from "@/components/myskillguru-landing/Faq";
import { Footer, FinalCta } from "@/components/myskillguru-landing/Footer";
import { THEME_VARS } from "@/components/myskillguru-landing/tokens";

// Public landing page (no auth guard — see layout.js). A server component:
// only the interactive pieces (Header, AuthCtas, Reveal, Faq) are client
// components, so the rest ships as plain HTML.
export default function MySkillsGuruLanding() {
  return (
    <div style={THEME_VARS} className="bg-white text-[color:var(--msg-navy)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <ComingSoon />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
