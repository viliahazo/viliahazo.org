import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  FileText,
  Inbox,
  ShieldCheck,
  X,
} from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { countTableRows, getAllNews, getDemandes } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { moderateActualite } from "@/app/actions/admin";
import { setDemandeStatut } from "@/app/actions/content";
import { ADMIN_TABLES } from "@/lib/admin-schema";
import { AdminLoginPrompt } from "@/components/admin-login-prompt";
import { Badge, Card, EmptyState, PageHero } from "@/components/ui";

export default async function AdminPage() {
  const { lang, t } = await getLangAndDict();
  const user = await getSessionUser();

  if (!user || !isAdmin(user)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <AdminLoginPrompt />
      </div>
    );
  }

  const [counts, news, demandes] = await Promise.all([
    Promise.all(
      ADMIN_TABLES.map(async (spec) => ({
        spec,
        count: await countTableRows(spec.table),
      })),
    ),
    getAllNews(),
    getDemandes(),
  ]);

  const pendingNews = news.filter((item) => item.statut === "en_attente");
  const openDemandes = demandes.filter((item) => item.statut === "en_attente");

  return (
    <>
      <PageHero
        title={t.admin.title}
        subtitle={t.admin.subtitle}
        icon={<ShieldCheck className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-6 text-sm text-earth-600">
          {t.admin.actingAs} <strong className="text-earth-900">{user.nom}</strong>
        </p>

        {/* ------------------------ Toutes les sections ------------------------ */}
        <section aria-label={t.admin.content}>
          <h2 className="mb-1 text-lg font-bold text-leaf-900">{t.admin.content}</h2>
          <p className="mb-4 text-sm text-earth-600">{t.admin.contentSubtitle}</p>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {counts.map(({ spec, count }) => (
              <li key={spec.key}>
                <Link
                  href={`/admin/${spec.key}`}
                  className="group flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-earth-900 group-hover:text-leaf-900">
                      {lang === "fr" ? spec.labelFr : spec.label}
                    </h3>
                    <Badge tone="leaf">{count}</Badge>
                  </div>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-earth-600">
                    {lang === "fr" ? spec.descriptionFr : spec.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-leaf-700">
                    {t.admin.openList}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------ Vaovao miandry ------------------------ */}
        <section className="mt-10" aria-label={t.admin.pendingNews}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-leaf-900">
            <Inbox className="h-5 w-5 text-leaf-700" aria-hidden />
            {t.admin.pendingNews}
            <Badge tone="amber">{pendingNews.length}</Badge>
            <Link
              href="/admin/actualites"
              className="ml-auto text-xs font-semibold text-leaf-700 hover:underline"
            >
              {t.admin.allNews}
            </Link>
          </h2>

          {pendingNews.length === 0 ? (
            <EmptyState text={t.admin.noPending} />
          ) : (
            <ul className="space-y-3">
              {pendingNews.map((item) => (
                <li key={item.id}>
                  <Card>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="earth">{t.news.categories[item.categorie]}</Badge>
                      <span className="text-xs text-earth-500">
                        {formatDate(lang, item.created_at)}
                      </span>
                      {item.auteur ? (
                        <span className="text-xs text-earth-500">· {item.auteur}</span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-base font-bold text-earth-900">
                      {pick(lang, item.titre_mg, item.titre_fr)}
                    </h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-earth-700">
                      {pick(lang, item.contenu_mg, item.contenu_fr)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <form action={moderateActualite}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="statut" value="publie" />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-600 px-3 py-2 text-sm font-semibold text-white hover:bg-leaf-700"
                        >
                          <Check className="h-4 w-4" aria-hidden />
                          {t.admin.approve}
                        </button>
                      </form>
                      <form action={moderateActualite}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="statut" value="rejete" />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
                        >
                          <X className="h-4 w-4" aria-hidden />
                          {t.admin.reject}
                        </button>
                      </form>
                      <Link
                        href={`/admin/actualites/${item.id}`}
                        className="text-sm font-semibold text-leaf-700 hover:underline"
                      >
                        {t.admin.editRecord}
                      </Link>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* -------------------------- Fangatahana -------------------------- */}
        <section className="mt-10" aria-label={t.admin.demandes}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-leaf-900">
            <FileText className="h-5 w-5 text-leaf-700" aria-hidden />
            {t.admin.demandes}
            <Badge tone="amber">{openDemandes.length}</Badge>
            <Link
              href="/admin/demandes"
              className="ml-auto text-xs font-semibold text-leaf-700 hover:underline"
            >
              {t.common.seeAll}
            </Link>
          </h2>

          {openDemandes.length === 0 ? (
            <EmptyState text={t.admin.noPending} />
          ) : (
            <ul className="grid gap-3 lg:grid-cols-2">
              {openDemandes.map((demande) => (
                <li key={demande.id}>
                  <Card>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-earth-900">{demande.nom}</p>
                      <span className="text-xs text-earth-500">
                        {formatDate(lang, demande.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-earth-500">
                      {t.admin.procedure} :{" "}
                      <span className="font-semibold text-leaf-800">
                        {demande.demarche_slug}
                      </span>
                    </p>
                    <p className="mt-2 flex flex-wrap gap-3 text-sm text-earth-700">
                      <a href={`tel:${demande.telephone.replace(/\s/g, "")}`}>
                        {demande.telephone}
                      </a>
                      {demande.email ? (
                        <a href={`mailto:${demande.email}`} className="hover:underline">
                          {demande.email}
                        </a>
                      ) : null}
                    </p>
                    {demande.message ? (
                      <p className="mt-2 rounded-lg bg-earth-50 p-2.5 text-sm text-earth-700">
                        {demande.message}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <form action={setDemandeStatut}>
                        <input type="hidden" name="id" value={demande.id} />
                        <input type="hidden" name="statut" value="traitee" />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-600 px-3 py-2 text-sm font-semibold text-white hover:bg-leaf-700"
                        >
                          <Check className="h-4 w-4" aria-hidden />
                          {t.admin.markProcessed}
                        </button>
                      </form>
                      <form action={setDemandeStatut}>
                        <input type="hidden" name="id" value={demande.id} />
                        <input type="hidden" name="statut" value="rejetee" />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-earth-300 bg-white px-3 py-2 text-sm font-semibold text-earth-800 hover:bg-earth-50"
                        >
                          <X className="h-4 w-4" aria-hidden />
                          {t.admin.reject}
                        </button>
                      </form>
                      <Link
                        href={`/admin/demandes/${demande.id}`}
                        className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-leaf-700 hover:underline"
                      >
                        {t.admin.editRecord}
                      </Link>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        {demandes.some((item) => item.statut !== "en_attente") ? (
          <p className="mt-6 text-xs text-earth-500">
            <Clock className="mr-1 inline h-3.5 w-3.5" aria-hidden />
            {t.common.processed} :{" "}
            {demandes.filter((item) => item.statut !== "en_attente").length}
          </p>
        ) : null}
      </div>
    </>
  );
}
