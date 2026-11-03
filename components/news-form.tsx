"use client";

import { useActionState } from "react";
import { CheckCircle2, PenLine } from "lucide-react";
import Link from "next/link";
import { createActualite, type NewsState } from "@/app/actions/news";
import { useLang } from "./lang-provider";
import { Field, buttonClass, inputClass } from "./ui";

export function NewsForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useLang();
  const [state, formAction, pending] = useActionState<NewsState, FormData>(
    createActualite,
    null,
  );

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-earth-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-earth-900">
          <PenLine className="h-4 w-4 text-leaf-700" aria-hidden />
          {t.news.formTitle}
        </h2>
        <p className="mt-2 text-sm text-earth-600">{t.news.contributeText}</p>
        <Link href="/hiditra" className={`${buttonClass} mt-4`}>
          {t.nav.login} / {t.nav.register}
        </Link>
      </div>
    );
  }

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-leaf-900">
          <CheckCircle2 className="h-5 w-5 text-leaf-700" aria-hidden />
          {t.news.formSuccess}
        </h2>
        <p className="mt-2 text-sm text-leaf-800">{t.news.moderationNote}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-earth-200 bg-white p-5"
    >
      <h2 className="flex items-center gap-2 text-base font-bold text-earth-900">
        <PenLine className="h-4 w-4 text-leaf-700" aria-hidden />
        {t.news.formTitle}
      </h2>
      <p className="mt-2 text-sm text-earth-600">{t.news.contributeText}</p>

      <div className="mt-4 space-y-3">
        <Field label={t.news.formTitleField}>
          <input
            name="titre"
            required
            minLength={5}
            maxLength={120}
            className={inputClass}
            placeholder={t.news.formTitleField}
          />
        </Field>

        <Field label={t.news.formCategory}>
          <select name="categorie" className={inputClass} defaultValue="vaovao">
            {(["vaovao", "fampitandrina", "hevitra", "hetsika"] as const).map((key) => (
              <option key={key} value={key}>
                {t.news.categories[key]}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.news.formContent}>
          <textarea
            name="contenu"
            required
            minLength={20}
            maxLength={3000}
            rows={5}
            className={inputClass}
            placeholder={t.news.formContent}
          />
        </Field>

        <Field label={t.news.formImage} hint={t.news.uploadHint}>
          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-leaf-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-leaf-800 hover:file:bg-leaf-200 cursor-pointer`}
          />
        </Field>
      </div>

      {state?.error ? (
        <p className="mt-3 text-sm font-medium text-red-700">
          {state.error === "auth" ? t.admin.loginRequired : t.common.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${buttonClass} mt-4 w-full`}>
        {pending ? t.common.submitting : t.common.send}
      </button>
    </form>
  );
}
