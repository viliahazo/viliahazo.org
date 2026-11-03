import { getDb, selectRows } from "./db";
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

/* ------------------------- Administration ------------------------- */

/** Toutes les lignes d'une table, pour la gestion administrative. */
export async function getTableRows<T = Record<string, unknown>>(
  table: string,
  order: { column: string; ascending: boolean },
  limit = 500,
): Promise<T[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from(table)
    .select("*")
    .order(order.column, { ascending: order.ascending })
    .limit(limit);

  if (error) {
    console.error(`[db] ${table}: ${error.message}`);
    return [];
  }
  return (data ?? []) as T[];
}

export async function getTableRow<T = Record<string, unknown>>(
  table: string,
  id: string,
): Promise<T | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db.from(table).select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error(`[db] ${table}/${id}: ${error.message}`);
    return null;
  }
  return (data as T) ?? null;
}

export async function countTableRows(table: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  const { count, error } = await db
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
