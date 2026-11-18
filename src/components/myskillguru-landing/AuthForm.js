"use client";
import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Spinner from "@/components/ui/Spinner";
import { BRAND, ROUTES, THEME_VARS } from "./tokens";

// Shared building blocks for the public login / register pages, so both look
// and behave identically and neither repeats ~60 lines of inline styling.

/** Page background + centered card with the logo and a one-line subtitle. */
export function AuthShell({ subtitle, children }) {
  return (
    <div
      style={THEME_VARS}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[color:var(--msg-wash)] to-white p-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-[color:var(--msg-orange)]/10 blur-[110px]"
      />
      <main className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[color:var(--msg-line)] bg-white shadow-[0_30px_80px_rgba(15,39,72,0.12)]">
        <div className="h-1 w-full bg-gradient-to-r from-[color:var(--msg-blue)] via-[color:var(--msg-orange)] to-[color:var(--msg-gold)]" />
        <div className="px-6 py-8 sm:px-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <Link href={ROUTES.home} aria-label={`${BRAND.name} home`}>
              <Image
                src="/pics/Logo17.png"
                alt={BRAND.name}
                width={196}
                height={74}
                priority
                className="h-14 w-auto object-contain sm:h-16"
              />
            </Link>
            <p className="mt-2 text-sm font-medium text-[color:var(--msg-muted)]">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function ErrorAlert({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
      {children}
    </div>
  );
}

/**
 * Labelled input with a leading icon. `password` adds a show/hide toggle.
 * Extra props (autoComplete, minLength, placeholder…) go to the <input>.
 */
export function Field({ label, icon: Icon, name, type = "text", password = false, ...inputProps }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const inputType = password ? (visible ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wider text-[color:var(--msg-muted)]">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--msg-muted)]"
        />
        <input
          id={id}
          name={name}
          type={inputType}
          required
          {...inputProps}
          className={`w-full rounded-xl border border-[color:var(--msg-line)] bg-[color:var(--msg-wash)] py-3.5 pl-11 text-sm text-[color:var(--msg-navy)] outline-none transition placeholder:text-slate-400 focus:border-[color:var(--msg-orange)] focus:bg-white focus:ring-2 focus:ring-[color:var(--msg-orange)]/30 ${
            password ? "pr-12" : "pr-4"
          }`}
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[color:var(--msg-muted)] hover:text-[color:var(--msg-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--msg-navy)]"
          >
            {visible ? <IconEye size={18} aria-hidden="true" /> : <IconEyeOff size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}

export function SubmitButton({ busy, busyLabel, children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-2 w-full rounded-xl bg-[color:var(--msg-orange)] py-3.5 text-sm font-bold text-[color:var(--msg-navy)] shadow-[0_8px_24px_rgba(242,140,40,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--msg-navy)]"
    >
      {busy ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner className="h-4 w-4" /> {busyLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/** "Already have an account? Log in" style footer line. */
export function SwitchAuthLink({ text, href, label }) {
  return (
    <p className="mt-6 text-center text-xs text-[color:var(--msg-muted)]">
      {text}{" "}
      <Link href={href} className="font-bold text-[color:var(--msg-orange-deep)] hover:underline">
        {label}
      </Link>
    </p>
  );
}
