import { cookies, headers } from "next/headers";
import { getDictionary, LANG_COOKIE, parseLang, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  // 1. Langue demandée explicitement dans l'URL (?lang=fr) par le proxy.
  const fromUrl = (await headers()).get("x-lang");
  if (fromUrl === "fr" || fromUrl === "mg") return fromUrl;

  // 2. Sinon, préférence mémorisée dans le cookie.
  const store = await cookies();
  return parseLang(store.get(LANG_COOKIE)?.value);
}

export async function getLangAndDict() {
  const lang = await getLang();
  return { lang, t: getDictionary(lang) };
}
