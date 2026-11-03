export type Actualite = {
  id: string;
  titre_mg: string;
  titre_fr: string | null;
  contenu_mg: string;
  contenu_fr: string | null;
  categorie: "vaovao" | "fampitandrina" | "hevitra" | "hetsika";
  auteur: string | null;
  image_url?: string | null;
  statut: "en_attente" | "publie" | "rejete";
  created_at: string;
};

export type ActualiteReply = {
  id: string;
  actualite_id: string;
  auteur_nom: string;
  auteur_email: string | null;
  user_id: string | null;
  message: string;
  statut: "en_attente" | "publie" | "rejete";
  created_at: string;
};

export type Demarche = {
  id: string;
  slug: string;
  titre_mg: string;
  titre_fr: string | null;
  description_mg: string;
  description_fr: string | null;
  documents: string[];
  documents_fr: string[];
  delai: string | null;
  frais: string | null;
};

export type Demande = {
  id: string;
  demarche_slug: string;
  nom: string;
  telephone: string;
  email: string | null;
  message: string | null;
  statut: "en_attente" | "traitee" | "rejetee";
  created_at: string;
};

export type Fokontany = {
  id: string;
  nom: string;
  chef: string | null;
  contact: string | null;
};

export type AideSociale = {
  id: string;
  titre_mg: string;
  titre_fr: string | null;
  description_mg: string;
  description_fr: string | null;
  public_cible_mg: string | null;
  public_cible_fr: string | null;
  contact: string | null;
};

export type TransportLigne = {
  id: string;
  ligne: string;
  depart: string;
  arrivee: string;
  horaires: string | null;
  tarif: string | null;
  duree: string | null;
};

export type Emploi = {
  id: string;
  titre: string;
  employeur: string;
  description_mg: string | null;
  description_fr: string | null;
  lieu: string | null;
  contact: string | null;
  date_limite: string | null;
};

export type ServiceMunicipal = {
  id: string;
  nom_mg: string;
  nom_fr: string | null;
  description_mg: string | null;
  description_fr: string | null;
  horaire: string | null;
  contact: string | null;
};

export type Evenement = {
  id: string;
  titre_mg: string;
  titre_fr: string | null;
  description_mg: string | null;
  description_fr: string | null;
  date_event: string;
  lieu: string | null;
  type: "fety" | "tsena" | "fampisehoana" | "fanatanjahantena";
};

export type Fiangonana = {
  id: string;
  nom: string;
  responsable: string | null;
  horaire_mg: string | null;
  horaire_fr: string | null;
  contact: string | null;
  adresse: string | null;
};

export type User = {
  id: string;
  nom: string;
  email: string;
  role: "citoyen" | "admin";
};

export type SessionUser = User & { exp: number };
