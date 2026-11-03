"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSessionUser, hashPassword, isAdmin } from "@/lib/auth";
import { getAdminTable, type AdminField } from "@/lib/admin-schema";

export type ContentState = { error?: string } | null;

/** Pages publiques à rafraîchir après une modification. */
const PUBLIC_PATHS: Record<string, string[]> = {
  actualites: ["/", "/vaovao"],
  demarches: ["/", "/taratasy"],
  demandes: ["/admin"],
  fokontany: ["/", "/taratasy"],
  aides_sociales: ["/trano"],
  transport_lignes: ["/fitaterana"],
  emplois: ["/asa"],
  services_municipaux: ["/asa"],
  evenements: ["/hetsika"],
  fiangonana: ["/hetsika"],
  users: [],
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3,4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function assertAdmin() {
  const user = await getSessionUser();
  if (!isAdmin(user)) throw new Error("Unauthorized");
}

function revalidate(table: string, key: string) {
  for (const path of PUBLIC_PATHS[table] ?? []) revalidatePath(path);
  revalidatePath("/admin");
  revalidatePath(`/admin/${key}`);
}

/** Convertit une valeur de formulaire selon le type déclaré du champ. */
function parseField(
  field: AdminField,
  formData: FormData,
): { ok: true; value: unknown } | { ok: false } {
  const raw = String(formData.get(field.name) ?? "").trim();

  if (!raw) {
    if (field.required) return { ok: false };
    return { ok: true, value: field.type === "list" ? [] : null };
  }

  switch (field.type) {
    case "number": {
      const value = Number(raw);
      return Number.isFinite(value) ? { ok: true, value } : { ok: false };
    }
    case "list":
      return {
        ok: true,
        value: raw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      };
    case "email":
      return EMAIL_RE.test(raw) ? { ok: true, value: raw } : { ok: false };
    case "select": {
      const allowed = field.options?.map((option) => option.value) ?? [];
      return allowed.includes(raw) ? { ok: true, value: raw } : { ok: false };
    }
    case "datetime":
    case "date":
    case "textarea":
    case "text":
    default:
      return { ok: true, value: raw };
  }
}

/**
 * Crée ou met à jour un enregistrement d'une table gérée par l'administration.
 * La table et les colonnes sont validées contre ADMIN_TABLES (liste blanche).
 */
export async function saveRecord(
  _prev: ContentState,
  formData: FormData,
): Promise<ContentState> {
  await assertAdmin();

  const spec = getAdminTable(String(formData.get("__table") ?? ""));
  if (!spec) return { error: "invalid" };

  const id = String(formData.get("__id") ?? "");
  const isNew = id === "" || id === "new";
  if (isNew && !spec.canCreate) return { error: "invalid" };
  if (!isNew && !UUID_RE.test(id)) return { error: "invalid" };

  const payload: Record<string, unknown> = {};

  for (const field of spec.fields) {
    if (field.secret) {
      const raw = String(formData.get(field.name) ?? "");
      if (raw) {
        if (raw.length < 8) return { error: "weak" };
        payload.password_hash = hashPassword(raw);
      }
      continue;
    }

    const parsed = parseField(field, formData);
    if (!parsed.ok) return { error: field.required ? "missing" : "invalid" };
    payload[field.name] = parsed.value;
  }

  if (isNew && spec.table === "users" && !payload.password_hash) {
    return { error: "missing" };
  }

  const db = getDb();
  if (!db) return { error: "db" };

  const { error } = isNew
    ? await db.from(spec.table).insert(payload)
    : await db.from(spec.table).update(payload).eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "duplicate" };
    if (error.code === "23514" || error.code === "22P02") return { error: "invalid" };
    console.error(`[admin] ${spec.table}: ${error.message}`);
    return { error: "generic" };
  }

  revalidate(spec.table, spec.key);
  redirect(`/admin/${spec.key}`);
}

/** Supprime un enregistrement puis revient à la liste. */
export async function deleteRecord(formData: FormData): Promise<void> {
  await assertAdmin();

  const spec = getAdminTable(String(formData.get("__table") ?? ""));
  const id = String(formData.get("__id") ?? "");
  if (!spec || !UUID_RE.test(id)) return;

  const db = getDb();
  if (!db) return;

  const { error } = await db.from(spec.table).delete().eq("id", id);
  if (error) {
    console.error(`[admin] delete ${spec.table}: ${error.message}`);
    return;
  }

  revalidate(spec.table, spec.key);
  redirect(`/admin/${spec.key}`);
}

/** Traite rapidement une demande (traité / rejeté) depuis la liste. */
export async function setDemandeStatut(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? "");
  if (!UUID_RE.test(id)) return;
  if (!["en_attente", "traitee", "rejetee"].includes(statut)) return;

  const db = getDb();
  if (!db) return;

  await db.from("demandes").update({ statut }).eq("id", id);
  revalidate("demandes", "demandes");
  redirect("/admin/demandes");
}
