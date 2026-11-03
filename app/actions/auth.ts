"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getDb } from "@/lib/db";
import {
  buildSessionUser,
  emptySessionCookie,
  hashPassword,
  sessionCookie,
  verifyPassword,
} from "@/lib/auth";

export type AuthState = { error?: string; ok?: boolean } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");

  if (!email || !password) return { error: "missing" };

  // Municipal administrator account (credentials come from env).
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
    const admin = buildSessionUser("admin", "Mairie Viliahazo", email, "admin");
    (await cookies()).set(sessionCookie(admin));
    redirect("/admin");
  }

  const db = getDb();
  if (!db) return { error: "generic" };

  const { data, error } = await db
    .from("users")
    .select("id, nom, email, password_hash, role")
    .eq("email", email)
    .maybeSingle<{
      id: string;
      nom: string;
      email: string;
      password_hash: string;
      role: "citoyen" | "admin";
    }>();

  if (error || !data || !verifyPassword(password, data.password_hash)) {
    return { error: "invalid" };
  }

  (await cookies()).set(sessionCookie(buildSessionUser(data.id, data.nom, data.email, data.role)));
  redirect(data.role === "admin" ? "/admin" : "/vaovao");
}

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const nom = readString(formData, "nom");
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");

  if (!nom || !email || !password) return { error: "missing" };
  if (!EMAIL_RE.test(email)) return { error: "invalid" };
  if (password.length < 8) return { error: "weak" };

  const db = getDb();
  if (!db) return { error: "generic" };

  const { data, error } = await db
    .from("users")
    .insert({ nom, email, password_hash: hashPassword(password), role: "citoyen" })
    .select("id, nom, email, role")
    .single<{ id: string; nom: string; email: string; role: "citoyen" | "admin" }>();

  if (error) {
    return { error: error.code === "23505" ? "exists" : "generic" };
  }

  (await cookies()).set(sessionCookie(buildSessionUser(data.id, data.nom, data.email, data.role)));
  redirect("/vaovao");
}

export async function logout(): Promise<void> {
  (await cookies()).set(emptySessionCookie());
  redirect("/");
}

export async function signInWithGoogle(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    redirect("/hiditra?error=supabase_not_configured");
  }

  // Détermine l'origine hôte actuelle (localhost ou domaine de production)
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto =
    h.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  const origin = host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL || "https://viliahazo.org").replace(/\/+$/, "");

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    console.error("[auth] Google OAuth error:", error?.message);
    redirect("/hiditra?error=oauth_failed");
  }

  redirect(data.url);
}
