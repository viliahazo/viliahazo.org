import { getDb, selectRows } from "./db";
import type { SessionUser } from "./types";
import type {
  Actualite,
  ActualiteReply,
  AideSociale,
  Demarche,
  Demande,
  Emploi,
  Etablissement,
  EtablissementActualite,
  Evenement,
  Fiangonana,
  FiangonanaActualite,
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

export function getPublishedFiangonanaActualites(limit = 20) {
  return selectRows<FiangonanaActualite>("fiangonana_actualites", {
    eq: { column: "statut", value: "publie" },
    order: { column: "created_at", ascending: false },
    limit,
  });
}

export async function getFiangonanaActualites(
  fiangonanaId: string,
  limit = 20,
): Promise<FiangonanaActualite[]> {
  const db = getDb();
  if (!db) return [];
  const { data, error } = await db
    .from("fiangonana_actualites")
    .select("*")
    .eq("fiangonana_id", fiangonanaId)
    .eq("statut", "publie")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error(`[db] fiangonana_actualites: ${error.message}`);
    return [];
  }
  return (data ?? []) as FiangonanaActualite[];
}

export function getEtablissements() {
  return selectRows<Etablissement>("etablissements", {
    order: { column: "ordre", ascending: true },
  });
}

export function getEtablissementsByType(type: string) {
  return selectRows<Etablissement>("etablissements", {
    eq: { column: "type", value: type },
    order: { column: "ordre", ascending: true },
  });
}

export async function getEtablissementActualites(
  etablissementId: string,
  limit = 20,
): Promise<EtablissementActualite[]> {
  const db = getDb();
  if (!db) return [];
  const { data, error } = await db
    .from("etablissement_actualites")
    .select("*")
    .eq("etablissement_id", etablissementId)
    .eq("statut", "publie")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error(`[db] etablissement_actualites: ${error.message}`);
    return [];
  }
  return (data ?? []) as EtablissementActualite[];
}

export function getPublishedEtabActualites(limit = 20) {
  return selectRows<EtablissementActualite>("etablissement_actualites", {
    eq: { column: "statut", value: "publie" },
    order: { column: "created_at", ascending: false },
    limit,
  });
}

export function getAllEtabActualites(limit = 100) {
  return selectRows<EtablissementActualite>("etablissement_actualites", {
    order: { column: "created_at", ascending: false },
    limit,
  });
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

/* ----------------------- Vaovao Replies / Sary ----------------------- */

/** Récupère les réponses visibles d'une actualité selon le rôle de l'utilisateur. */
export async function getRepliesForActualite(
  actualiteId: string,
  currentUser?: SessionUser | null,
): Promise<ActualiteReply[]> {
  const db = getDb();
  if (!db) return [];

  // 1. Essaie la table dédiée actualite_commentaires
  const { data, error } = await db
    .from("actualite_commentaires")
    .select("*")
    .eq("actualite_id", actualiteId)
    .order("created_at", { ascending: true });

  if (!error && data) {
    const list = data as ActualiteReply[];
    if (currentUser?.role === "admin") return list;
    return list.filter(
      (r) =>
        r.statut === "publie" ||
        (currentUser &&
          (r.user_id === currentUser.id || r.auteur_nom === currentUser.nom)),
    );
  }

  // 2. Repli vers la table demandes (slug: comment:<actualite_id>)
  const slug = `comment:${actualiteId}`;
  const { data: fallbackData } = await db
    .from("demandes")
    .select("*")
    .eq("demarche_slug", slug)
    .order("created_at", { ascending: true });

  if (fallbackData) {
    const mapped: ActualiteReply[] = fallbackData.map((d) => ({
      id: d.id,
      actualite_id: actualiteId,
      auteur_nom: d.nom,
      auteur_email: d.email,
      user_id: d.telephone || null,
      message: d.message || "",
      statut:
        d.statut === "traitee"
          ? "publie"
          : d.statut === "rejetee"
            ? "rejete"
            : "en_attente",
      created_at: d.created_at,
    }));

    if (currentUser?.role === "admin") return mapped;
    return mapped.filter(
      (r) =>
        r.statut === "publie" ||
        (currentUser &&
          (r.user_id === currentUser.id || r.auteur_nom === currentUser.nom)),
    );
  }

  return [];
}

/** Récupère toutes les réponses en attente de modération pour l'administration. */
export async function getPendingReplies(): Promise<ActualiteReply[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from("actualite_commentaires")
    .select("*")
    .eq("statut", "en_attente")
    .order("created_at", { ascending: false });

  if (!error && data) return data as ActualiteReply[];

  // Repli vers demandes
  const { data: fallbackData } = await db
    .from("demandes")
    .select("*")
    .like("demarche_slug", "comment:%")
    .eq("statut", "en_attente")
    .order("created_at", { ascending: false });

  if (fallbackData) {
    return fallbackData.map((d) => ({
      id: d.id,
      actualite_id: d.demarche_slug.replace("comment:", ""),
      auteur_nom: d.nom,
      auteur_email: d.email,
      user_id: d.telephone || null,
      message: d.message || "",
      statut: "en_attente",
      created_at: d.created_at,
    }));
  }

  return [];
}

/** Extrait l'URL de l'image (soit de la colonne image_url, soit du markdown). */
export function getActualiteImage(item: Actualite): string | null {
  if (item.image_url) return item.image_url;
  const match = item.contenu_mg?.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (match) return match[1];
  return null;
}

/** Nettoie le contenu textuel en retirant l'image markdown initiale. */
export function cleanActualiteContent(content: string): string {
  return content.replace(/^!\[.*?\]\((https?:\/\/[^\s)]+)\)\s*/, "").trim();
}
