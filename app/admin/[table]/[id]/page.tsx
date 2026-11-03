import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { getTableRow } from "@/lib/data";
import { NO_INDEX } from "@/lib/seo";
import { getAdminTable } from "@/lib/admin-schema";
import { toInputValue } from "@/lib/admin-format";
import { AdminLoginPrompt } from "@/components/admin-login-prompt";
import { AdminRecordForm } from "@/components/admin-record-form";
import { AdminDeleteForm } from "@/components/admin-delete-form";
import { PageHero } from "@/components/ui";

type Params = { params: Promise<{ table: string; id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { table } = await params;
  const spec = getAdminTable(table);
  return { title: spec ? spec.label : "Fitantanana", robots: NO_INDEX };
}

export default async function AdminRecordPage({ params }: Params) {
  const { table, id } = await params;
  const spec = getAdminTable(table);
  if (!spec) notFound();

  const isNew = id === "new";
  if (isNew && !spec.canCreate) notFound();

  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <AdminLoginPrompt />
      </div>
    );
  }

  const row = isNew
    ? null
    : await getTableRow<Record<string, unknown>>(spec.table, id);
  if (!isNew && !row) notFound();

  const { lang, t } = await getLangAndDict();

  const values: Record<string, string> = {};
  for (const field of spec.fields) {
    if (field.secret) continue;
    values[field.name] = toInputValue(row?.[field.name], field.type);
  }

  const title = isNew
    ? `${t.admin.newRecord} · ${lang === "fr" ? spec.labelFr : spec.label}`
    : `${t.admin.editRecord} · ${lang === "fr" ? spec.labelFr : spec.label}`;

  return (
    <>
      <PageHero
        title={title}
        subtitle={lang === "fr" ? spec.descriptionFr : spec.description}
        icon={<ShieldCheck className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href={`/admin/${spec.key}`}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t.admin.backToList}
        </Link>

        <AdminRecordForm
          tableKey={spec.key}
          id={isNew ? "new" : id}
          fields={spec.fields}
          values={values}
        />

        {!isNew ? (
          <AdminDeleteForm
            tableKey={spec.key}
            id={id}
            message={t.admin.confirmDelete}
            label={t.admin.deleteRecord}
          />
        ) : null}
      </div>
    </>
  );
}
