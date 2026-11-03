"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  login,
  register,
  signInWithGoogle,
  type AuthState,
} from "@/app/actions/auth";
import { GoogleIcon } from "./icons";
import { useLang } from "./lang-provider";
import { Field, buttonClass, inputClass } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const isLogin = mode === "login";

  const [oauthLoading, setOauthLoading] = useState(false);

  // Intercepte le fragment d'URL #access_token=... renvoyé par le flux OAuth implicite de Supabase
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token=")) return;

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");
    if (!accessToken) return;

    setOauthLoading(true);

    fetch("/api/auth/oauth-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.redirect) {
          // Nettoie le fragment de l'URL pour ne pas exposer le token
          window.history.replaceState(null, "", window.location.pathname);
          window.location.assign(data.redirect);
        } else {
          setOauthLoading(false);
        }
      })
      .catch((err) => {
        console.error("[oauth] Token exchange failed:", err);
        setOauthLoading(false);
      });
  }, []);

  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    isLogin ? login : register,
    null,
  );

  const errorText =
    state?.error === "invalid"
      ? t.auth.invalid
      : state?.error === "exists"
        ? t.auth.exists
        : state?.error === "weak"
          ? t.auth.weak
          : state?.error === "missing"
            ? t.auth.missing
            : state?.error || oauthError
              ? t.common.error
              : null;

  if (oauthLoading) {
    return (
      <div className="rounded-2xl border border-earth-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-leaf-600 border-t-transparent" />
        <p className="text-sm font-semibold text-earth-800">
          {t.common.submitting}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-earth-200 bg-white p-6 shadow-sm">
      <h1 className="flex items-center gap-2 text-xl font-bold text-leaf-900">
        {isLogin ? (
          <LogIn className="h-5 w-5" aria-hidden />
        ) : (
          <UserPlus className="h-5 w-5" aria-hidden />
        )}
        {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
      </h1>
      <p className="mt-2 text-sm text-earth-600">
        {isLogin ? t.auth.loginText : t.auth.registerText}
      </p>

      {/* ----------------- Bouton Google Sign-In ----------------- */}
      <form action={signInWithGoogle} className="mt-5">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-earth-300 bg-white px-4 py-2.5 text-sm font-semibold text-earth-800 shadow-sm transition hover:bg-earth-50 hover:border-earth-400 active:scale-[0.99] cursor-pointer"
        >
          <GoogleIcon className="h-5 w-5" />
          <span>{isLogin ? t.auth.googleSignIn : t.auth.googleSignUp}</span>
        </button>
      </form>

      {/* ----------------- Séparateur "na" / "ou" ----------------- */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="w-full border-t border-earth-200" />
        <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-earth-400">
          {t.auth.or}
        </span>
      </div>

      {/* ----------------- Formulaire Email / Mot de passe ----------------- */}
      <form action={formAction}>
        <div className="space-y-3">
          {!isLogin ? (
            <Field label={t.auth.name}>
              <input
                name="nom"
                required
                maxLength={120}
                className={inputClass}
                autoComplete="name"
              />
            </Field>
          ) : null}

          <Field label={t.auth.email}>
            <input
              name="email"
              type="email"
              required
              className={inputClass}
              autoComplete="email"
            />
          </Field>

          <Field label={t.auth.password} hint={isLogin ? undefined : "8+"}>
            <input
              name="password"
              type="password"
              required
              minLength={isLogin ? undefined : 8}
              className={inputClass}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </Field>
        </div>

        {errorText ? (
          <p className="mt-3 text-sm font-medium text-red-700">{errorText}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={`${buttonClass} mt-5 w-full`}
        >
          {pending
            ? t.common.submitting
            : isLogin
              ? t.auth.submitLogin
              : t.auth.submitRegister}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-earth-600">
        {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
        <Link
          href={isLogin ? "/hisoratra" : "/hiditra"}
          className="font-semibold text-leaf-700 hover:underline"
        >
          {isLogin ? t.nav.register : t.nav.login}
        </Link>
      </p>
    </div>
  );
}
