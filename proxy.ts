import { NextResponse, type NextRequest } from "next/server";

/**
 * Rendu bilingue indexable Next.js 16 (proxy.ts) :
 * `?lang=fr` sert la page en français et `?lang=mg` en malgache.
 * Le choix est synchronisé dans le cookie `lang` pour les visites suivantes.
 */
const LANG_COOKIE = "lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("lang");
  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
  const lang =
    requested === "fr" || requested === "mg"
      ? requested
      : cookieLang === "fr" || cookieLang === "mg"
        ? cookieLang
        : null;

  const requestHeaders = new Headers(request.headers);
  if (lang) requestHeaders.set("x-lang", lang);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (requested === "fr" || requested === "mg") {
    response.cookies.set(LANG_COOKIE, requested, {
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
