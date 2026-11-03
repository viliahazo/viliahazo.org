import {
  BriefcaseBusiness,
  Bus,
  FileText,
  House,
  Newspaper,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";

export type SectionKey =
  | "news"
  | "procedures"
  | "housing"
  | "transport"
  | "jobs"
  | "events";

export type Section = {
  key: SectionKey;
  href: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile. */
  tone: string;
};

export const sections: Section[] = [
  {
    key: "news",
    href: "/vaovao",
    icon: Newspaper,
    tone: "bg-leaf-100 text-leaf-700",
  },
  {
    key: "procedures",
    href: "/taratasy",
    icon: FileText,
    tone: "bg-earth-100 text-earth-700",
  },
  {
    key: "housing",
    href: "/trano",
    icon: House,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "transport",
    href: "/fitaterana",
    icon: Bus,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    key: "jobs",
    href: "/asa",
    icon: BriefcaseBusiness,
    tone: "bg-leaf-50 text-leaf-700",
  },
  {
    key: "events",
    href: "/hetsika",
    icon: PartyPopper,
    tone: "bg-rose-50 text-rose-700",
  },
];
