"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";

export type DemandeState = { error?: string; ok?: boolean } | null;

const PHONE_RE = /^[+0-9\s().-]{7,20}$/;

/**
 * Enregistre une demande de document administratif.
 * Formulaire public : aucune connexion requise.
 */
export async function createDemande(
  _prev: DemandeState,
  formData: FormData,
): Promise<DemandeState> {
  const demarcheSlug = String(formData.get("demarche_slug") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!demarcheSlug || nom.length < 3 || !PHONE_RE.test(telephone)) {
    return { error: "invalid" };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "invalid" };
  }

  const db = getDb();
  if (!db) return { error: "generic" };

  const { data: demarche } = await db
    .from("demarches")
    .select("id")
    .eq("slug", demarcheSlug)
    .maybeSingle<{ id: string }>();

  const { error } = await db.from("demandes").insert({
    demarche_id: demarche?.id ?? null,
    demarche_slug: demarcheSlug,
    nom,
    telephone,
    email: email || null,
    message: message || null,
    statut: "en_attente",
  });

  if (error) return { error: "generic" };

  revalidatePath("/taratasy");
  revalidatePath("/admin");
  return { ok: true };
}
