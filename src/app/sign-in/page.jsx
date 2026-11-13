import SignInForm from "@/components/SignInForm";

export const metadata = {
  title: "Sign in — Wanderlast",
};

export default async function SignInPage({ searchParams }) {
  const { next } = await searchParams;
  const redirectTo =
    typeof next === "string" && next.startsWith("/") ? next : "/destinations";

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-accent/40 to-background px-4 py-16">
      <SignInForm redirectTo={redirectTo} />
    </main>
  );
}
