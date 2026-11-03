/**
 * Description declarative de toutes les tables gerables depuis
 * l'administration (`/admin`). Ce fichier ne contient que des donnees :
 * il est utilise a la fois par les formulaires, la liste, les server actions
 * et les controles de securite (liste blanche des tables et des colonnes).
 */

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "datetime"
  | "select"
  | "list"
  | "email"
  | "password";

export type AdminOption = { value: string; mg: string; fr: string };

export type AdminField = {
  /** Nom de la colonne en base. */
  name: string;
  label: string;
  labelFr: string;
  type: AdminFieldType;
  required?: boolean;
  options?: AdminOption[];
  /** Mot de passe : jamais relu, hache avant enregistrement. */
  secret?: boolean;
};

export type AdminTable = {
  /** Segment d'URL : /admin/<key>. */
  key: string;
  /** Table Postgres. */
  table: string;
  label: string;
  labelFr: string;
  description: string;
  descriptionFr: string;
  order: { column: string; ascending: boolean };
  /** Colonnes affichees dans la liste. */
  list: string[];
  fields: AdminField[];
  canCreate: boolean;
};

const CATEGORIES: AdminOption[] = [
  { value: "vaovao", mg: "Vaovao", fr: "Actualité" },
  { value: "fampitandrina", mg: "Fampitandrina", fr: "Alerte" },
  { value: "hevitra", mg: "Hevitra", fr: "Avis" },
  { value: "hetsika", mg: "Hetsika", fr: "Événement" },
];

const STATUTS_ACTUALITE: AdminOption[] = [
  { value: "publie", mg: "Navoaka", fr: "Publié" },
  { value: "en_attente", mg: "Miandry fanamarinana", fr: "En attente" },
  { value: "rejete", mg: "Nolavina", fr: "Rejeté" },
];

const STATUTS_DEMANDE: AdminOption[] = [
  { value: "en_attente", mg: "Miandry", fr: "En attente" },
  { value: "traitee", mg: "Voadinika", fr: "Traité" },
  { value: "rejetee", mg: "Nolavina", fr: "Rejeté" },
];

const TYPES_EVENEMENT: AdminOption[] = [
  { value: "fety", mg: "Fety", fr: "Fête" },
  { value: "tsena", mg: "Tsena", fr: "Marché" },
  { value: "fampisehoana", mg: "Fampisehoana", fr: "Spectacle" },
  { value: "fanatanjahantena", mg: "Fanatanjahantena", fr: "Sport" },
];

const ROLES: AdminOption[] = [
  { value: "citoyen", mg: "Mponina", fr: "Citoyen" },
  { value: "admin", mg: "Mpitantana", fr: "Administrateur" },
];

export const ADMIN_TABLES: AdminTable[] = [
  {
    key: "actualites",
    table: "actualites",
    label: "Vaovao sy filan-kevitra",
    labelFr: "Actualités et informations",
    description: "Vaovao, fampitandrina, hevitra ary hetsika avoaka amin'ny pejy fandraisana.",
    descriptionFr: "Actualités, alertes, avis et événements publiés sur le site.",
    order: { column: "created_at", ascending: false },
    list: ["titre_mg", "categorie", "statut", "created_at"],
    canCreate: true,
    fields: [
      { name: "titre_mg", label: "Lohateny (MG)", labelFr: "Titre (MG)", type: "text", required: true },
      { name: "titre_fr", label: "Lohateny (FR)", labelFr: "Titre (FR)", type: "text" },
      { name: "contenu_mg", label: "Votoaty (MG)", labelFr: "Contenu (MG)", type: "textarea", required: true },
      { name: "contenu_fr", label: "Votoaty (FR)", labelFr: "Contenu (FR)", type: "textarea" },
      { name: "categorie", label: "Sokajy", labelFr: "Catégorie", type: "select", required: true, options: CATEGORIES },
      { name: "statut", label: "Toe-javatra", labelFr: "Statut", type: "select", required: true, options: STATUTS_ACTUALITE },
      { name: "auteur", label: "Mpanoratra", labelFr: "Auteur", type: "text" },
      { name: "image_url", label: "Rohin'ny sary (URL)", labelFr: "URL de l'image", type: "text" },
    ],
  },
  {
    key: "demarches",
    table: "demarches",
    label: "Taratasy sy fitantanana",
    labelFr: "Démarches administratives",
    description: "Ny taratasy azo angatahana, ny antontan-taratasy ilaina, ny fe-potoana sy ny sara.",
    descriptionFr: "Documents demandables, pièces à fournir, délais et frais.",
    order: { column: "ordre", ascending: true },
    list: ["titre_mg", "slug", "ordre"],
    canCreate: true,
    fields: [
      { name: "slug", label: "Slug (URL)", labelFr: "Slug (URL)", type: "text", required: true },
      { name: "titre_mg", label: "Lohateny (MG)", labelFr: "Titre (MG)", type: "text", required: true },
      { name: "titre_fr", label: "Lohateny (FR)", labelFr: "Titre (FR)", type: "text" },
      { name: "description_mg", label: "Fanazavana (MG)", labelFr: "Description (MG)", type: "textarea", required: true },
      { name: "description_fr", label: "Fanazavana (FR)", labelFr: "Description (FR)", type: "textarea" },
      { name: "documents", label: "Antontan-taratasy ilaina (andalana isaky ny iray)", labelFr: "Pièces à fournir (une par ligne)", type: "list" },
      { name: "documents_fr", label: "Pièces à fournir FR (andalana isaky ny iray)", labelFr: "Pièces à fournir FR (une par ligne)", type: "list" },
      { name: "delai", label: "Fe-potoana", labelFr: "Délai", type: "text" },
      { name: "frais", label: "Sara", labelFr: "Frais", type: "text" },
      { name: "ordre", label: "Filaharan'ny pejy", labelFr: "Ordre d'affichage", type: "number" },
    ],
  },
  {
    key: "demandes",
    table: "demandes",
    label: "Fangatahana taratasy",
    labelFr: "Demandes de documents",
    description: "Ny fangatahana avy amin'ny mponina sy ny toeran'izy ireo.",
    descriptionFr: "Demandes envoyées par les habitants et leur état de traitement.",
    order: { column: "created_at", ascending: false },
    list: ["nom", "demarche_slug", "statut", "created_at"],
    canCreate: false,
    fields: [
      { name: "nom", label: "Anaran'ny mpangataka", labelFr: "Nom du demandeur", type: "text", required: true },
      { name: "telephone", label: "Telefaona", labelFr: "Téléphone", type: "text", required: true },
      { name: "email", label: "Mailaka", labelFr: "E-mail", type: "email" },
      { name: "demarche_slug", label: "Taratasy", labelFr: "Démarche", type: "text", required: true },
      { name: "message", label: "Fanazavana", labelFr: "Message", type: "textarea" },
      { name: "statut", label: "Toe-javatra", labelFr: "Statut", type: "select", required: true, options: STATUTS_DEMANDE },
    ],
  },
  {
    key: "fokontany",
    table: "fokontany",
    label: "Fokontany",
    labelFr: "Fokontany",
    description: "Anarana, lehiben'ny fokontany ary ny finday azo ifandraisana.",
    descriptionFr: "Nom, chef de fokontany et téléphone de contact.",
    order: { column: "ordre", ascending: true },
    list: ["nom", "chef", "contact", "ordre"],
    canCreate: true,
    fields: [
      { name: "nom", label: "Anarana", labelFr: "Nom", type: "text", required: true },
      { name: "chef", label: "Lehiben'ny fokontany", labelFr: "Chef de fokontany", type: "text" },
      { name: "contact", label: "Telefaona", labelFr: "Téléphone", type: "text" },
      { name: "ordre", label: "Filaharana", labelFr: "Ordre", type: "number" },
    ],
  },
  {
    key: "aides",
    table: "aides_sociales",
    label: "Trano sy fanampiana sosialy",
    labelFr: "Logement et aides sociales",
    description: "Ny fanampiana omen'ny kaominina ho an'ny fianakaviana sahirana.",
    descriptionFr: "Aides proposées aux familles vulnérables.",
    order: { column: "created_at", ascending: false },
    list: ["titre_mg", "public_cible_mg", "contact"],
    canCreate: true,
    fields: [
      { name: "titre_mg", label: "Lohateny (MG)", labelFr: "Titre (MG)", type: "text", required: true },
      { name: "titre_fr", label: "Lohateny (FR)", labelFr: "Titre (FR)", type: "text" },
      { name: "description_mg", label: "Fanazavana (MG)", labelFr: "Description (MG)", type: "textarea", required: true },
      { name: "description_fr", label: "Fanazavana (FR)", labelFr: "Description (FR)", type: "textarea" },
      { name: "public_cible_mg", label: "Ho an'iza (MG)", labelFr: "Public ciblé (MG)", type: "text" },
      { name: "public_cible_fr", label: "Ho an'iza (FR)", labelFr: "Public ciblé (FR)", type: "text" },
      { name: "contact", label: "Fifandraisana", labelFr: "Contact", type: "text" },
    ],
  },
  {
    key: "transport",
    table: "transport_lignes",
    label: "Fitaterana",
    labelFr: "Transports",
    description: "Ny lalana, ny ora fiaingana, ny faharetana ary ny tetikasa.",
    descriptionFr: "Lignes, horaires, durées et tarifs des taxis-brousse.",
    order: { column: "created_at", ascending: false },
    list: ["ligne", "depart", "arrivee", "horaires", "tarif"],
    canCreate: true,
    fields: [
      { name: "ligne", label: "Lalana", labelFr: "Ligne", type: "text", required: true },
      { name: "depart", label: "Fiaingana", labelFr: "Départ", type: "text", required: true },
      { name: "arrivee", label: "Fahatongavana", labelFr: "Arrivée", type: "text", required: true },
      { name: "horaires", label: "Ora", labelFr: "Horaires", type: "text" },
      { name: "duree", label: "Faharetana", labelFr: "Durée", type: "text" },
      { name: "tarif", label: "Tetikasa", labelFr: "Tarif", type: "text" },
    ],
  },
  {
    key: "emplois",
    table: "emplois",
    label: "Asa",
    labelFr: "Emplois",
    description: "Tolotra asa sy fiofanana eo an-toerana.",
    descriptionFr: "Offres d'emploi et formations locales.",
    order: { column: "created_at", ascending: false },
    list: ["titre", "employeur", "lieu", "date_limite"],
    canCreate: true,
    fields: [
      { name: "titre", label: "Lohateny", labelFr: "Intitulé", type: "text", required: true },
      { name: "employeur", label: "Mpampiasa", labelFr: "Employeur", type: "text", required: true },
      { name: "description_mg", label: "Fanazavana (MG)", labelFr: "Description (MG)", type: "textarea" },
      { name: "description_fr", label: "Fanazavana (FR)", labelFr: "Description (FR)", type: "textarea" },
      { name: "lieu", label: "Toerana", labelFr: "Lieu", type: "text" },
      { name: "contact", label: "Fifandraisana", labelFr: "Contact", type: "text" },
      { name: "date_limite", label: "Farany", labelFr: "Date limite", type: "date" },
    ],
  },
  {
    key: "services",
    table: "services_municipaux",
    label: "Asan'ny kaominina",
    labelFr: "Services municipaux",
    description: "Fandraofana fako, rano madio, jiro sy ny sisa.",
    descriptionFr: "Collecte des déchets, eau, éclairage et autres services.",
    order: { column: "created_at", ascending: false },
    list: ["nom_mg", "horaire", "contact"],
    canCreate: true,
    fields: [
      { name: "nom_mg", label: "Anarana (MG)", labelFr: "Nom (MG)", type: "text", required: true },
      { name: "nom_fr", label: "Anarana (FR)", labelFr: "Nom (FR)", type: "text" },
      { name: "description_mg", label: "Fanazavana (MG)", labelFr: "Description (MG)", type: "textarea" },
      { name: "description_fr", label: "Fanazavana (FR)", labelFr: "Description (FR)", type: "textarea" },
      { name: "horaire", label: "Ora", labelFr: "Horaires", type: "text" },
      { name: "contact", label: "Fifandraisana", labelFr: "Contact", type: "text" },
    ],
  },
  {
    key: "evenements",
    table: "evenements",
    label: "Hetsika sy kolontsaina",
    labelFr: "Événements et culture",
    description: "Fety, tsena, fampisehoana ary fanatanjahantena.",
    descriptionFr: "Fêtes, marchés, spectacles et compétitions sportives.",
    order: { column: "date_event", ascending: true },
    list: ["titre_mg", "date_event", "lieu", "type"],
    canCreate: true,
    fields: [
      { name: "titre_mg", label: "Lohateny (MG)", labelFr: "Titre (MG)", type: "text", required: true },
      { name: "titre_fr", label: "Lohateny (FR)", labelFr: "Titre (FR)", type: "text" },
      { name: "description_mg", label: "Fanazavana (MG)", labelFr: "Description (MG)", type: "textarea" },
      { name: "description_fr", label: "Fanazavana (FR)", labelFr: "Description (FR)", type: "textarea" },
      { name: "date_event", label: "Daty sy ora", labelFr: "Date et heure", type: "datetime", required: true },
      { name: "lieu", label: "Toerana", labelFr: "Lieu", type: "text" },
      { name: "type", label: "Karazana", labelFr: "Type", type: "select", required: true, options: TYPES_EVENEMENT },
    ],
  },
  {
    key: "fiangonana",
    table: "fiangonana",
    label: "Fiangonana sy fivavahana",
    labelFr: "Églises et lieux de culte",
    description: "Anarana, mpitondra, ora fivavahana ary adiresy.",
    descriptionFr: "Nom, responsable, horaires de culte et adresse.",
    order: { column: "nom", ascending: true },
    list: ["nom", "responsable", "contact"],
    canCreate: true,
    fields: [
      { name: "nom", label: "Anarana", labelFr: "Nom", type: "text", required: true },
      { name: "responsable", label: "Mpitondra", labelFr: "Responsable", type: "text" },
      { name: "horaire_mg", label: "Ora fivavahana (MG)", labelFr: "Horaires de culte (MG)", type: "text" },
      { name: "horaire_fr", label: "Ora fivavahana (FR)", labelFr: "Horaires de culte (FR)", type: "text" },
      { name: "contact", label: "Fifandraisana", labelFr: "Contact", type: "text" },
      { name: "adresse", label: "Adiresy", labelFr: "Adresse", type: "text" },
    ],
  },
  {
    key: "users",
    table: "users",
    label: "Kaonty",
    labelFr: "Comptes",
    description: "Kaonty mponina sy mpitantana. Ny tenimiafina dia tsy aseho mihitsy.",
    descriptionFr: "Comptes citoyens et administrateurs. Les mots de passe ne sont jamais affichés.",
    order: { column: "created_at", ascending: false },
    list: ["nom", "email", "role", "created_at"],
    canCreate: true,
    fields: [
      { name: "nom", label: "Anarana", labelFr: "Nom", type: "text", required: true },
      { name: "email", label: "Mailaka", labelFr: "E-mail", type: "email", required: true },
      { name: "role", label: "Andraikitra", labelFr: "Rôle", type: "select", required: true, options: ROLES },
      {
        name: "password",
        label: "Tenimiafina vaovao",
        labelFr: "Nouveau mot de passe",
        type: "password",
        secret: true,
      },
    ],
  },
];

export const ADMIN_TABLE_KEYS = ADMIN_TABLES.map((table) => table.table);

export function getAdminTable(key: string): AdminTable | undefined {
  return ADMIN_TABLES.find((table) => table.key === key);
}

/** Colonnes autorisees en ecriture pour une table (liste blanche). */
export function writableColumns(spec: AdminTable): string[] {
  return spec.fields
    .filter((field) => field.name !== "password")
    .map((field) => field.name);
}
