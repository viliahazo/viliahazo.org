"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";

export type NewsState = { error?: string; ok?: boolean } | null;
export type ReplyState = { error?: string; ok?: boolean } | null;

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
  const imageFile = formData.get("image") as File | null;

  if (titre.length < 5 || contenu.length < 20) return { error: "invalid" };
  if (!CATEGORIES.includes(categorie as (typeof CATEGORIES)[number])) {
    return { error: "invalid" };
  }

  const db = getDb();
  if (!db) return { error: "generic" };

  // Téléversement éventuel de l'image vers Supabase Storage
  let imageUrl: string | null = null;
  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    const uploadRes = await uploadImage(imageFile, "vaovao");
    if ("url" in uploadRes) {
      imageUrl = uploadRes.url;
    }
  }

  // 1. Tente l'insertion avec la colonne image_url si elle existe
  if (imageUrl) {
    const { error: withImageError } = await db.from("actualites").insert({
      titre_mg: titre,
      contenu_mg: contenu,
      categorie,
      auteur: user.nom,
      statut: "en_attente",
      image_url: imageUrl,
    });

    if (!withImageError) {
      revalidatePath("/vaovao");
      revalidatePath("/admin");
      revalidatePath("/");
      return { ok: true };
    }
  }

  // 2. Repli : si la colonne image_url n'existe pas encore en base,
  // on intègre l'URL au début du contenu en markdown ![Sary](url)
  const finalContent = imageUrl ? `![Sary](${imageUrl})\n\n${contenu}` : contenu;

  const { error } = await db.from("actualites").insert({
    titre_mg: titre,
    contenu_mg: finalContent,
    categorie,
    auteur: user.nom,
    statut: "en_attente",
  });

  if (error) {
    console.error("[news] Create error:", error.message);
    return { error: "generic" };
  }

  revalidatePath("/vaovao");
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

/* -------------------------- Réponses / Commentaires -------------------------- */

export async function createReply(
  _prev: ReplyState,
  formData: FormData,
): Promise<ReplyState> {
  const user = await getSessionUser();
  const actualiteId = String(formData.get("actualiteId") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const nom = user?.nom ?? String(formData.get("nom") ?? "").trim();
  const rawEmail = String(formData.get("email") ?? "").trim();
  const email = user?.email ?? (rawEmail.length > 0 ? rawEmail : null);

  if (!actualiteId || message.length < 3 || nom.length < 2) {
    return { error: "invalid" };
  }

  const db = getDb();
  if (!db) return { error: "generic" };

  // 1. Tente d'abord la table dédiée actualite_commentaires
  const { error: primaryError } = await db.from("actualite_commentaires").insert({
    actualite_id: actualiteId,
    auteur_nom: nom,
    auteur_email: email,
    user_id: user?.id ?? null,
    message,
    statut: "en_attente",
  });

  if (!primaryError) {
    revalidatePath("/vaovao");
    revalidatePath("/admin");
    return { ok: true };
  }

  // 2. Repli transparent vers la table demandes si la table dédiée n'est pas encore créée
  const { error: fallbackError } = await db.from("demandes").insert({
    demarche_slug: `comment:${actualiteId}`,
    nom,
    telephone: user?.id ?? "",
    email,
    message,
    statut: "en_attente",
  });

  if (fallbackError) {
    console.error("[news] createReply error:", fallbackError.message);
    return { error: "generic" };
  }

  revalidatePath("/vaovao");
  revalidatePath("/admin");
  return { ok: true };
}

export async function moderateReply(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!isAdmin(user)) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? ""); // 'publie', 'rejete', 'supprimer'
  if (!id || !["publie", "rejete", "supprimer"].includes(statut)) return;

  const db = getDb();
  if (!db) return;

  if (statut === "supprimer") {
    await db.from("actualite_commentaires").delete().eq("id", id);
    await db.from("demandes").delete().eq("id", id);
  } else {
    // Essaie actualite_commentaires
    await db.from("actualite_commentaires").update({ statut }).eq("id", id);
    // Essaie demandes (statut 'traitee' correspond à 'publie')
    const mappedStatut = statut === "publie" ? "traitee" : "rejetee";
    await db.from("demandes").update({ statut: mappedStatut }).eq("id", id);
  }

  revalidatePath("/vaovao");
  revalidatePath("/admin");
}
