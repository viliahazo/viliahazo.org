"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export type NewsState = { error?: string; ok?: boolean } | null;

const CATEGORIES = ["vaovao", "fampitandrina", "hevitra", "hetsika"] as const;

export async function createActualite(
  _prev: NewsState,
  formData: FormData,
): Promise<NewsState> {
  const user = await getSessionUser();
  if (!user) return { error: "auth" };

  const titre = String(formData.get("titre") ?? "").trim();
  const contenu = String(formData.get("contenu") ?? "").trim();
  const categorie = String(formData.get("categorie") ?? "vaovao");

  if (titre.length < 5 || contenu.length < 20) return { error: "invalid" };
  if (!CATEGORIES.includes(categorie as (typeof CATEGORIES)[number])) {
    return { error: "invalid" };
  }

  const db = getDb();
  if (!db) return { error: "generic" };

  const { error } = await db.from("actualites").insert({
    titre_mg: titre,
    contenu_mg: contenu,
    categorie,
    auteur: user.nom,
    statut: "en_attente",
  });

  if (error) return { error: "generic" };

  revalidatePath("/vaovao");
  revalidatePath("/admin");
  return { ok: true };
}
