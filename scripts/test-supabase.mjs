// Temporary connectivity/CRUD check against the real Supabase project from .env.
// Run: node scripts/test-supabase.mjs
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

let failures = 0;
const ok = (msg) => console.log(`  OK   ${msg}`);
const bad = (msg, detail) => {
  failures++;
  console.log(`  FAIL ${msg}${detail ? ` — ${detail}` : ""}`);
};

console.log("== Config ==");
if (!url || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) {
  bad("NEXT_PUBLIC_SUPABASE_URL", url ? `unexpected format: ${url}` : "missing");
} else {
  ok(`NEXT_PUBLIC_SUPABASE_URL format (${new URL(url).hostname})`);
}
console.log(`  anon key: ${anon ? `set (${anon.length} chars)` : "missing"}`);
console.log(`  service_role key: ${service ? `set (${service.length} chars)` : "missing"}`);
console.log(`  AUTH_SECRET: ${process.env.AUTH_SECRET ? "set" : "missing"}`);
console.log(`  ADMIN_EMAIL: ${process.env.ADMIN_EMAIL ? "set" : "missing"}`);

if (!url || !anon) {
  console.log("\nMissing URL or anon key — stopping.");
  process.exit(1);
}

const hasService = Boolean(service);
if (!hasService) {
  console.log(
    "\nNOTE: SUPABASE_SERVICE_ROLE_KEY is empty, so writes cannot be tested.\n" +
      "      Reads below use the public anon key instead.",
  );
}

const db = createClient(url, hasService ? service : anon, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("\n== Project ==");
try {
  const key = hasService ? service : anon;
  const res = await fetch(`${url}/rest/v1/demarches?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  if (res.status === 200) ok("REST endpoint reachable");
  else if (res.status === 404 || body.includes("PGRST205")) {
    ok("REST endpoint reachable (API key accepted)");
    bad("schema not installed", "table public.demarches does not exist");
  } else bad("REST endpoint", `HTTP ${res.status}: ${body.slice(0, 160)}`);
} catch (e) {
  bad("REST endpoint unreachable", e.message);
}

console.log("\n== Tables ==");
const tables = [
  "actualites",
  "demarches",
  "fokontany",
  "aides_sociales",
  "transport_lignes",
  "emplois",
  "services_municipaux",
  "evenements",
  "fiangonana",
  "demandes",
  "users",
];
for (const table of tables) {
  const { count, error } = await db.from(table).select("*", { count: "exact" }).limit(0);
  if (error) bad(`${table}`, error.message);
  else ok(`${table}: ${count ?? "unknown"} row(s)`);
}

if (!hasService) {
  console.log("\n== Write paths ==");
  console.log("  SKIP no service_role key: createDemande, createActualite, moderation, register/login");
  console.log("\n== RLS on the public anon key ==");
  const anonDb = createClient(url, anon, { auth: { persistSession: false } });
  for (const table of ["actualites", "demarches", "demandes", "users"]) {
    const { data, error } = await anonDb.from(table).select("*").limit(1);
    console.log(
      `  ${table}: ${error ? `blocked (${error.code ?? "?"} ${error.message})` : `${data.length} row(s) readable`}`,
    );
  }
  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED (read-only)" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

console.log("\n== Write path: demande (createDemande) ==");
const DEMARDE_SLUG = "fanamarinam-ponenana";
const { data: demarche } = await db
  .from("demarches")
  .select("id, slug")
  .eq("slug", DEMARDE_SLUG)
  .maybeSingle();
if (!demarche) bad(`lookup demarche by slug "${DEMARDE_SLUG}"`, "not found (seed missing?)");
else ok(`lookup demarche by slug → ${demarche.id}`);

const tag = `TEST-${Date.now()}`;
let demandeId = null;
{
  const { data, error } = await db
    .from("demandes")
    .insert({
      demarche_id: demarche?.id ?? null,
      demarche_slug: DEMARDE_SLUG,
      nom: `Test ${tag}`,
      telephone: "+261 34 000 0000",
      email: "test@example.com",
      message: "Vérification automatique de la connexion Supabase — ligne supprimée juste après.",
      statut: "en_attente",
    })
    .select("id, statut, created_at")
    .single();
  if (error) bad("insert demande", `${error.code ?? ""} ${error.message}`);
  else {
    demandeId = data.id;
    ok(`insert demande → id ${data.id}, statut ${data.statut}`);
  }
}

if (demandeId) {
  const { data, error } = await db.from("demandes").select("id, statut").eq("id", demandeId).maybeSingle();
  if (error || !data) bad("read back demande", error?.message ?? "not found");
  else ok("read back demande");

  const { error: modError } = await db.from("demandes").update({ statut: "traitee" }).eq("id", demandeId);
  if (modError) bad("moderate demande (statut=traitee)", modError.message);
  else ok("moderate demande (statut=traitee)");
}

console.log("\n== Write path: news + moderation (createActualite / moderateActualite) ==");
let newsId = null;
{
  const { data, error } = await db
    .from("actualites")
    .insert({
      titre_mg: `Fanamarinana ${tag}`,
      contenu_mg: "Fanamarinana ny fifandraisana amin'ny Supabase. Hovana avy hatrany ity vaovao ity.",
      categorie: "vaovao",
      auteur: "Test automatique",
      statut: "en_attente",
    })
    .select("id, statut")
    .single();
  if (error) bad("insert actualite", `${error.code ?? ""} ${error.message}`);
  else {
    newsId = data.id;
    ok(`insert actualite → id ${data.id}, statut ${data.statut}`);
  }
}

if (newsId) {
  const { data: published, error } = await db
    .from("actualites")
    .update({ statut: "publie" })
    .eq("id", newsId)
    .select("id, statut")
    .single();
  if (error || published?.statut !== "publie") bad("publish actualite", error?.message ?? "statut unchanged");
  else ok("publish actualite (statut=publie)");

  // What getPublishedNews() does.
  const { data: visible, error: visErr } = await db
    .from("actualites")
    .select("*")
    .eq("statut", "publie")
    .order("created_at", { ascending: false })
    .limit(20);
  if (visErr) bad("select published news", visErr.message);
  else ok(`select published news (${visible.length} visible, test row ${visible.some((r) => r.id === newsId) ? "present" : "MISSING"})`);
}

console.log("\n== Write path: citizen account (register / login query) ==");
let userId = null;
{
  const email = `${tag.toLowerCase()}@example.com`;
  const { data, error } = await db
    .from("users")
    .insert({ nom: "Test Citoyen", email, password_hash: "scrypt$test$test", role: "citoyen" })
    .select("id, email, role")
    .single();
  if (error) bad("insert user", `${error.code ?? ""} ${error.message}`);
  else {
    userId = data.id;
    ok(`insert user → id ${data.id}`);

    const { data: looked, error: lookErr } = await db
      .from("users")
      .select("id, nom, email, password_hash, role")
      .eq("email", email)
      .maybeSingle();
    if (lookErr || !looked) bad("login lookup by email", lookErr?.message ?? "not found");
    else ok("login lookup by email");
  }
}

console.log("\n== RLS on the public anon key ==");
const anonDb = createClient(url, anon, { auth: { persistSession: false } });
for (const table of ["actualites", "demarches", "demandes", "users"]) {
  const { data, error } = await anonDb.from(table).select("*").limit(1);
  console.log(
    `  ${table}: ${error ? `blocked/error (${error.code ?? "?"} ${error.message})` : `${data.length} row(s) readable`}`,
  );
}

console.log("\n== Cleanup ==");
const cleanup = [
  ["demandes", demandeId],
  ["actualites", newsId],
  ["users", userId],
];
for (const [table, id] of cleanup) {
  if (!id) continue;
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) bad(`delete from ${table}`, error.message);
  else ok(`deleted test row from ${table}`);
}

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
