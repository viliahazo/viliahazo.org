import { FOKONTANY_NAMES, SITE_GEO, SITE_NAME, SITE_ORG, SITE_URL, SITE_WIKIPEDIA } from "./site";
import type { Lang } from "./i18n";

type JsonLdObject = Record<string, unknown>;

/** Adresse postale de la commune (schema.org/PostalAddress). */
const ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: SITE_GEO.locality,
  addressRegion: SITE_GEO.region,
  postalCode: SITE_GEO.postalCode,
  addressCountry: SITE_GEO.countryCode,
};

const GEO_COORDINATES = {
  "@type": "GeoCoordinates",
  latitude: SITE_GEO.latitude,
  longitude: SITE_GEO.longitude,
};

/** Carte publique de la commune (OpenStreetMap). */
const MAP_URL = `https://www.openstreetmap.org/?mlat=${SITE_GEO.latitude}&mlon=${SITE_GEO.longitude}#map=13/${SITE_GEO.latitude}/${SITE_GEO.longitude}`;

/** Identifiant d'ancre d'un fokontany (ex. « Anjoma Betoho » → « anjoma-betoho »). */
export function fokontanySlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Les 8 fokontany de la commune en tant que lieux schema.org/Place. */
export function fokontanyPlace(
  name: string,
  extra: { chef?: string | null; contact?: string | null } = {},
): JsonLdObject {
  const isPhone = Boolean(
    extra.contact && /^\+?[0-9\s\-().]{6,}$/.test(extra.contact),
  );

  return {
    "@type": "Place",
    "@id": `${SITE_URL}/fokontany#${fokontanySlug(name)}`,
    url: `${SITE_URL}/fokontany#${fokontanySlug(name)}`,
    name,
    address: ADDRESS,
    containedInPlace: {
      "@type": "AdministrativeArea",
      "@id": `${SITE_URL}/#localgovernment`,
      name: SITE_ORG.name,
      containedInPlace: [
        { "@type": "AdministrativeArea", name: SITE_GEO.district },
        { "@type": "AdministrativeArea", name: SITE_GEO.region },
        { "@type": "Country", name: SITE_GEO.country },
      ],
    },
    ...(isPhone ? { telephone: extra.contact } : {}),
    ...(extra.chef
      ? {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "Lehiben'ny fokontany / Chef de fokontany",
            value: extra.chef,
          },
        }
      : {}),
  };
}

/** Schema.org LocalGovernment de la commune, geo-cible sur Viliahazo et ses 8 fokontany. */
export function localGovernmentJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalGovernment",
    "@id": `${SITE_URL}/#localgovernment`,
    name: SITE_ORG.name,
    alternateName: [
      SITE_ORG.alternateName,
      "Mairie de Viliahazo",
      "Viliahazo Avaradrano",
    ],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    address: ADDRESS,
    geo: GEO_COORDINATES,
    hasMap: MAP_URL,
    // TODO: DEV MUST REPLACE WITH REAL PHONE NUMBER
    telephone: SITE_ORG.phone,
    email: SITE_ORG.email,
    openingHours: SITE_ORG.openingHours,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:30",
      closes: "16:00",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: SITE_GEO.locality,
      containedInPlace: [
        { "@type": "AdministrativeArea", name: SITE_GEO.district },
        { "@type": "AdministrativeArea", name: SITE_GEO.region },
        { "@type": "Country", name: SITE_GEO.country },
      ],
    },
    containsPlace: FOKONTANY_NAMES.map((name) => fokontanyPlace(name)),
    knowsLanguage: ["mg", "fr"],
    sameAs: [SITE_WIKIPEDIA],
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
    address: ADDRESS,
    geo: GEO_COORDINATES,
    foundingLocation: {
      "@type": "Place",
      name: `${SITE_GEO.locality}, ${SITE_GEO.district}, ${SITE_GEO.region}, ${SITE_GEO.country}`,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: SITE_GEO.locality,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: `${SITE_GEO.district} (${SITE_GEO.region})`,
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_ORG.phone,
      email: SITE_ORG.email,
      contactType: "customer service",
      areaServed: SITE_GEO.countryCode,
      availableLanguage: ["mg", "fr"],
    },
    openingHours: SITE_ORG.openingHours,
    knowsLanguage: ["mg", "fr"],
    sameAs: [SITE_WIKIPEDIA],
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
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
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
    spatialCoverage: {
      "@type": "Place",
      name: `${SITE_GEO.locality}, ${SITE_GEO.district}, ${SITE_GEO.region}, ${SITE_GEO.country}`,
      geo: GEO_COORDINATES,
    },
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

/**
 * Liste des 8 fokontany de la commune (page /fokontany).
 * Les donnees de la base sont utilisees quand elles existent, sinon la liste
 * officielle des 8 fokontany sert de repli.
 */
export function fokontanyJsonLd(
  items: { nom: string; chef?: string | null; contact?: string | null }[] = [],
): JsonLdObject {
  const list: { nom: string; chef?: string | null; contact?: string | null }[] =
    items.length > 0 ? items : FOKONTANY_NAMES.map((nom) => ({ nom }));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Fokontany 8 — ${SITE_ORG.name}`,
    description: `Les fokontany de la commune rurale de ${SITE_GEO.locality} (${SITE_GEO.district}, ${SITE_GEO.region}, ${SITE_GEO.country}).`,
    numberOfItems: list.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: list.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: fokontanyPlace(item.nom, { chef: item.chef, contact: item.contact }),
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
