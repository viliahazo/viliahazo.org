# Viliahazo — sehatra ho an'ny mponina / plateforme communale

Application web mobile-first pour la commune rurale de **Viliahazo (Madagascar)** :
actualités, démarches administratives, logement et aides sociales, transports,
emploi et services municipaux, événements et culture.

Interface **en malgache par défaut**, avec bascule en **français** (bouton MG / FR).
Le cahier des charges d'origine est conservé dans [`CAHIER_DES_CHARGES.md`](./CAHIER_DES_CHARGES.md).

## Stack

| Élément | Choix |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Styles | Tailwind CSS v4 (palette vert / terre) |
| Icônes | `lucide-react` |
| Base de données | Supabase Postgres (offre gratuite), client `@supabase/supabase-js` |
| Hébergement | Vercel Hobby (gratuit) |

Aucune dépendance payante : Vercel Hobby + Supabase Free suffisent.

## Démarrage local

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev                  # http://localhost:3000
```

Sans base configurée, l'application reste consultable : un bandeau indique que
les listes sont vides.

## Base de données (Supabase, gratuit)

1. Créer un projet sur [supabase.com](https://supabase.com) (région la plus proche,
   par ex. `eu-west-3`).
2. **SQL Editor** → exécuter [`supabase/schema.sql`](./supabase/schema.sql)
   (tables, index, RLS).
3. Toujours dans **SQL Editor** → exécuter [`supabase/seed.sql`](./supabase/seed.sql)
   (contenu de démonstration bilingue : 8 fokontany, démarches, transports, etc.).
4. **Project Settings → API** → copier dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
AUTH_SECRET=<openssl rand -hex 32>
ADMIN_EMAIL=beny@viliahazo.mg
ADMIN_PASSWORD=<mot de passe fort>
```

> La clé `service_role` contourne la RLS : elle est utilisée **uniquement côté
> serveur** (Server Actions / Server Components) et n'est jamais exposée au
> navigateur. La RLS est activée et seule la lecture des contenus publiés est
> ouverte.

### Comptes

- **Public** : lecture de toutes les pages sans connexion.
- **Citoyen** : `/hisoratra` (créer un compte), `/hiditra` (connexion) puis
  proposition d'actualités depuis `/vaovao`. Les propositions sont créées avec
  le statut `en_attente`.
- **Mairie** : se connecter avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Administration (`/admin`)

L'administration couvre **toutes** les informations du site : chaque table est
créée, modifiée et supprimée depuis le navigateur, sans passer par Supabase.

| Section | Table | Contenu géré |
| --- | --- | --- |
| Vaovao | `actualites` | actualités, alertes, avis (publication / rejet) |
| Taratasy | `demarches` | démarches, pièces à fournir (une par ligne), délai, frais, ordre |
| Fangatahana | `demandes` | demandes citoyennes, statut traité / rejeté |
| Fokontany | `fokontany` | nom, chef, téléphone |
| Trano | `aides_sociales` | aides sociales, public ciblé, contact |
| Fitaterana | `transport_lignes` | lignes, horaires, durée, tarif |
| Asa | `emplois`, `services_municipaux` | offres d'emploi, services communaux |
| Hetsika | `evenements`, `fiangonana` | événements, églises et horaires de culte |
| Kaonty | `users` | comptes citoyens, rôles, réinitialisation de mot de passe |

Chaque formulaire est bilingue (MG obligatoire, FR optionnel), valide les
champs obligatoires, vérifie l'unicité (`slug`, e-mail) et rafraîchit aussitôt
les pages publiques concernées. Les colonnes autorisées sont déclarées une
seule fois dans [`lib/admin-schema.ts`](./lib/admin-schema.ts) : cette liste sert
de liste blanche côté serveur, aucune table hors administration ne peut être
écrite. Les mots de passe ne sont jamais relus, seulement hachés à l'écriture.

> `ADMIN_PASSWORD` doit être changé avant toute mise en ligne : il donne accès à
> l'administration complète.

## Référencement (SEO)

Tout est généré côté serveur, sans service externe :

- **URL canonique par langue** : `?lang=fr` sert réellement la page en français
  (via `proxy.ts`), avec `<html lang>` et `og:locale` corrects ; le malgache
  reste l'URL nue. Canonical + `hreflang` (`mg`, `fr`, `x-default`) sur chaque page.
- **`sitemap.xml`** (`app/sitemap.ts`) : 7 pages × 2 langues, avec alternates.
- **`robots.txt`** (`app/robots.ts`) : `/admin`, `/hiditra`, `/hisoratra` exclus.
- **Open Graph / Twitter Card** : image 1200×630 générée par `app/opengraph-image.tsx`.
- **Données structurées JSON-LD** : `GovernmentOrganization` (mairie, maire,
  adresse, horaires), `WebSite`, `BreadcrumbList` sur chaque rubrique et
  `ItemList` pour les événements.
- **Manifeste PWA** (`app/manifest.ts`) : nom, icône, couleurs, raccourcis.
- **Métadonnées par page** via `lib/seo.ts` (`pageMetadata`) : titre, description,
  mots-clés, canonical, hreflang, Open Graph.

**À faire en production** : renseigner `NEXT_PUBLIC_SITE_URL` (ex.
`https://viliahazo.mg`). Sans cette variable, les URL canoniques pointent vers
`https://viliahazo.org`.

## Déploiement sur Vercel (gratuit)

```bash
npx vercel
```

Puis, dans **Project Settings → Environment Variables**, ajouter les variables
ci-dessus (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) et
redéployer. Aucun autre réglage n'est nécessaire.

## Structure

```
app/
  page.tsx                 page d'accueil (toutes les rubriques)
  vaovao/                  actualités + formulaire citoyen (Server Action)
  taratasy/                démarches + formulaire de demande (Server Action)
  trano/                   logement et aides sociales
  fitaterana/              transports et gare routière
  asa/                     emploi et services municipaux
  hetsika/                 événements et lieux de culte
  hiditra/ hisoratra/      connexion / inscription
  admin/                   tableau de bord mairie (protégé)
    [table]/               liste d'une table + création / édition
  sitemap.ts robots.ts
  manifest.ts opengraph-image.tsx
  actions/                 Server Actions (news, demande, auth, admin, content)
components/                header, footer, formulaires, admin, UI
lib/                       i18n (mg/fr), données, auth, formats, seo, admin-schema
proxy.ts                   langue via ?lang=fr|mg
supabase/                  schema.sql + seed.sql
scripts/                   tests Supabase et CRUD administration
```

## Accessibilité et performance

- Mobile-first, navigation sans JavaScript requise pour les formulaires
  (progressive enhancement via `useActionState`).
- Aucune police ni image distante : chargement léger sur 3G/4G.
- Contrastes élevés, zones tactiles ≥ 40 px, `aria-*` sur la navigation et les
  regroupements de formulaires.

## Vérifications

```bash
npx tsc --noEmit
npm run build
node scripts/test-supabase.mjs     # connexion, tables, RLS, écritures
node scripts/test-admin-crud.mjs   # create → update → delete sur chaque table
```
