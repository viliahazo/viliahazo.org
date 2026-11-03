import { getLangAndDict } from "@/lib/lang";
import { getFokontany } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { Card, EmptyState, PageHero, inputClass, buttonClass } from "@/components/ui";
import { MapPin, Mail, Phone, Clock, Users } from "lucide-react";
import type { Metadata } from "next";
import { SITE_ORG } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLangAndDict();
  return pageMetadata({
    title: t.mifandraisa.title,
    description: t.mifandraisa.subtitle,
    path: "/mifandraisa",
  });
}

export default async function MifandraisaPage() {
  const { t } = await getLangAndDict();
  const fokontany = await getFokontany();

  return (
    <>
      <PageHero
        title={t.mifandraisa.title}
        subtitle={t.mifandraisa.subtitle}
        icon={<Mail className="h-6 w-6" aria-hidden />}
        path="/mifandraisa"
      />

      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">

        {/* ─── Contact form ─────────────────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-earth-900 mb-5">
            {t.mifandraisa.formTitle}
          </h2>

          <form className="space-y-4" action="/mifandraisa" method="POST">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-earth-800">
                  {t.mifandraisa.formName}
                </span>
                <input
                  type="text"
                  name="nom"
                  required
                  autoComplete="name"
                  placeholder={t.mifandraisa.formName}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-earth-800">
                  {t.mifandraisa.formEmail}
                </span>
                <input
                  type="email"
                  name="mailaka"
                  required
                  autoComplete="email"
                  placeholder={t.mifandraisa.formEmail}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-earth-800">
                {t.mifandraisa.formPhone}
                <span className="ml-1 text-xs font-normal text-earth-400">
                  ({t.common.optional})
                </span>
              </span>
              <input
                type="tel"
                name="telephone"
                autoComplete="tel"
                placeholder="034 00 000 00"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-earth-800">
                {t.mifandraisa.formMessage}
              </span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={t.mifandraisa.formMessage}
                className={`${inputClass} resize-y min-h-[120px]`}
              />
            </label>

            <button type="submit" className={buttonClass}>
              <Mail className="h-4 w-4" aria-hidden />
              {t.mifandraisa.formSend}
            </button>
          </form>
        </Card>

        {/* ─── Adresse + horaires ───────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Adresse */}
          <Card className="bg-leaf-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-leaf-700" aria-hidden />
              <h2 className="text-base font-bold text-earth-900">
                {t.mifandraisa.addressTitle}
              </h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-earth-500 text-xs uppercase tracking-wide font-semibold">
                  {t.common.siteName}
                </dt>
                <dd className="font-medium text-earth-900">{SITE_ORG.name}</dd>
              </div>
              <div>
                <dt className="text-earth-500 text-xs uppercase tracking-wide font-semibold">
                  {t.common.phone}
                </dt>
                <dd className="font-medium text-earth-900">
                  <a
                    href={`tel:${SITE_ORG.phone}`}
                    className="hover:text-leaf-700 hover:underline"
                  >
                    {SITE_ORG.phone.replace("+261", "0").replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, "$1 $2 $3 $4")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-earth-500 text-xs uppercase tracking-wide font-semibold">
                  {t.common.email}
                </dt>
                <dd className="font-medium text-earth-900">
                  <a
                    href={`mailto:${SITE_ORG.email}`}
                    className="hover:text-leaf-700 hover:underline break-all"
                  >
                    {SITE_ORG.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Horaires */}
          <Card className="bg-leaf-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-leaf-700" aria-hidden />
              <h2 className="text-base font-bold text-earth-900">
                {t.mifandraisa.hoursTitle}
              </h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-earth-600">{t.mifandraisa.hoursMon}</dt>
                <dd className="font-semibold text-earth-900 tabular-nums">7:30 – 16:00</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-earth-600">{t.mifandraisa.hoursSat}</dt>
                <dd className="font-semibold text-earth-400 italic">
                  {t.mifandraisa.hoursClosed}
                </dd>
              </div>
              <div className="mt-3 rounded-lg bg-leaf-100/60 px-3 py-2 text-xs text-leaf-800">
                {t.home.contactText}
              </div>
            </dl>
          </Card>
        </div>

        {/* ─── Les 8 Fokontany ──────────────────────────────────────────── */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-leaf-700" aria-hidden />
            <h2 className="text-base font-bold text-earth-900">
              {t.mifandraisa.fokontanyTitle}
            </h2>
          </div>
          <p className="text-sm text-earth-600 mb-5">{t.mifandraisa.fokontanyText}</p>

          {fokontany.length === 0 ? (
            <EmptyState text={t.fokontany.empty} />
          ) : (
            <ul className="divide-y divide-earth-100">
              {fokontany.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div>
                    <span className="font-semibold text-earth-900 text-sm">{item.nom}</span>
                    {item.chef && (
                      <span className="ml-2 text-xs text-earth-500">
                        — {item.chef}
                      </span>
                    )}
                  </div>
                  {item.contact && (
                    <a
                      href={
                        item.contact.includes("@")
                          ? `mailto:${item.contact}`
                          : `tel:${item.contact.replace(/\s/g, "")}`
                      }
                      className="inline-flex items-center gap-1 text-xs text-leaf-700 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      {item.contact}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
