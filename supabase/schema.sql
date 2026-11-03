-- ============================================================
--  Viliahazo - Schema base de donnees (Supabase / Postgres)
--  A executer dans Supabase > SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Comptes (citoyens + mairie) ----------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'citoyen' check (role in ('citoyen', 'admin')),
  created_at timestamptz not null default now()
);

-- ---------- Vaovao / Actualites ----------
create table if not exists actualites (
  id uuid primary key default gen_random_uuid(),
  titre_mg text not null,
  titre_fr text,
  contenu_mg text not null,
  contenu_fr text,
  categorie text not null default 'vaovao'
    check (categorie in ('vaovao', 'fampitandrina', 'hevitra', 'hetsika')),
  auteur text,
  image_url text,
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'publie', 'rejete')),
  created_at timestamptz not null default now()
);

-- ---------- Valinteny / Commentaires sur les actualites ----------
create table if not exists actualite_commentaires (
  id uuid primary key default gen_random_uuid(),
  actualite_id uuid not null references actualites(id) on delete cascade,
  auteur_nom text not null,
  auteur_email text,
  user_id uuid references users(id) on delete set null,
  message text not null,
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'publie', 'rejete')),
  created_at timestamptz not null default now()
);

-- ---------- Taratasy / Demarches administratives ----------
create table if not exists demarches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre_mg text not null,
  titre_fr text,
  description_mg text not null,
  description_fr text,
  documents text[] not null default '{}',
  documents_fr text[] not null default '{}',
  delai text,
  frais text,
  ordre int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Demandes de documents (formulaire citoyen) ----------
create table if not exists demandes (
  id uuid primary key default gen_random_uuid(),
  demarche_id uuid references demarches(id) on delete set null,
  demarche_slug text not null,
  nom text not null,
  telephone text not null,
  email text,
  message text,
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'traitee', 'rejetee')),
  created_at timestamptz not null default now()
);

-- ---------- Fokontany ----------
create table if not exists fokontany (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  chef text,
  contact text,
  ordre int not null default 0
);

-- ---------- Trano sy tosika sosialy ----------
create table if not exists aides_sociales (
  id uuid primary key default gen_random_uuid(),
  titre_mg text not null,
  titre_fr text,
  description_mg text not null,
  description_fr text,
  public_cible_mg text,
  public_cible_fr text,
  contact text,
  created_at timestamptz not null default now()
);

-- ---------- Fitaterana ----------
create table if not exists transport_lignes (
  id uuid primary key default gen_random_uuid(),
  ligne text not null,
  depart text not null,
  arrivee text not null,
  horaires text,
  tarif text,
  duree text,
  created_at timestamptz not null default now()
);

-- ---------- Asa sy sampandraharaha ----------
create table if not exists emplois (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  employeur text not null,
  description_mg text,
  description_fr text,
  lieu text,
  contact text,
  date_limite date,
  created_at timestamptz not null default now()
);

create table if not exists services_municipaux (
  id uuid primary key default gen_random_uuid(),
  nom_mg text not null,
  nom_fr text,
  description_mg text,
  description_fr text,
  horaire text,
  contact text,
  created_at timestamptz not null default now()
);

-- ---------- Hetsika sy kolontsaina ----------
create table if not exists evenements (
  id uuid primary key default gen_random_uuid(),
  titre_mg text not null,
  titre_fr text,
  description_mg text,
  description_fr text,
  date_event timestamptz not null,
  lieu text,
  type text not null default 'fety'
    check (type in ('fety', 'tsena', 'fampisehoana', 'fanatanjahantena')),
  created_at timestamptz not null default now()
);

create table if not exists fiangonana (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  responsable text,
  horaire_mg text,
  horaire_fr text,
  contact text,
  adresse text
);

-- ---------- Index ----------
create index if not exists actualites_statut_idx on actualites (statut, created_at desc);
create index if not exists actualite_commentaires_idx on actualite_commentaires (actualite_id, statut, created_at desc);
create index if not exists demandes_statut_idx on demandes (statut, created_at desc);
create index if not exists evenements_date_idx on evenements (date_event);

-- ============================================================
--  Securite : RLS active. Aucune policy publique :
--  l'application passe par la cle service_role cote serveur
--  (Server Actions). Le navigateur ne lit jamais la base.
-- ============================================================
alter table users enable row level security;
alter table actualites enable row level security;
alter table actualite_commentaires enable row level security;
alter table demarches enable row level security;
alter table demandes enable row level security;
alter table fokontany enable row level security;
alter table aides_sociales enable row level security;
alter table transport_lignes enable row level security;
alter table emplois enable row level security;
alter table services_municipaux enable row level security;
alter table evenements enable row level security;
alter table fiangonana enable row level security;

-- Lecture publique des contenus publies uniquement (optionnel, utile si
-- vous ajoutez plus tard un acces direct avec la cle anon).
drop policy if exists "actualites publiees visibles" on actualites;
create policy "actualites publiees visibles"
  on actualites for select using (statut = 'publie');
drop policy if exists "commentaires publics visibles" on actualite_commentaires;
create policy "commentaires publics visibles"
  on actualite_commentaires for select using (statut = 'publie');
drop policy if exists "demarches visibles" on demarches;
create policy "demarches visibles" on demarches for select using (true);
drop policy if exists "fokontany visibles" on fokontany;
create policy "fokontany visibles" on fokontany for select using (true);
drop policy if exists "aides visibles" on aides_sociales;
create policy "aides visibles" on aides_sociales for select using (true);
drop policy if exists "transports visibles" on transport_lignes;
create policy "transports visibles" on transport_lignes for select using (true);
drop policy if exists "emplois visibles" on emplois;
create policy "emplois visibles" on emplois for select using (true);
drop policy if exists "services visibles" on services_municipaux;
create policy "services visibles" on services_municipaux for select using (true);
drop policy if exists "evenements visibles" on evenements;
create policy "evenements visibles" on evenements for select using (true);
drop policy if exists "fiangonana visibles" on fiangonana;
create policy "fiangonana visibles" on fiangonana for select using (true);
