"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

export function LanguageSwitch({ lang }: { lang: Lang }) {
  const [switching, setSwitching] = useState(false);

  function switchTo(next: Lang) {
    if (next === lang || switching) return;
    setSwitching(true);

    // 1. Mémorise le cookie pour toutes les pages et requêtes suivantes
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;

    // 2. Met à jour l'URL avec ?lang=next
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);

    // 3. Navigation complète : ré-exécute RootLayout (SiteHeader, SiteFooter, html lang)
    // garantissant que l'en-tête et toute la page s'actualisent sans bug de désynchronisation.
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
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
          disabled={switching}
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
