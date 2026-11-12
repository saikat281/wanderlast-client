import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign up — Wanderlast",
};

export default function SignupPage() {
  redirect("/sign-up");
}
