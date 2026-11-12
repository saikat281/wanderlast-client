import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in — Wanderlast",
};

export default function LoginPage() {
  redirect("/sign-in");
}
