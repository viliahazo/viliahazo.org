/**
 * Informations de reference du site, utilisees par les metadonnees SEO,
 * le sitemap, les donnees structurees (JSON-LD) et le manifeste PWA.
 *
 * Definissez NEXT_PUBLIC_SITE_URL en production (ex. https://viliahazo.mg)
 * pour que les URL canoniques et le sitemap soient absolus et corrects.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://viliahazo.org"
).replace(/\/+$/, "");

export const SITE_NAME = "Viliahazo";

/**
 * Localisation officielle de la commune, reprise dans les balises geo.*,
 * les donnees structurees et les textes SEO.
 * Coordonnees : 18°49′S 47°40′E (source : Wikipedia).
 */
export const SITE_GEO = {
  locality: "Viliahazo",
  commune: "Kaominina ambanivohitra Viliahazo",
  district: "Antananarivo Avaradrano",
  region: "Analamanga",
  /** Code ISO 3166-2 de la province d'Antananarivo (balises geo.region). */
  regionCode: "MG-T",
  country: "Madagascar",
  countryCode: "MG",
  postalCode: "103",
  latitude: -18.817,
  longitude: 47.667,
  timeZone: "Indian/Antananarivo",
} as const;

/** Les 8 fokontany de la commune, dans l'ordre officiel. */
export const FOKONTANY_NAMES = [
  "Anjomakely",
  "Anjoma Betoho",
  "Ambodivoara",
  "Antsahamalaza",
  "Manakana",
  "Ambatoharanana",
  "Soavinarivo",
  "Antanambao",
] as const;

export const SITE_WIKIPEDIA = "https://en.wikipedia.org/wiki/Viliahazo";

export const SITE_ORG = {
  name: "Kaominina Viliahazo",
  alternateName: "Commune rurale de Viliahazo",
  mayor: "RANDRIAMANANTENA Gabriel Rolland",
  locality: SITE_GEO.locality,
  district: SITE_GEO.district,
  region: SITE_GEO.region,
  postalCode: SITE_GEO.postalCode,
  country: SITE_GEO.countryCode,
  phone: "+261340000000",
  email: "contact@viliahazo.org",
  // TODO: DEV MUST REPLACE WITH REAL PHONE NUMBER
  openingHours: "Mo-Fr 07:30-16:00",
} as const;

/** Table des pages publiques indexables (hors /admin et comptes). */
export const PUBLIC_PATHS = [
  "/",
  "/vaovao",
  "/taratasy",
  "/fokontany",
  "/trano",
  "/fitaterana",
  "/asa",
  "/hetsika",
  "/fianarana",
  "/mifandraisa",
] as const;
