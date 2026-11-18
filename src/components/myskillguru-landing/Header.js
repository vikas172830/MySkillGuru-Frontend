"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "@/app/AuthContext";
import { BRAND, ROUTES } from "./tokens";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#coming-soon", label: "Coming soon" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const auth = useContext(AuthContext);
  const isLearner = auth?.user?.role === 7;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-[color:var(--msg-line)] shadow-[0_6px_20px_rgba(15,39,72,0.06)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href={ROUTES.home} aria-label={`${BRAND.name} home`} className="shrink-0">
          <Image
            src="/pics/Logo17.png"
            alt={BRAND.name}
            width={224}
            height={84}
            priority
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-semibold text-[color:var(--msg-muted)] transition hover:text-[color:var(--msg-navy)]"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLearner ? (
            <Link
              href={ROUTES.dashboard}
              className="rounded-xl bg-[color:var(--msg-navy)] px-4 py-2 text-xs font-bold text-white sm:text-sm"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="px-2 py-2 text-xs font-semibold text-[color:var(--msg-navy)] sm:px-3 sm:text-sm"
              >
                Log in
              </Link>
              <Link
                href={ROUTES.register}
                className="whitespace-nowrap rounded-xl bg-[color:var(--msg-orange)] px-3.5 py-2 text-xs font-bold text-[color:var(--msg-navy)] transition hover:brightness-105 sm:px-4 sm:text-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
