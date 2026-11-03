import Link from "next/link";
import { getLangAndDict } from "@/lib/lang";
import { getFokontany } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { Badge, Card } from "@/components/ui";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLangAndDict();
  return pageMetadata({
    title: t.home.title,
    description: t.home.text,
    path: "/fokontany",
  });
}

export default async function FokontanyPage() {
  const { lang, t } = await getLangAndDict();
  const fokontany = await getFokontany();

  return (
    < >
      <h1 className="text-2xl font-bold text-leaf-900 mb-6">
        {t.home.fokontanyTitle}
      </h1>

      <p className="text-sm text-earth-600 mb-8">
        {t.home.fokontanyText}
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fokontany.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-earth-200 bg-earth-50 p-4 hover:border-leaf-300 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <Badge tone="leaf">
                <span aria-hidden />
              </Badge>
              <span className="font-medium text-earth-900">{item.nom}</span>
            </div>

            {item.chef && (
              <p className="text-xs text-earth-500">
                Chef Fokontany: {item.chef}
              </p>
            )}

            <div className="mt-3 pt-3 border-t border-earth-200">
              <a
                href={`mailto:${item.contact}`}
                className="text-sm text-leaf-600 hover:underline"
              >
                {t.common.contact}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}