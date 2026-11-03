"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { saveRecord, type ContentState } from "@/app/actions/content";
import type { AdminField } from "@/lib/admin-schema";
import { useLang } from "./lang-provider";
import { Field, buttonClass, inputClass } from "./ui";

const TEXTAREA_ROWS = 6;

function Input({
  field,
  value,
  lang,
  secretHint,
}: {
  field: AdminField;
  value: string;
  lang: "mg" | "fr";
  secretHint: string;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          name={field.name}
          defaultValue={value}
          rows={TEXTAREA_ROWS}
          required={field.required}
          className={inputClass}
        />
      );
    case "list":
      return (
        <textarea
          name={field.name}
          defaultValue={value}
          rows={5}
          className={`${inputClass} font-mono text-xs`}
        />
      );
    case "select":
      return (
        <select
          name={field.name}
          defaultValue={value || field.options?.[0]?.value}
          required={field.required}
          className={inputClass}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {lang === "fr" ? option.fr : option.mg}
            </option>
          ))}
        </select>
      );
    case "number":
      return (
        <input
          type="number"
          name={field.name}
          defaultValue={value}
          required={field.required}
          className={inputClass}
        />
      );
    case "date":
      return (
        <input
          type="date"
          name={field.name}
          defaultValue={value}
          required={field.required}
          className={inputClass}
        />
      );
    case "datetime":
      return (
        <input
          type="datetime-local"
          name={field.name}
          defaultValue={value}
          required={field.required}
          className={inputClass}
        />
      );
    case "email":
      return (
        <input
          type="email"
          name={field.name}
          defaultValue={value}
          required={field.required}
          autoComplete="off"
          className={inputClass}
        />
      );
    case "password":
      return (
        <input
          type="password"
          name={field.name}
          defaultValue=""
          minLength={8}
          autoComplete="new-password"
          placeholder={secretHint}
          className={inputClass}
        />
      );
    default:
      return (
        <input
          type="text"
          name={field.name}
          defaultValue={value}
          required={field.required}
          className={inputClass}
        />
      );
  }
}

/**
 * Formulaire d'édition générique : un champ par colonne déclarée dans
 * lib/admin-schema.ts. Fonctionne aussi bien en création qu'en modification.
 */
export function AdminRecordForm({
  tableKey,
  id,
  fields,
  values,
}: {
  tableKey: string;
  id: string;
  fields: AdminField[];
  values: Record<string, string>;
}) {
  const { lang, t } = useLang();
  const [state, formAction, pending] = useActionState<ContentState, FormData>(
    saveRecord,
    null,
  );

  const errors: Record<string, string> = {
    missing: t.admin.errorMissing,
    invalid: t.admin.errorInvalid,
    duplicate: t.admin.errorDuplicate,
    weak: t.admin.errorWeak,
    db: t.admin.errorDb,
  };

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-earth-200 bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="__table" value={tableKey} />
      <input type="hidden" name="__id" value={id} />

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const wide = field.type === "textarea" || field.type === "list";
          return (
            <div key={field.name} className={wide ? "sm:col-span-2" : undefined}>
              <Field
                label={lang === "fr" ? field.labelFr : field.label}
                hint={
                  field.required
                    ? t.admin.requiredHint
                    : field.secret
                      ? t.admin.secretHint
                      : undefined
                }
              >
                <Input
                  field={field}
                  value={values[field.name] ?? ""}
                  lang={lang}
                  secretHint={t.admin.secretHint}
                />
              </Field>
            </div>
          );
        })}
      </div>

      {state?.error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
          {errors[state.error] ?? t.common.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${buttonClass} mt-5`}>
        <Save className="h-4 w-4" aria-hidden />
        {pending ? t.admin.saving : t.admin.save}
      </button>
    </form>
  );
}
