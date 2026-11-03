import { SITE_NAME, SITE_ORG, SITE_URL } from "./site";
import type { Lang } from "./i18n";

type JsonLdObject = Record<string, unknown>;

/** Adresse postale de la commune (schema.org/PostalAddress). */
const ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: SITE_ORG.locality,
  addressRegion: SITE_ORG.country,
  addressCountry: SITE_ORG.country,
};

/** Schema.org LocalGovernment type for the homepage */
export function localGovernmentJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalGovernment",
    name: "Kaominina Viliahazo",
    alternateName: "Mairie de Viliahazo",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Viliahazo",
      addressRegion: "Analamanga",
      addressCountry: "MG"
    },
    url: SITE_URL,
    telephone: SITE_ORG.phone,
    openingHours: SITE_ORG.openingHours
  };
}

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_ORG.name,
    alternateName: SITE_ORG.alternateName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    telephone: SITE_ORG.phone,
    email: SITE_ORG.email,
    foundingLocation: { "@type": "Place", name: "Viliahazo, Madagascar" },
    address: ADDRESS,
    areaServed: { "@type": "AdministrativeArea", name: "Viliahazo" },
    openingHours: SITE_ORG.openingHours,
    knowsLanguage: ["mg", "fr"],
    employee: {
      "@type": "Person",
      name: SITE_ORG.mayor,
      jobTitle: "Ben'ny tanàna / Maire",
    },
  };
}

export function websiteJsonLd(lang: Lang): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: lang === "fr" ? "fr-MG" : "mg-MG",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
  lang,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  lang: Lang;
  type?: "WebPage" | "CollectionPage" | "AboutPage";
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    inLanguage: lang === "fr" ? "fr-MG" : "mg-MG",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/opengraph-image` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Liste d'elements (actualites, demarches, evenements...) pour les pages de rubrique. */
export function itemListJsonLd({
  path,
  name,
  items,
}: {
  path: string;
  name: string;
  items: { name: string; description?: string }[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
