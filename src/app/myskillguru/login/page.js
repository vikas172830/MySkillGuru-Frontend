"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { AuthContext } from "@/app/AuthContext";
import { AuthShell, ErrorAlert, Field, SubmitButton, SwitchAuthLink } from "@/components/myskillguru-landing/AuthForm";
import { ROUTES } from "@/components/myskillguru-landing/tokens";

export default function MySkillsGuruLoginPage() {
  const router = useRouter();
  const { fetchUser } = useContext(AuthContext);
  const [status, setStatus] = useState("idle"); // idle | loading | redirecting
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const data = await response.json();

      if (!response.ok || data?.error) {
        setError(data?.error || "Invalid email or password.");
        setStatus("idle");
        return;
      }

      await fetchUser();
      setStatus("redirecting");
      // Every MySkillsGuru account is a self-learner, so there is a single
      // destination. Access itself is enforced server-side
      // (app.api.deps.require_myskillguru_access), not by this redirect.
      router.push(ROUTES.dashboard);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const busy = status !== "idle";

  return (
    <AuthShell subtitle="Welcome back — sign in to continue learning">
      <ErrorAlert>{error}</ErrorAlert>
      {/* method="post": if the form is submitted before the page has hydrated (slow
          connection), the browser falls back to a native submit. A GET would put the
          password in the URL; a POST never does. */}
      <form method="post" className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Email" icon={Mail} name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <Field label="Password" icon={Lock} name="password" password autoComplete="current-password" placeholder="••••••••" />
        <SubmitButton busy={busy} busyLabel={status === "redirecting" ? "Redirecting…" : "Signing in…"}>
          Log in
        </SubmitButton>
      </form>
      <SwitchAuthLink text="New to MySkillsGuru?" href={ROUTES.register} label="Create an account" />
    </AuthShell>
  );
}
