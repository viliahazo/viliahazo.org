import type { Metadata } from "next";
import { getLang } from "./lang";
import type { Lang } from "./i18n";
import { FOKONTANY_NAMES, SITE_GEO, SITE_NAME, SITE_URL } from "./site";

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `Kaominina Viliahazo (${SITE_GEO.district}, ${SITE_GEO.region}) — sehatra ofisialy ho an'ny mponina`,
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

/**
 * Mots-cles geo communs a toutes les pages : commune, district, region, pays
 * et les 8 fokontany.
 */
export const GEO_KEYWORDS = [
  SITE_GEO.locality,
  "Kaominina Viliahazo",
  "Commune rurale de Viliahazo",
  "mairie de Viliahazo",
  "Viliahazo Avaradrano",
  SITE_GEO.district,
  SITE_GEO.region,
  SITE_GEO.country,
  "Madagasikara",
  "fokontany Viliahazo",
  ...FOKONTANY_NAMES,
];

export type SeoCopy = {
  title: string;
  description: string;
  keywords?: string[];
};

/**
 * Titres et descriptions optimises pour chaque page publique, en malgache et
 * en francais. Les titres n'incluent pas « Viliahazo » : le template du layout
 * ajoute « · Viliahazo » (sauf pour la page d'accueil, en titre absolu).
 */
export const PAGE_SEO: Record<string, Record<Lang, SeoCopy>> = {
  "/": {
    mg: {
      title: "Kaominina Viliahazo — Tranonkala ofisialy | Avaradrano, Madagasikara",
      description:
        "Sehatra ofisialy ny Kaominina Viliahazo (Avaradrano, Analamanga) : vaovao, taratasy, fanampiana sosialy, fitaterana, asa ary ny fokontany 8.",
      keywords: ["sehatra ofisialy Viliahazo", "vaovao Viliahazo", "taratasy kaominina"],
    },
    fr: {
      title: "Commune rurale de Viliahazo — Site officiel | Avaradrano, Madagascar",
      description:
        "Site officiel de la Commune rurale de Viliahazo (Avaradrano, Analamanga, Madagascar) : actualités, démarches, aides sociales, transport, emploi et les 8 fokontany.",
      keywords: ["site officiel Viliahazo", "commune Viliahazo", "mairie Viliahazo"],
    },
  },
  "/vaovao": {
    mg: {
      title: "Vaovao sy fampitandrina",
      description:
        "Ny vaovao ofisialy farany avy amin'ny Kaominina Viliahazo (Avaradrano) : fampitandrina, hetsika, tetikasa ary fanambarana ho an'ny mponina amin'ny fokontany 8.",
      keywords: ["vaovao Viliahazo", "fampitandrina", "actualités Viliahazo"],
    },
    fr: {
      title: "Actualités et alertes",
      description:
        "Actualités officielles de la commune de Viliahazo (Avaradrano) : alertes, événements, projets et annonces pour les habitants des 8 fokontany.",
      keywords: ["actualités Viliahazo", "alertes Viliahazo", "vaovao"],
    },
  },
  "/taratasy": {
    mg: {
      title: "Taratasy sy fitantanana — kopia, fanamarinam-ponenana",
      description:
        "Torolalana fangatahana kopia, dika mitovy, fanamarinam-ponenana, latsakemboka ary taratasy fanambadiana ao amin'ny Kaominina Viliahazo : antontan-taratasy, faharetana ary sarany.",
      keywords: ["fanamarinam-ponenana", "kopia taratasy", "latsakemboka", "taratasy fanambadiana"],
    },
    fr: {
      title: "Démarches administratives — état civil et résidence",
      description:
        "Démarches à la commune de Viliahazo (Avaradrano) : copie d'acte, certification conforme, certificat de résidence, légalisation et mariage — pièces, délais et frais.",
      keywords: ["certificat de résidence Viliahazo", "copie d'acte", "démarches communales"],
    },
  },
  "/fokontany": {
    mg: {
      title: "Ny fokontany 8 — Anjomakely, Anjoma Betoho, Ambodivoara…",
      description:
        "Ny fokontany 8 ao amin'ny Kaominina Viliahazo (Avaradrano) : Anjomakely, Anjoma Betoho, Ambodivoara, Antsahamalaza, Manakana, Ambatoharanana, Soavinarivo, Antanambao.",
      keywords: ["fokontany Viliahazo", "lehiben'ny fokontany", "Anjomakely", "Antanambao"],
    },
    fr: {
      title: "Les 8 fokontany — Anjomakely, Anjoma Betoho, Ambodivoara…",
      description:
        "Les 8 fokontany de Viliahazo (Avaradrano) : Anjomakely, Anjoma Betoho, Ambodivoara, Antsahamalaza, Manakana, Ambatoharanana, Soavinarivo, Antanambao.",
      keywords: ["fokontany Viliahazo", "chef de fokontany", "Anjomakely", "Antanambao"],
    },
  },
  "/trano": {
    mg: {
      title: "Fanampiana sosialy sy trano",
      description:
        "Ny fanampiana sosialy sy ny fandaharan'asa momba ny trano ao amin'ny Kaominina Viliahazo (Avaradrano, Analamanga) : fepetra, antontan-taratasy ary fifandraisana.",
      keywords: ["fanampiana sosialy", "trano Viliahazo", "aides sociales Madagascar"],
    },
    fr: {
      title: "Aides sociales et logement",
      description:
        "Aides sociales et programmes logement de la commune de Viliahazo (Avaradrano, Analamanga) : conditions, pièces à fournir et contacts utiles.",
      keywords: ["aides sociales Viliahazo", "logement Viliahazo", "fanampiana sosialy"],
    },
  },
  "/fitaterana": {
    mg: {
      title: "Fitaterana — taxibrousse mankany Antananarivo",
      description:
        "Ora sy lalan'ny taxibrousse mampitohy an'i Viliahazo (Avaradrano) amin'Antananarivo sy ny tanàna manodidina, ary ny toerana fiantsonana.",
      keywords: ["taxibrousse Viliahazo", "fitaterana", "horaires taxi-brousse"],
    },
    fr: {
      title: "Transport — taxi-brousse vers Antananarivo",
      description:
        "Horaires, lignes et tarifs des taxi-brousse entre Viliahazo (Avaradrano) et Antananarivo, et points d'arrêt dans la commune.",
      keywords: ["taxi-brousse Viliahazo", "transport Avaradrano", "horaires taxi-brousse"],
    },
  },
  "/asa": {
    mg: {
      title: "Asa, tolotra asa sy fiofanana",
      description:
        "Tolotra asa eo an-toerana, fiofanana ary sampandraharahan'ny Kaominina Viliahazo (Avaradrano) : fandraofana fako, rano madio ary jiro.",
      keywords: ["asa Viliahazo", "emploi Madagascar", "offres d'emploi", "fiofanana"],
    },
    fr: {
      title: "Emploi, offres et formations",
      description:
        "Offres d'emploi locales, formations et services municipaux à Viliahazo (Avaradrano) : collecte des déchets, eau potable et éclairage public.",
      keywords: ["emploi Viliahazo", "offres d'emploi Madagascar", "formation Avaradrano"],
    },
  },
  "/hetsika": {
    mg: {
      title: "Hetsika, fety sy tsena",
      description:
        "Ny fety, tsena, fampisehoana, fanatanjahantena ary ny fiangonana ao amin'ny Kaominina Viliahazo (Avaradrano, Analamanga).",
      keywords: ["hetsika Viliahazo", "fety", "tsena", "fiangonana"],
    },
    fr: {
      title: "Événements, fêtes et marchés",
      description:
        "Fêtes, marchés, spectacles, activités sportives et églises de la commune de Viliahazo (Avaradrano, Analamanga).",
      keywords: ["événements Viliahazo", "fêtes", "marché", "église Viliahazo"],
    },
  },
  "/fianarana": {
    mg: {
      title: "Sekoly, CSB ary fiangonana",
      description:
        "Ny sekoly (EPP, CEG, lycée), CSB II ary fiangonana ao amin'ny Kaominina Viliahazo (Avaradrano) : adiresy, tale, finday ary vaovao.",
      keywords: ["sekoly Viliahazo", "CSB Viliahazo", "EPP Anjomakely", "fiangonana Viliahazo"],
    },
    fr: {
      title: "Écoles, centres de santé et églises",
      description:
        "Écoles (EPP, CEG, lycée), CSB II et églises de la commune de Viliahazo (Avaradrano) : adresses, responsables, contacts et actualités.",
      keywords: ["école Viliahazo", "CSB Viliahazo", "collège Avaradrano", "église Viliahazo"],
    },
  },
  "/mifandraisa": {
    mg: {
      title: "Mifandraisa amin'ny Kaominina",
      description:
        "Adiresy, finday, mailaka ary ora fisokafan'ny birao kaominina Viliahazo (Avaradrano, Analamanga), ary ny fifandraisana amin'ny fokontany 8.",
      keywords: ["finday kaominina Viliahazo", "adiresy Viliahazo", "mifandraisa"],
    },
    fr: {
      title: "Contacter la commune",
      description:
        "Adresse, téléphone, e-mail et horaires du bureau communal de Viliahazo (Avaradrano, Analamanga), et contacts des 8 fokontany.",
      keywords: ["contact mairie Viliahazo", "adresse Viliahazo", "téléphone commune"],
    },
  },
};

/** Copie SEO d'une page pour une langue donnee (undefined si non referencee). */
export function seoCopy(path: string, lang: Lang): SeoCopy | undefined {
  return PAGE_SEO[path]?.[lang];
}

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
  /** Empeche le template du layout d'ajouter « · Viliahazo » (accueil). */
  absoluteTitle?: boolean;
};

/**
 * Metadonnees completes d'une page : titre, description, canonique,
 * hreflang MG/FR, Open Graph, Twitter Card, mots-cles geo et balises geo.*.
 * A utiliser dans un `generateMetadata` pour que la langue soit prise en compte.
 */
export async function pageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords = [],
  absoluteTitle = false,
}: PageSeo): Promise<Metadata> {
  const lang = await getLang();
  const canonical = languageUrl(path, lang);
  const image = {
    ...OG_IMAGE,
    alt: `${title} — ${SITE_GEO.locality}, ${SITE_GEO.district}, ${SITE_GEO.region}`,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...new Set([...keywords, ...GEO_KEYWORDS])],
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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE.url, alt: image.alt }],
    },
    other: {
      "geo.region": SITE_GEO.regionCode,
      "geo.placename": `${SITE_GEO.locality}, ${SITE_GEO.district}, ${SITE_GEO.region}, ${SITE_GEO.country}`,
      "geo.position": `${SITE_GEO.latitude};${SITE_GEO.longitude}`,
      ICBM: `${SITE_GEO.latitude}, ${SITE_GEO.longitude}`,
    },
  };
}

/**
 * Metadonnees d'une page publique a partir de la copie SEO centralisee
 * (PAGE_SEO). Utilisation : `export const generateMetadata = () => metadataForPath("/fokontany");`
 */
export async function metadataForPath(
  path: string,
  options: Pick<PageSeo, "type" | "absoluteTitle"> & { keywords?: string[] } = {},
): Promise<Metadata> {
  const lang = await getLang();
  const copy = seoCopy(path, lang);
  return pageMetadata({
    title: copy?.title ?? `${SITE_NAME} — ${SITE_GEO.district}`,
    description:
      copy?.description ??
      `${SITE_NAME}, kaominina ambanivohitra ao amin'ny distrika ${SITE_GEO.district}, faritra ${SITE_GEO.region}, ${SITE_GEO.country}.`,
    path,
    type: options.type,
    absoluteTitle: options.absoluteTitle,
    keywords: [...(copy?.keywords ?? []), ...(options.keywords ?? [])],
  });
}

/** Pages privees (comptes, administration) : jamais indexees. */
export const NO_INDEX: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false },
};
