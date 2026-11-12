"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.17 3.58-8.86Z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function GoogleAuthButton({
  label = "Continue with Google",
  callbackURL = "/destinations",
  onError,
  className,
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });

    if (error) {
      setPending(false);
      onError?.(
        error.message || "Could not continue with Google. Please try again.",
      );
      return;
    }

    // On success BetterAuth redirects the browser to Google, so the pending
    // state is intentionally left as-is until the redirect happens.
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={pending}
      onClick={handleClick}
      className={cn("w-full rounded-full", className)}
    >
      <GoogleIcon />
      {pending ? "Redirecting to Google…" : label}
    </Button>
  );
}
