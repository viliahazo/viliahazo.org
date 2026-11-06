import type { MetadataRoute } from "next";
import { PUBLIC_PATHS } from "@/lib/site";
import { languageAlternates, languageUrl } from "@/lib/seo";

/** Priorité et fréquence de changement par page. */
const WEIGHTS: Record<string, { priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = {
  "/": { priority: 1, changeFrequency: "daily" },
  "/vaovao": { priority: 0.9, changeFrequency: "daily" },
  "/taratasy": { priority: 0.8, changeFrequency: "weekly" },
  "/fokontany": { priority: 0.8, changeFrequency: "monthly" },
  "/trano": { priority: 0.7, changeFrequency: "monthly" },
  "/fitaterana": { priority: 0.7, changeFrequency: "monthly" },
  "/asa": { priority: 0.7, changeFrequency: "weekly" },
  "/hetsika": { priority: 0.6, changeFrequency: "weekly" },
  "/fianarana": { priority: 0.7, changeFrequency: "monthly" },
  "/mifandraisa": { priority: 0.6, changeFrequency: "monthly" },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PATHS.flatMap((path) => {
    const meta = WEIGHTS[path] ?? { priority: 0.5, changeFrequency: "monthly" as const };
    const alternates = languageAlternates(path);

    return (["mg", "fr"] as const).map((lang) => ({
      url: languageUrl(path, lang),
      lastModified,
      changeFrequency: meta.changeFrequency,
      priority: lang === "mg" ? meta.priority : Math.max(0.4, meta.priority - 0.1),
      alternates: { languages: alternates },
    }));
  });
}
