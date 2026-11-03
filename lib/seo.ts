import type { Metadata } from "next";
import { getLang } from "./lang";
import type { Lang } from "./i18n";
import { SITE_NAME, SITE_URL } from "./site";

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Viliahazo — sehatra ho an'ny mponina",
} as const;

function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** URL d'une page dans une langue donnee (le malgache est la version par defaut). */
export function languageUrl(path: string, lang: Lang): string {
  const url = absolute(path);
  return lang === "fr" ? `${url}${url.includes("?") ? "&" : "?"}lang=fr` : url;
}

/**
 * Alternates hreflang. Le contenu est bilingue sur la meme route : la version
 * francaise est servie via ?lang=fr (voir proxy.ts), le malgache reste l'URL nue.
 */
export function languageAlternates(path: string) {
  return {
    mg: languageUrl(path, "mg"),
    fr: languageUrl(path, "fr"),
    "x-default": languageUrl(path, "mg"),
  };
}

function ogLocale(lang: Lang) {
  return lang === "fr" ? "fr_MG" : "mg_MG";
}

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
};

/**
 * Metadonnees completes d'une page : titre, description, canonique,
 * hreflang MG/FR, Open Graph et Twitter Card.
 * A utiliser dans un `generateMetadata` pour que la langue soit prise en compte.
 */
export async function pageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords,
}: PageSeo): Promise<Metadata> {
  const lang = await getLang();
  const canonical = languageUrl(path, lang);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      locale: ogLocale(lang),
      alternateLocale: [ogLocale(lang === "fr" ? "mg" : "fr")],
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/** Pages privees (comptes, administration) : jamais indexees. */
export const NO_INDEX: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false },
};
