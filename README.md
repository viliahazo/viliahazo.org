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
- **Mairie** : se connecter avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` ; l'accès
  `/admin` permet d'approuver ou refuser les actualités et de traiter les
  demandes de documents.

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
  admin/                   validation mairie (protégée)
  actions/                 Server Actions (news, demande, auth, admin)
components/                header, footer, formulaires, UI
lib/                       i18n (mg/fr), accès données, auth, formats
supabase/                  schema.sql + seed.sql
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
```
