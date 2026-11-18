"use client";
import { useContext } from "react";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { AuthContext } from "@/app/AuthContext";
import { ROUTES } from "./tokens";

const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold " +
  "bg-[color:var(--msg-orange)] text-[color:var(--msg-navy)] shadow-[0_8px_24px_rgba(242,140,40,0.28)] " +
  "transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[color:var(--msg-navy)]";
const SECONDARY =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold " +
  "border border-[color:var(--msg-line)] bg-white text-[color:var(--msg-navy)] transition hover:border-[color:var(--msg-blue)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--msg-navy)]";

// Learners who are already signed in get a dashboard button instead of
// sign-up/login. Until the session check finishes we show the default pair
// (no layout shift).
export default function AuthCtas({ primaryLabel = "Get started", className = "" }) {
  const auth = useContext(AuthContext);
  const isLearner = auth?.user?.role === 7;

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
      {isLearner ? (
        <Link href={ROUTES.dashboard} className={PRIMARY}>
          Open dashboard <IconArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <>
          <Link href={ROUTES.register} className={PRIMARY}>
            {primaryLabel} <IconArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href={ROUTES.login} className={SECONDARY}>
            I already have an account
          </Link>
        </>
      )}
    </div>
  );
}
