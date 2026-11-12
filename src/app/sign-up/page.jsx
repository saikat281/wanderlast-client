import SignUpForm from "@/components/SignUpForm";

export const metadata = {
  title: "Sign up — Wanderlast",
};

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-accent/40 to-background px-4 py-16">
      <SignUpForm />
    </main>
  );
}
