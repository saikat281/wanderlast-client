"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Eye, EyeOff, Image as ImageIcon, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function Field({ label, htmlFor, icon: Icon, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        {children}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    imageUrl: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    const { error: authError } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      image: form.imageUrl.trim(),
      password: form.password,
    });

    if (authError) {
      setPending(false);
      setError(authError.message || "Could not create your account. Please try again.");
      return;
    }

    router.push("/destinations");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
      <Link href="/" className="group inline-flex items-center gap-2">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Compass className="size-5" />
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          Wander<span className="text-primary">last</span>
        </span>
      </Link>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Join Wanderlast to start planning your next journey.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Field label="Full name" htmlFor="signup-name" icon={User}>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Explorer"
            className={cn(fieldClasses, "pl-10")}
          />
        </Field>

        <Field label="Email" htmlFor="signup-email" icon={Mail}>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={cn(fieldClasses, "pl-10")}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-image"
            className="text-sm font-medium text-foreground"
          >
            Profile image URL
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <ImageIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="signup-image"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className={cn(fieldClasses, "pl-10")}
              />
            </div>
            {form.imageUrl.trim() && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.imageUrl.trim()}
                alt="Profile preview"
                referrerPolicy="no-referrer"
                className="size-11 shrink-0 rounded-full border border-border object-cover"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a link to a square photo for your profile.
          </p>
        </div>

        <Field
          label="Password"
          htmlFor="signup-password"
          icon={Lock}
          hint="Use at least 8 characters."
        >
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            className={cn(fieldClasses, "pr-10 pl-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </Field>

        <Field
          label="Confirm password"
          htmlFor="signup-confirm-password"
          icon={Lock}
        >
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            className={cn(fieldClasses, "pl-10")}
          />
        </Field>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="mt-2 w-full rounded-full"
        >
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
