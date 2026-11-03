import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { NO_INDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hamorona kaonty",
  description: "Hamorona kaonty tsotra ho an'ny mponina ao Viliahazo.",
  robots: NO_INDEX,
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <AuthForm mode="register" />
    </div>
  );
}
