"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { login, register, type AuthState } from "@/app/actions/auth";
import { useLang } from "./lang-provider";
import { Field, buttonClass, inputClass } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t } = useLang();
  const isLogin = mode === "login";
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
            : state?.error
              ? t.common.error
              : null;

  return (
    <form action={formAction} className="rounded-2xl border border-earth-200 bg-white p-6">
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

      <div className="mt-5 space-y-3">
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

        <Field
          label={t.auth.password}
          hint={isLogin ? undefined : "8+"}
        >
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

      <button type="submit" disabled={pending} className={`${buttonClass} mt-5 w-full`}>
        {pending
          ? t.common.submitting
          : isLogin
            ? t.auth.submitLogin
            : t.auth.submitRegister}
      </button>

      <p className="mt-4 text-sm text-earth-600">
        {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
        <Link
          href={isLogin ? "/hisoratra" : "/hiditra"}
          className="font-semibold text-leaf-700 hover:underline"
        >
          {isLogin ? t.nav.register : t.nav.login}
        </Link>
      </p>
    </form>
  );
}
