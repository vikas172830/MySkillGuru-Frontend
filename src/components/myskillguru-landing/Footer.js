import Image from "next/image";
import Link from "next/link";
import AuthCtas from "./AuthCtas";
import Reveal from "./Reveal";
import { BRAND, ROUTES } from "./tokens";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-white py-16 sm:py-24">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 id="cta-title" className="text-3xl font-black tracking-tight text-[color:var(--msg-navy)] sm:text-4xl">
          Ready to start learning with a plan?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[color:var(--msg-muted)] sm:text-base">
          Create your account and build your first roadmap.
        </p>
        <AuthCtas className="mt-7 justify-center" primaryLabel="Create your account" />
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[color:var(--msg-navy)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <span className="inline-block rounded-xl bg-white px-3 py-2">
            <Image src="/pics/Logo17.png" alt={BRAND.name} width={196} height={74} className="h-10 w-auto object-contain" />
          </span>
          <p className="max-w-xs text-xs leading-relaxed text-white/70">
            {BRAND.name} — {BRAND.tagline}. Roadmaps, homework help and practice tests for self-paced learning.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-6 text-sm font-semibold">
          <Link href={ROUTES.login} className="text-white/80 hover:text-white">Log in</Link>
          <Link href={ROUTES.register} className="text-white/80 hover:text-white">Create an account</Link>
        </nav>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/60">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  );
}
