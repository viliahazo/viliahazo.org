import type { Metadata } from "next";
import { Suspense } from "react";
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
      <Suspense fallback={<div className="h-96 rounded-2xl border border-earth-200 bg-white p-6 animate-pulse" />}>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
