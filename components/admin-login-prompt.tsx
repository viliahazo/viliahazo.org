import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { Card } from "./ui";

/** Affiché à la place de l'administration quand la session n'est pas admin. */
export async function AdminLoginPrompt() {
  const { t } = await getLangAndDict();

  return (
    <Card>
      <h1 className="flex items-center gap-2 text-lg font-bold text-leaf-900">
        <ShieldCheck className="h-5 w-5" aria-hidden />
        {t.admin.title}
      </h1>
      <p className="mt-3 text-sm text-earth-700">{t.admin.loginRequired}</p>
      <Link
        href="/hiditra"
        className="mt-4 inline-flex rounded-xl bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-leaf-700"
      >
        {t.nav.login}
      </Link>
    </Card>
  );
}
