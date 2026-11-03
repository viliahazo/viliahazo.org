import type { AdminTable } from "./admin-schema";
import { formatDate, formatDateTime } from "./format";
import type { Lang } from "./i18n";

function fieldOf(spec: AdminTable, column: string) {
  return spec.fields.find((field) => field.name === column);
}

/** Libellé bilingue d'une colonne / d'un champ. */
export function fieldLabel(spec: AdminTable, name: string, lang: Lang): string {
  const field = fieldOf(spec, name);
  if (field) return lang === "fr" ? field.labelFr : field.label;
  if (name === "auth_provider") {
    return lang === "fr" ? "Méthode d'inscription" : "Fomba fidirana";
  }
  if (name === "created_at") return lang === "fr" ? "Créé le" : "Daty";
  return name;
}

/** Identifie le moyen de connexion (Google OAuth vs Email/Mot de passe). */
export function getAuthProviderInfo(row: Record<string, unknown>, lang: Lang) {
  const hash = String(row.password_hash ?? "");
  if (hash.startsWith("oauth:google") || hash === "oauth:google") {
    return {
      provider: "google" as const,
      label: "Google",
    };
  }
  if (hash.startsWith("oauth:")) {
    const prov = hash.replace("oauth:", "");
    return {
      provider: prov,
      label: prov.charAt(0).toUpperCase() + prov.slice(1),
    };
  }
  return {
    provider: "email" as const,
    label: lang === "fr" ? "E-mail" : "Mailaka",
  };
}

/** Valeur d'une cellule, lisible et localisée. */
export function formatCell(
  spec: AdminTable,
  column: string,
  value: unknown,
  lang: Lang,
  row?: Record<string, unknown>,
): string {
  if (column === "auth_provider" && row) {
    return getAuthProviderInfo(row, lang).label;
  }

  if (value === null || value === undefined || value === "") return "—";

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(" · ") : "—";
  }

  const field = fieldOf(spec, column);

  if (field?.type === "select") {
    const option = field.options?.find((item) => item.value === value);
    if (option) return lang === "fr" ? option.fr : option.mg;
  }

  if (field?.type === "date") return formatDate(lang, String(value));
  if (field?.type === "datetime" || column.endsWith("_at")) {
    return formatDateTime(lang, String(value));
  }

  return String(value);
}

/** Convertit une valeur base de données en valeur d'input HTML. */
export function toInputValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("\n");

  const text = String(value);
  if (type === "datetime") return text.slice(0, 16);
  if (type === "date") return text.slice(0, 10);
  return text;
}
