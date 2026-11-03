"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/auth";

async function assertAdmin() {
  const user = await getSessionUser();
  if (!isAdmin(user)) throw new Error("Unauthorized");
}

export async function moderateActualite(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? "");
  if (!id || !["publie", "rejete", "en_attente"].includes(statut)) return;

  const db = getDb();
  if (!db) return;

  await db.from("actualites").update({ statut }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/vaovao");
  revalidatePath("/");
}

export async function moderateDemande(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? "");
  if (!id || !["traitee", "rejetee", "en_attente"].includes(statut)) return;

  const db = getDb();
  if (!db) return;

  await db.from("demandes").update({ statut }).eq("id", id);
  revalidatePath("/admin");
}
