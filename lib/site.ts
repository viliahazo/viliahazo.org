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

export const SITE_ORG = {
  name: "Kaominina Viliahazo",
  alternateName: "Commune rurale de Viliahazo",
  mayor: "RANDRIAMANANTENA Gabriel Rolland",
  locality: "Viliahazo",
  country: "MG",
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
  "/mifandraisa",
] as const;
