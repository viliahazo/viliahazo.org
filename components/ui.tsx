import type { ReactNode } from "react";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { SITE_NAME } from "@/lib/site";
import { JsonLd } from "./json-ld";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-earth-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "leaf",
}: {
  children: ReactNode;
  tone?: "leaf" | "earth" | "amber" | "red";
}) {
  const tones = {
    leaf: "bg-leaf-100 text-leaf-800",
    earth: "bg-earth-100 text-earth-800",
    amber: "bg-amber-100 text-amber-900",
    red: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHero({
  title,
  subtitle,
  icon,
  path,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  /** Chemin de la page : ajoute le fil d'Ariane et son balisage JSON-LD. */
  path?: string;
}) {
  const crumbs = path
    ? [
        { name: SITE_NAME, path: "/" },
        { name: title, path },
      ]
    : null;

  return (
    <section className="border-b border-earth-200 bg-gradient-to-b from-leaf-50 to-earth-50">
      {crumbs ? (
        <>
          <JsonLd data={breadcrumbJsonLd(crumbs)} />
          <nav
            aria-label="Fil d'Ariane"
            className="mx-auto max-w-6xl px-4 pt-5 text-xs text-earth-600"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden>/</span> : null}
                  {index === crumbs.length - 1 ? (
                    <span aria-current="page" className="font-semibold text-earth-800">
                      {crumb.name}
                    </span>
                  ) : (
                    <a href={crumb.path} className="hover:text-leaf-800 hover:underline">
                      {crumb.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex items-start gap-4">
          {icon ? (
            <span className="hidden rounded-2xl bg-leaf-600 p-3 text-white sm:block">
              {icon}
            </span>
          ) : null}
          <div>
            <h1 className="text-2xl font-bold text-leaf-900 sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-earth-700 sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-earth-300 bg-white/60 p-6 text-center text-sm text-earth-600">
      {text}
    </p>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h2 className="text-xl font-bold text-leaf-900 sm:text-2xl">{title}</h2>
      {action}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-earth-800">
        {label}
        {hint ? (
          <span className="text-xs font-normal text-earth-500">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-earth-300 bg-white px-3.5 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 focus:outline-none";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-700 disabled:opacity-60";
