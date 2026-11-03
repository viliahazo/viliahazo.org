import { selectRows } from "./db";
import type {
  Actualite,
  AideSociale,
  Demarche,
  Demande,
  Emploi,
  Evenement,
  Fiangonana,
  Fokontany,
  ServiceMunicipal,
  TransportLigne,
} from "./types";

const FRESH = { column: "created_at", ascending: false };

export function getPublishedNews(limit = 20) {
  return selectRows<Actualite>("actualites", {
    eq: { column: "statut", value: "publie" },
    order: FRESH,
    limit,
  });
}

export function getAllNews() {
  return selectRows<Actualite>("actualites", { order: FRESH, limit: 100 });
}

export function getProcedures() {
  return selectRows<Demarche>("demarches", { order: { column: "ordre" } });
}

export function getFokontany() {
  return selectRows<Fokontany>("fokontany", { order: { column: "ordre" } });
}

export function getAides() {
  return selectRows<AideSociale>("aides_sociales", { order: FRESH });
}

export function getTransport() {
  return selectRows<TransportLigne>("transport_lignes", { order: FRESH });
}

export function getEmplois() {
  return selectRows<Emploi>("emplois", { order: FRESH });
}

export function getServices() {
  return selectRows<ServiceMunicipal>("services_municipaux", { order: FRESH });
}

export function getEvenements() {
  return selectRows<Evenement>("evenements", { order: { column: "date_event" } });
}

export function getFiangonana() {
  return selectRows<Fiangonana>("fiangonana", { order: { column: "nom" } });
}

export function getDemandes() {
  return selectRows<Demande>("demandes", { order: FRESH, limit: 100 });
}
