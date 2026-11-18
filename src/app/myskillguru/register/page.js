"use client";
import { useState } from "react";
import Link from "next/link";
import { IconCircleCheck } from "@tabler/icons-react";
import { Lock, Mail, User } from "lucide-react";
import { AuthShell, ErrorAlert, Field, SubmitButton, SwitchAuthLink } from "@/components/myskillguru-landing/AuthForm";
import { ROUTES } from "@/components/myskillguru-landing/tokens";

export default function MySkillsGuruRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/myskillguru/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          password: form.get("password"),
          role: "self_learner",
        }),
      });
      const data = await response.json();

      if (!response.ok || data?.error) {
        setError(data?.error || "Registration failed. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthShell subtitle="You're all set">
        <div className="flex flex-col items-center py-2 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <IconCircleCheck size={28} aria-hidden="true" />
          </span>
          <p className="text-sm font-bold text-[color:var(--msg-navy)]">Account created</p>
          <p className="mt-2 text-xs leading-relaxed text-[color:var(--msg-muted)]">
            Your account is ready. Log in to build your first roadmap.
          </p>
          <Link
            href={ROUTES.login}
            className="mt-6 w-full rounded-xl bg-[color:var(--msg-orange)] py-3 text-center text-sm font-bold text-[color:var(--msg-navy)] transition hover:brightness-105"
          >
            Go to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell subtitle="Create your account to get started">
      <ErrorAlert>{error}</ErrorAlert>
      {/* method="post": if the form is submitted before the page has hydrated (slow
          connection), the browser falls back to a native submit. A GET would put the
          password in the URL; a POST never does. */}
      <form method="post" className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Full name" icon={User} name="fullName" autoComplete="name" placeholder="Jordan Lee" />
        <Field label="Email" icon={Mail} name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <Field
          label="Password"
          icon={Lock}
          name="password"
          password
          autoComplete="new-password"
          minLength={6}
          placeholder="At least 6 characters"
        />
        <SubmitButton busy={loading} busyLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>
      <SwitchAuthLink text="Already have an account?" href={ROUTES.login} label="Log in" />
    </AuthShell>
  );
}
