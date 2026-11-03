import { Database } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import type { Lang } from "@/lib/i18n";

export function SetupNotice({ lang }: { lang: Lang }) {
  if (isDbConfigured()) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3 text-sm text-amber-950">
        <Database className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {lang === "fr" ? (
          <p>
            Base de donnees non configuree : les listes sont vides. Renseignez{" "}
            <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            et <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            (voir <code className="rounded bg-amber-100 px-1">README.md</code>), puis
            executez <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>{" "}
            et <code className="rounded bg-amber-100 px-1">supabase/seed.sql</code>.
          </p>
        ) : (
          <p>
            Tsy mbola voarindra ny tahiry : foana ny lisitra. Ampidiro ny{" "}
            <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            sy <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            (jereo ny <code className="rounded bg-amber-100 px-1">README.md</code>), dia
            ampiasao ny{" "}
            <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code> sy{" "}
            <code className="rounded bg-amber-100 px-1">supabase/seed.sql</code>.
          </p>
        )}
      </div>
    </div>
  );
}
