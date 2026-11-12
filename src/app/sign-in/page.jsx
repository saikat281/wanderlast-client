import SignInForm from "@/components/SignInForm";

export const metadata = {
  title: "Sign in — Wanderlast",
};

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-accent/40 to-background px-4 py-16">
      <SignInForm />
    </main>
  );
}
