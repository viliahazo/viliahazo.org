import { NextResponse, type NextRequest } from "next/server";

/**
 * Rendu bilingue indexable : `?lang=fr` sert la page en français et
 * `?lang=mg` en malgache, sans changer d'URL de base (pas de redirection,
 * donc chaque URL hreflang renvoie bien son propre contenu aux robots).
 *
 * Le choix est mémorisé dans le cookie `lang` pour les visites suivantes.
 */
const LANG_COOKIE = "lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("lang");
  const lang = requested === "fr" || requested === "mg" ? requested : null;

  const requestHeaders = new Headers(request.headers);
  if (lang) requestHeaders.set("x-lang", lang);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (lang) {
    response.cookies.set(LANG_COOKIE, lang, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icon.svg|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|favicon.ico).*)",
  ],
};
