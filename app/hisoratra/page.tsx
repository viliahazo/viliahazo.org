import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { NO_INDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hamorona kaonty",
  description: "Hamorona kaonty tsotra ho an'ny mponina eto Viliahazo.",
  robots: NO_INDEX,
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Suspense fallback={<div className="h-96 rounded-2xl border border-earth-200 bg-white p-6 animate-pulse" />}>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
