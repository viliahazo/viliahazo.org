import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { NO_INDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hiditra",
  description: "Hiditra amin'ny kaontinao ao amin'ny sehatra Viliahazo.",
  robots: NO_INDEX,
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
