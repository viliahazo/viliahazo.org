import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Mail, Pencil, Plus, ShieldCheck } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { getTableRows } from "@/lib/data";
import { NO_INDEX } from "@/lib/seo";
import { getAdminTable } from "@/lib/admin-schema";
import { fieldLabel, formatCell, getAuthProviderInfo } from "@/lib/admin-format";
import { AdminLoginPrompt } from "@/components/admin-login-prompt";
import { AdminDeleteForm } from "@/components/admin-delete-form";
import { GoogleIcon } from "@/components/icons";
import { Badge, PageHero } from "@/components/ui";

type Params = { params: Promise<{ table: string }> };

function statutTone(value: unknown): "leaf" | "amber" | "red" {
  const statut = String(value ?? "");
  if (statut === "publie" || statut === "traitee") return "leaf";
  if (statut === "en_attente") return "amber";
  return "red";
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { table } = await params;
  const spec = getAdminTable(table);
  return { title: spec ? spec.label : "Fitantanana", robots: NO_INDEX };
}

export default async function AdminTablePage({ params }: Params) {
  const { table } = await params;
  const spec = getAdminTable(table);
  if (!spec) notFound();

  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <AdminLoginPrompt />
      </div>
    );
  }

  const { lang, t } = await getLangAndDict();
  const rows = await getTableRows<Record<string, unknown>>(spec.table, spec.order);

  return (
    <>
      <PageHero
        title={lang === "fr" ? spec.labelFr : spec.label}
        subtitle={lang === "fr" ? spec.descriptionFr : spec.description}
        icon={<ShieldCheck className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t.admin.backToList}
          </Link>

          <div className="flex items-center gap-3">
            <Badge tone="leaf">
              {t.admin.total} : {rows.length}
            </Badge>
            {spec.canCreate ? (
              <Link
                href={`/admin/${spec.key}/new`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-leaf-700"
              >
                <Plus className="h-4 w-4" aria-hidden />
                {t.admin.newRecord}
              </Link>
            ) : null}
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-earth-300 bg-white/60 p-6 text-center text-sm text-earth-600">
            {t.admin.noRecords}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-earth-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-earth-200 bg-earth-50 text-xs uppercase tracking-wide text-earth-600">
                <tr>
                  {spec.list.map((column) => (
                    <th key={column} className="px-4 py-3 font-semibold">
                      {fieldLabel(spec, column, lang)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">
                    {t.admin.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {rows.map((row) => {
                  const id = String(row.id ?? "");
                  return (
                    <tr key={id} className="align-top hover:bg-leaf-50/40">
                      {spec.list.map((column, index) => {
                        const text = formatCell(spec, column, row[column], lang, row);
                        return (
                          <td
                            key={column}
                            className={`px-4 py-3 ${
                              index === 0 ? "font-semibold text-earth-900" : "text-earth-700"
                            }`}
                          >
                            {column === "auth_provider" ? (
                              (() => {
                                const authInfo = getAuthProviderInfo(row, lang);
                                if (authInfo.provider === "google") {
                                  return (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                      <GoogleIcon className="h-3 w-3" />
                                      <span>Google</span>
                                    </span>
                                  );
                                }
                                if (authInfo.provider === "email") {
                                  return (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-earth-200 bg-earth-50 px-2.5 py-0.5 text-xs font-medium text-earth-700">
                                      <Mail className="h-3 w-3 text-earth-500" aria-hidden />
                                      <span>{authInfo.label}</span>
                                    </span>
                                  );
                                }
                                return (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                    <Globe className="h-3 w-3" aria-hidden />
                                    <span>{authInfo.label}</span>
                                  </span>
                                );
                              })()
                            ) : column === "statut" ? (
                              <Badge tone={statutTone(row[column])}>{text}</Badge>
                            ) : (
                              <span className="line-clamp-2">{text}</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/${spec.key}/${id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg p-2 text-leaf-800 hover:bg-leaf-50"
                            title={t.admin.editRecord}
                            aria-label={t.admin.editRecord}
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </Link>
                          <AdminDeleteForm
                            tableKey={spec.key}
                            id={id}
                            message={t.admin.confirmDelete}
                            label={t.admin.deleteRecord}
                            compact
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-earth-500">
          {t.admin.records} : {rows.length}
        </p>
      </div>
    </>
  );
}
