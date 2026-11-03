import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Vaovao sy serivisy ho an'ny mponina`,
    short_name: SITE_NAME,
    description:
      "Sehatra ofisialy ho an'ny mponina eto Viliahazo: vaovao, taratasy, fanampiana sosialy, fitaterana, asa ary hetsika kolontsaina.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f0",
    theme_color: "#25582b",
    lang: "mg",
    dir: "ltr",
    categories: ["government", "news", "utilities"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      { name: "Vaovao", url: "/vaovao" },
      { name: "Taratasy", url: "/taratasy" },
      { name: "Asa", url: "/asa" },
    ],
  };
}
