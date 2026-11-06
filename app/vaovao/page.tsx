import { AlertTriangle, Newspaper } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import {
  cleanActualiteContent,
  getActualiteImage,
  getPublishedNews,
  getRepliesForActualite,
} from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { pick } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { metadataForPath } from "@/lib/seo";
import { Badge, EmptyState, PageHero } from "@/components/ui";
import { NewsForm } from "@/components/news-form";
import { VaovaoReplies } from "@/components/vaovao-replies";

export const generateMetadata = () => metadataForPath("/vaovao");

export default async function NewsPage() {
  const { lang, t } = await getLangAndDict();
  const [news, user] = await Promise.all([getPublishedNews(30), getSessionUser()]);

  // Charge les réponses et images pour chaque actualité
  const newsWithReplies = await Promise.all(
    news.map(async (item) => ({
      item,
      image: getActualiteImage(item),
      replies: await getRepliesForActualite(item.id, user),
    })),
  );

  return (
    <>
      <PageHero
        title={t.news.title}
        subtitle={t.news.subtitle}
        path="/vaovao"
        icon={<Newspaper className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.6fr_1fr]">
        <section aria-label={t.news.title}>
          <h2 className="mb-4 text-lg font-bold text-leaf-900">
            {t.home.latestNews}
          </h2>

          {newsWithReplies.length === 0 ? (
            <EmptyState text={t.news.empty} />
          ) : (
            <ul className="space-y-6">
              {newsWithReplies.map(({ item, image, replies }) => (
                <li key={item.id}>
                  <article className="rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:border-leaf-300">
                    {/* Image Supabase Storage si présente */}
                    {image && (
                      <div className="mb-4 overflow-hidden rounded-xl border border-earth-100 bg-earth-50">
                        <img
                          src={image}
                          alt={pick(lang, item.titre_mg, item.titre_fr)}
                          className="max-h-80 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        tone={item.categorie === "fampitandrina" ? "amber" : "leaf"}
                      >
                        {item.categorie === "fampitandrina" ? (
                          <AlertTriangle className="h-3 w-3" aria-hidden />
                        ) : null}
                        {t.news.categories[item.categorie]}
                      </Badge>
                      <span className="text-xs text-earth-500">
                        {formatDate(lang, item.created_at)}
                      </span>
                      {item.auteur ? (
                        <span className="text-xs text-earth-500">· {item.auteur}</span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-earth-900">
                      {pick(lang, item.titre_mg, item.titre_fr)}
                    </h3>

                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-earth-700">
                      {cleanActualiteContent(pick(lang, item.contenu_mg, item.contenu_fr))}
                    </p>

                    {/* Section interactive des réponses */}
                    <VaovaoReplies
                      actualiteId={item.id}
                      initialReplies={replies}
                      currentUser={user}
                    />
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <NewsForm isLoggedIn={Boolean(user)} />
        </aside>
      </div>
    </>
  );
}
