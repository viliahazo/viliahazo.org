import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo";

/** L'administration n'est jamais indexée par les moteurs de recherche. */
export const metadata: Metadata = {
  title: "Fitantanana",
  robots: NO_INDEX,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
