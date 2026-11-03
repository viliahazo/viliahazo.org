import { cookies } from "next/headers";
import { getDictionary, LANG_COOKIE, parseLang, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return parseLang(store.get(LANG_COOKIE)?.value);
}

export async function getLangAndDict() {
  const lang = await getLang();
  return { lang, t: getDictionary(lang) };
}
