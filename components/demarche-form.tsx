"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { createDemande, type DemandeState } from "@/app/actions/demande";
import type { Demarche } from "@/lib/types";
import { pick } from "@/lib/i18n";
import { useLang } from "./lang-provider";
import { Field, buttonClass, inputClass } from "./ui";

export function DemarcheForm({ demarches }: { demarches: Demarche[] }) {
  const { lang, t } = useLang();
  const [state, formAction, pending] = useActionState<DemandeState, FormData>(
    createDemande,
    null,
  );

  if (demarches.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-earth-300 bg-white p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-earth-900">
          <Send className="h-4 w-4 text-leaf-700" aria-hidden />
          {t.procedures.formTitle}
        </h2>
        <p className="mt-2 text-sm text-earth-600">{t.procedures.empty}</p>
      </div>
    );
  }

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-leaf-900">
          <CheckCircle2 className="h-5 w-5 text-leaf-700" aria-hidden />
          {t.procedures.formSuccess}
        </h2>
      </div>
    );
  }

  return (
    <form
      id="hangataka"
      action={formAction}
      className="rounded-2xl border border-earth-200 bg-white p-5"
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-earth-900">
        <Send className="h-4 w-4 text-leaf-700" aria-hidden />
        {t.procedures.formTitle}
      </h2>

      <div className="mt-4 space-y-3">
        <Field label={t.procedures.formChoose}>
          <select name="demarche_slug" required className={inputClass}>
            {demarches.map((demarche) => (
              <option key={demarche.slug} value={demarche.slug}>
                {pick(lang, demarche.titre_mg, demarche.titre_fr)}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t.procedures.formName}>
            <input
              name="nom"
              required
              minLength={3}
              maxLength={120}
              className={inputClass}
              autoComplete="name"
            />
          </Field>
          <Field label={t.procedures.formPhone}>
            <input
              name="telephone"
              required
              type="tel"
              inputMode="tel"
              placeholder="034 00 000 00"
              className={inputClass}
              autoComplete="tel"
            />
          </Field>
        </div>

        <Field label={t.procedures.formEmail} hint={t.common.optional}>
          <input
            name="email"
            type="email"
            className={inputClass}
            autoComplete="email"
          />
        </Field>

        <Field label={t.procedures.formMessage} hint={t.common.optional}>
          <textarea
            name="message"
            rows={3}
            maxLength={1000}
            className={inputClass}
          />
        </Field>
      </div>

      {state?.error ? (
        <p className="mt-3 text-sm font-medium text-red-700">
          {state.error === "invalid" ? t.auth.missing : t.common.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${buttonClass} mt-4 w-full`}>
        {pending ? t.common.submitting : t.common.send}
      </button>
    </form>
  );
}
