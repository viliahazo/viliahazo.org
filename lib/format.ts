import type { Lang } from "./i18n";

const MONTHS_MG = [
  "Janoary",
  "Febroary",
  "Martsa",
  "Aprily",
  "Mey",
  "Jona",
  "Jolay",
  "Aogositra",
  "Septambra",
  "Oktobra",
  "Novambra",
  "Desambra",
];

const MONTHS_FR = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre",
];

function partsInAntananarivo(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Indian/Antananarivo",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    day: Number(get("day")),
    month: Number(get("month")),
    year: get("year"),
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function formatDate(lang: Lang, value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  const { day, month, year } = partsInAntananarivo(date);
  const months = lang === "fr" ? MONTHS_FR : MONTHS_MG;
  return `${day} ${months[month - 1]} ${year}`;
}

export function formatDateTime(lang: Lang, value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  const { time } = partsInAntananarivo(date);
  return `${formatDate(lang, date)} · ${time}`;
}
