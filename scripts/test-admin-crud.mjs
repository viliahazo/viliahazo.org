/**
 * Vérifie que les colonnes déclarées dans lib/admin-schema.ts correspondent
 * réellement aux tables Supabase : crée, modifie puis supprime une ligne dans
 * chaque table gérée par l'administration.
 *
 * Usage : node scripts/test-admin-crud.mjs
 */
import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env");

// Les specs admin sont en TypeScript : compilation rapide dans .tmp-admin/.
execFileSync(
  "npx",
  [
    "tsc",
    "lib/admin-schema.ts",
    "--outDir",
    ".tmp-admin",
    "--module",
    "es2022",
    "--target",
    "es2022",
    "--moduleResolution",
    "bundler",
    "--skipLibCheck",
  ],
  { stdio: "inherit" },
);
const { ADMIN_TABLES } = await import("../.tmp-admin/admin-schema.js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis dans .env");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const MARK = `TEST-ADMIN-${Date.now()}`;

function sampleValue(field) {
  switch (field.type) {
    case "number":
      return 0;
    case "select":
      return field.options[0].value;
    case "list":
      return ["Ligne A", "Ligne B"];
    case "date":
      return "2026-12-31";
    case "datetime":
      return "2026-12-31T10:00";
    case "email":
      return `${MARK.toLowerCase()}@example.com`;
    case "password":
      return "motdepasse-test-123";
    default:
      return `${MARK} ${field.name}`;
  }
}

let failures = 0;

for (const spec of ADMIN_TABLES) {
  if (!spec.canCreate) {
    console.log(`- ${spec.table}: lecture seule (ignoré)`);
    continue;
  }

  const payload = {};
  for (const field of spec.fields) {
    const value = sampleValue(field);
    if (field.secret) payload.password_hash = "scrypt$test$test";
    else payload[field.name] = value;
  }

  const inserted = await db.from(spec.table).insert(payload).select("id").single();
  if (inserted.error) {
    failures++;
    console.log(`✗ ${spec.table}: insertion — ${inserted.error.message}`);
    continue;
  }

  const id = inserted.data.id;
  const updatePayload = {};
  const firstText = spec.fields.find((field) => field.type === "text" && !field.secret);
  if (firstText) updatePayload[firstText.name] = `${MARK} modifié`;

  let step = "mise à jour";
  const updated = Object.keys(updatePayload).length
    ? await db.from(spec.table).update(updatePayload).eq("id", id).select("id").single()
    : { error: null };

  if (updated.error) {
    failures++;
    console.log(`✗ ${spec.table}: ${step} — ${updated.error.message}`);
  }

  const readBack = await db.from(spec.table).select("*").eq("id", id).maybeSingle();
  if (readBack.error || !readBack.data) {
    failures++;
    console.log(`✗ ${spec.table}: lecture — ${readBack.error?.message ?? "ligne absente"}`);
  }

  const deleted = await db.from(spec.table).delete().eq("id", id);
  if (deleted.error) {
    failures++;
    console.log(`✗ ${spec.table}: suppression — ${deleted.error.message}`);
  }

  if (!inserted.error && !updated.error && !readBack.error && !deleted.error) {
    console.log(`✓ ${spec.table}: create → update → read → delete (${spec.fields.length} champs)`);
  }
}

// Cas particulier : demandes (lecture seule en création) — vérifier les colonnes.
const demandeCheck = await db.from("demandes").select("*").limit(1);
if (demandeCheck.error) {
  failures++;
  console.log(`✗ demandes: lecture — ${demandeCheck.error.message}`);
} else {
  console.log("✓ demandes: colonnes accessibles");
}

console.log(failures === 0 ? "\nTout est OK." : `\n${failures} échec(s).`);
process.exit(failures === 0 ? 0 : 1);
