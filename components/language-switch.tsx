"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

export function LanguageSwitch({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Lang) {
    if (next === lang) return;
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // Même URL + ?lang=fr|mg : la version française reste indexable et
    // partageable (le proxy mémorise aussi le choix en cookie).
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    startTransition(() =>
      router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false }),
    );
  }

  return (
    <div
      role="group"
      aria-label="Fiteny / Langue"
      className="flex items-center gap-1 rounded-full border border-leaf-200 bg-white p-0.5 text-xs font-semibold"
    >
      <Languages className="ml-1.5 h-3.5 w-3.5 text-leaf-700" aria-hidden />
      {(["mg", "fr"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-pressed={lang === code}
          disabled={pending}
          className={`rounded-full px-2 py-1 uppercase transition ${
            lang === code
              ? "bg-leaf-600 text-white"
              : "text-earth-700 hover:bg-leaf-50"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
