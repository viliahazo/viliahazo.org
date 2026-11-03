Agis comme un développeur web full-stack expert de haut niveau. Je souhaite que tu génères une application web moderne, accessible et collaborative dédiée à la commune rurale de Viliahazo (Madagascar). 

Cette application doit être construite avec la stack suivante : Next.js (App Router), Tailwind CSS pour le design, et Vercel Postgres pour la base de données. L'objectif est qu'elle soit déployable en un clic et 100% gratuitement sur Vercel (offre Hobby).

CRUCIAL : L'interface de l'application doit être configurée avec le MALAGASY comme langue principale (Teny voalohany) et le FRANÇAIS comme deuxième langue (Langue secondaire) via un bouton de basculement (switch). Tous les textes générés par défaut doivent être en Malagasy.

Voici le cahier des charges détaillé et strict à respecter :

1. ARCHITECTURE DES DONNÉES & MODULES PRINCIPAUX
L'application doit gérer des formulaires de saisie (Server Actions) et des affichages dynamiques pour les catégories suivantes :
- Vaovao sy Filan-kevitra (Actualités et informations) : Ny vaovao farany eto an-tanàna, fampitandrina, ary ny hevitra sy hafatra avy amin'ny mponina.
- Taratasy sy Fitantanana (Démarches administratives) : Torolalana hahazoana taratasy (Kopia, dika mitovy, fanamarinam-ponenana), latsakemboka, ary ny momba ny Ben'ny tanàna (RANDRIAMANANTENA Gabriel Rolland) sy ireo fokontany 8 (Anjomakely, Anjoma Betoho, sns.).
- Trano sy Tosika Sosialy (Logement et aides sociales) : Fanampiana ho an'ny fianakaviana sahirana, fandaharan'asa sosialy, ary torolalana momba ny fananganana trano.
- Fitaterana sy ny Fiantsonana (Transports et stationnement) : Ora sy lalan'ny Taxibrousse mampitohy an'i Viliahazo amin'ny tanàna manodidina, ary ny toerana fiantsonana.
- Asa sy Sampandraharaha (Emploi et services municipaux) : Tolotra asa eo an-toerana, fiofanana, ary ny asan'ny kaominina (fandraofana fako, rano madio, jiro).
- Hetsika sy Kolontsaina (Événements et activités culturelles) : Lisitry ny fety, tsena, fampisehoana, fanatanjahantena, ary ny antsipirian'ny Fiangonana / Fivavahana (Anarana, pretra/pasitera, ora fivavahana).

2. ACCESSIBILITÉ ET EXPÉRIENCE UTILISATEUR (Optimisé pour Viliahazo)
- Mobile-First : Natao hifanaraka tanteraka amin'ny finday (satria io no fitaovana fampiasan'ny olona any Viliahazo idirana amin'ny internet).
- Performance et Légèreté : Tokony ho maivana sy haingana ny kaody na dia amin'ny tambajotra 3G/4G malemy aza.
- Design & Iconographie : Loko maitso/natiora sy tany (Tailwind CSS). Ampiasao ny kisary (icons) avy amin'ny 'lucide-react'.

3. SÉCURITÉ ET RÔLES
- Mode Public / Visiteur : Afaka mijery ny vaovao rehetra tsy mila fidirana (login).
- Mode Citoyen : Afaka mamorona kaonty tsotra raha hanampy vaovao (oh: hitatitra hetsika, hitady asa, na hanampy fiangonana).
- Mode Administration (Mairie) : Toerana manokana hanamarinana ny vaovao alohan'ny hivoahany ho hitan'ny rehetra.

4. STRUCTURE DU CODE ATTENDUE
Génère-moi une application propre prête pour Vercel. Fournis-moi :
1. Le fichier 'package.json' complet.
2. Le schéma SQL ho an'ny Vercel Postgres.
3. Ny kaody ho an'ny pejy fandraisana (app/page.tsx) amin'ny teny malagasy, mampiseho ny fizarana rehetra voalaza eo ambony amin'ny fomba mazava sy tsara rindra.
4. Server Action iray sy ny formulaire momba ny "Taratasy sy Fitantanana" (Démarches administratives).

SERVER OF APPLICATION
 - VERCEL FREE
 - DATABASE FREE SUPABASE FREE OR ALTERNATIVE FREE