-- ============================================================
--  Viliahazo - Donnees de demonstration (a adapter)
--  A executer APRES schema.sql
-- ============================================================

truncate actualites, demarches, fokontany, aides_sociales,
  transport_lignes, emplois, services_municipaux, evenements, fiangonana
  restart identity cascade;

-- ---------- Vaovao ----------
insert into actualites (titre_mg, titre_fr, contenu_mg, contenu_fr, categorie, auteur, statut) values
('Fizarana rano madio any Anjomakely', 'Distribution d''eau potable à Anjomakely',
 'Manomboka ny alarobia 5 Novambra ny famatsiana rano madio amin''ny fokontany Anjomakely sy Anjoma Betoho. Mitondra siny na fitoeran-drano ny mponina rehetra. Ny ora famatsiana dia 6 maraina ka hatramin''ny 11 maraina.',
 'La distribution d''eau potable dans les fokontany d''Anjomakely et d''Anjoma Betoho débute le mercredi 5 novembre. Les habitants sont invités à se munir de récipients. Horaire : de 6h à 11h.',
 'vaovao', 'Birao ny Kaominina', 'publie'),
('Fampitandrina : orana be sy tondra-drano', 'Alerte : fortes pluies et risques d''inondation',
 'Miantso ny mponina hipetraka any amin''ny toerana avo ny Kaominina mandritra ny roa andro ho avy. Aza mankany amin''ny lohasaha sy ny tetezana Ambodivoara raha tsy ilaina. Antsoy ny 034 00 000 00 raha misy vonjy taitra.',
 'La commune invite la population à se mettre en hauteur durant les deux prochains jours. Évitez les bas-fonds et le pont d''Ambodivoara. Urgences : 034 00 000 00.',
 'fampitandrina', 'Birao ny Kaominina', 'publie'),
('Tsenan''ny tantsaha isaky ny asabotsy', 'Marché des paysans chaque samedi',
 'Isaky ny asabotsy maraina, eo amin''ny kianjan''ny tsena afovoany, mivarotra ny vokatra avy any amin''ny tanimboly ny tantsaha ao Viliahazo : vary, mangahazo, tsaramaso ary legioma vaovao.',
 'Chaque samedi matin, sur la place du marché central, les paysans de Viliahazo vendent riz, manioc, haricots et légumes frais.',
 'vaovao', 'Komity Tantsaha', 'publie'),
('Fangatahana hevitra : fanavaozana ny lalam-pifandraisana', 'Consultation : réhabilitation de la voirie',
 'Mangataka ny hevitry ny mponina ny Kaominina momba ny laharam-pahamehana amin''ny fanavaozana ny lalana ao anatin''ny tanana. Alefaso ny hevitrao amin''ny birao na amin''ity sehatra ity.',
 'La commune consulte les habitants sur les priorités de réhabilitation des routes du bourg. Vos avis sont attendus au bureau communal ou via cette plateforme.',
 'hevitra', 'Birao ny Kaominina', 'publie');

-- ---------- Taratasy / Demarches ----------
insert into demarches (slug, titre_mg, titre_fr, description_mg, description_fr, documents, documents_fr, delai, frais, ordre) values
('kopia', 'Fangatahana kopia taratasy', 'Demande de copie d''acte',
 'Kopia ny taratasy fanamarinana teraka, fanambadiana na fahafatesana. Ento ny taratasy tany am-boalohany raha mbola misy.',
 'Copie d''acte de naissance, de mariage ou de décès. Présentez l''original si vous le possédez.',
 array['Taraty fanamarinana teraka (tany am-boalohany raha misy)', 'Karatra misy ny laharam-pahaterahana', 'Sary 2 x 4 roa'],
 array['Acte original si disponible', 'Pièce d''identité', 'Deux photos 4x4'],
 '2 ka hatramin''ny 5 andro', 'Ar 2 000', 1),
('dika-mitovy', 'Fanamarinana dika mitovy', 'Certification conforme',
 'Fanamarinana fa mitovy amin''ny taratasy tany am-boalohany ny dika mitovy natao.',
 'Certification de conformité d''une copie avec l''original.',
 array['Taraty tany am-boalohany', 'Ny dika mitovy tokony hamarinina'],
 array['Original', 'La copie à certifier'],
 'Andro iray', 'Ar 1 000', 2),
('fanamarinam-ponenana', 'Fanamarinam-ponenana', 'Certificat de résidence',
 'Taraty manamarina ny toerana onenanao ao anatin''ny faritry ny Kaominina Viliahazo.',
 'Attestation prouvant votre domicile dans la commune de Viliahazo.',
 array['Karatra misy ny laharam-pahaterahana', 'Taratasy fanamarinana avy amin''ny fokontany', 'Vavolombelona roa avy amin''ny fokontany'],
 array['Pièce d''identité', 'Attestation du fokontany', 'Deux témoins du fokontany'],
 '3 andro', 'Ar 2 000', 3),
('latsakemboka', 'Latsakemboka', 'Légalisation de signature',
 'Fanamarinana ny soniao amin''ny taratasy ofisialy na fifanarahana.',
 'Légalisation de votre signature sur un document officiel ou un contrat.',
 array['Ny taratasy tokony hohamarinina', 'Karatra misy ny laharam-pahaterahana', 'Ny tena tompon''ny sonia'],
 array['Le document à légaliser', 'Pièce d''identité', 'Le signataire en personne'],
 'Andro iray', 'Ar 1 000', 4),
('taratasy-fanambadiana', 'Taratasy fanambadiana', 'Certificat de mariage',
 'Fangatahana taratasy fanamarinana ny fanambadiana efa voasoratra ao amin''ny Kaominina.',
 'Délivrance du certificat de mariage enregistré à la commune.',
 array['Taratasy fanambadiana tany am-boalohany', 'Karatra roa', 'Sary roa isaky ny mpivady'],
 array['Acte de mariage original', 'Pièces d''identité', 'Deux photos par conjoint'],
 '3 ka hatramin''ny 5 andro', 'Ar 5 000', 5),
('fahafatesana', 'Taratasy fanamarinana fahafatesana', 'Acte de décès',
 'Fanambarana sy fanamarinana ny fahafatesan''ny olona iray tao anatin''ny Kaominina.',
 'Déclaration et certificat de décès survenu dans la commune.',
 array['Taratasy avy amin''ny hopitaly na mpitsabo', 'Karatra misy ny laharam-pahaterahan''ny maty', 'Karatra misy ny laharam-pahaterahan''ny mpangataka'],
 array['Certificat médical', 'Pièce d''identité du défunt', 'Pièce d''identité du déclarant'],
 'Andro iray', 'Maimaim-poana', 6);

-- ---------- Fokontany ----------
insert into fokontany (nom, chef, contact, ordre) values
('Anjomakely', 'RASOAMANANA Jean', '034 00 000 01', 1),
('Anjoma Betoho', 'RAKOTOARISOA Marie', '034 00 000 02', 2),
('Ambodivoara', 'ANDRIANJAFY Paul', '034 00 000 03', 3),
('Antsahamalaza', 'RANDRIANASOLO Helene', '034 00 000 04', 4),
('Manakana', 'RAVOAJANAHARY Eric', '034 00 000 05', 5),
('Ambatoharanana', 'RAZAFINDRAKOTO Sophie', '034 00 000 06', 6),
('Soavinarivo', 'RAKOTOMALALA Denis', '034 00 000 07', 7),
('Antanambao', 'RAHARISOA Lalao', '034 00 000 08', 8);

-- ---------- Trano sy tosika sosialy ----------
insert into aides_sociales (titre_mg, titre_fr, description_mg, description_fr, public_cible_mg, public_cible_fr, contact) values
('Fanampiana sakafo ho an''ny fianakaviana sahirana', 'Aide alimentaire aux familles vulnérables',
 'Fizarana vary, menaka ary tsaramaso isaky ny roa volana ho an''ny fianakaviana voasoratra ao amin''ny lisitra sosialy.',
 'Distribution de riz, huile et haricots tous les deux mois aux familles inscrites sur la liste sociale.',
 'Fianakaviana manana fidiram-bola latsaky ny Ar 300 000 isam-bolana',
 'Familles dont le revenu mensuel est inférieur à 300 000 Ar', '034 00 000 10'),
('Fanampiana amin''ny fananganana trano', 'Aide à la construction de logement',
 'Fanohanana ara-teknika sy fitaovana amin''ny fananganana trano madio sy mafy orina.',
 'Appui technique et matériel pour la construction d''un logement durable.',
 'Fianakaviana manana tany fa tsy manana trano mafy orina',
 'Familles disposant d''un terrain mais sans logement en dur', '034 00 000 11'),
('Fiahiana ho an''ny zokiolona sy ny sembana', 'Assistance aux personnes âgées et handicapées',
 'Fitsidihana isam-bolana sy fanampiana ara-pahasalamana any an-trano.',
 'Visites mensuelles et appui sanitaire à domicile.',
 'Zokiolona mihoatra ny 65 taona sy olona sembana',
 'Personnes de plus de 65 ans et personnes en situation de handicap', '034 00 000 12');

-- ---------- Fitaterana ----------
insert into transport_lignes (ligne, depart, arrivee, horaires, tarif, duree) values
('Taxibrousse Viliahazo - Fianarantsoa', 'Viliahazo (fiantsonana afovoany)', 'Fianarantsoa', '06:00, 09:00, 14:00', 'Ar 12 000', '2 ora 30'),
('Taxibrousse Viliahazo - Ambositra', 'Viliahazo (fiantsonana afovoany)', 'Ambositra', '07:00, 13:00', 'Ar 15 000', '3 ora'),
('Taxi-brousse Viliahazo - Antsirabe', 'Viliahazo (fiantsonana afovoany)', 'Antsirabe', '05:30, 11:00', 'Ar 18 000', '4 ora'),
('Bus avy any an-tanàna mankany amin''ny fokontany', 'Viliahazo afovoany', 'Anjomakely / Anjoma Betoho', 'Isaky ny adiny iray, 6:00 - 18:00', 'Ar 1 000', '20 min');

-- ---------- Asa ----------
insert into emplois (titre, employeur, description_mg, description_fr, lieu, contact, date_limite) values
('Mpiasa fikojakojana lalana', 'Kaominina Viliahazo', 'Fandaminana sy fanadiovana ny lalana ao anatin''ny tanana. Mila olona 4.', 'Entretien et nettoyage des voiries communales. Quatre postes.', 'Viliahazo', 'Birao ny Kaominina', '2026-12-15'),
('Mpanao mofo sy mpiasa an-trano fivarotana', 'Hotely Tsara Tany', 'Fiofanana nandritra ny roa herinandro ary asa maharitra.', 'Formation de deux semaines puis emploi durable.', 'Viliahazo afovoany', '034 00 000 20', '2026-11-30'),
('Mpianatra fambolena voankazo', 'Komity Tantsaha Viliahazo', 'Fiofanana maimaim-poana momba ny fambolena voasary sy letchi.', 'Formation gratuite sur la culture des agrumes et du litchi.', 'Soavinarivo', '034 00 000 21', '2026-11-20');

insert into services_municipaux (nom_mg, nom_fr, description_mg, description_fr, horaire, contact) values
('Fandraofana fako', 'Collecte des déchets', 'Fandraofana fako isaky ny talata sy zoma maraina amin''ny fokontany rehetra.', 'Collecte des déchets chaque mardi et vendredi matin dans tous les fokontany.', 'Talata / Zoma, 6:00 - 10:00', '034 00 000 30'),
('Rano madio', 'Eau potable', 'Fizarana rano madio sy fikojakojana ny loharano.', 'Distribution d''eau potable et entretien des sources.', 'Isan''andro 6:00 - 11:00', '034 00 000 31'),
('Jiro sy fanazavana', 'Éclairage public', 'Fametrahana sy fikojakojana ny jiro eny amin''ny arabe.', 'Installation et maintenance de l''éclairage public.', 'Alatsinainy - Zoma, 8:00 - 16:00', '034 00 000 32'),
('Fahasalamana fototra', 'Santé de base', 'Tobim-pahasalamana fototra sy fitsaboana maimaim-poana ho an''ny ankizy latsaky ny 5 taona.', 'Centre de santé de base et soins gratuits pour les enfants de moins de 5 ans.', 'Isan''andro 7:30 - 16:00', '034 00 000 33');

-- ---------- Hetsika ----------
insert into evenements (titre_mg, titre_fr, description_mg, description_fr, date_event, lieu, type) values
('Fetin''ny Tanàna Viliahazo', 'Fête de la ville de Viliahazo',
 'Fety lehibe isan-taona : fampisehoana, hira sy dihy nentim-paharazana, ary tsena mpanao asa tanana.',
 'Grande fête annuelle : spectacles, chants et danses traditionnels, marché artisanal.',
 '2026-11-14T09:00:00+03:00', 'Kianja afovoany', 'fety'),
('Tsenan''ny tantsaha', 'Marché des paysans',
 'Fivarotana mivantana ny vokatra avy amin''ny tantsaha ao Viliahazo.',
 'Vente directe des produits des paysans de Viliahazo.',
 '2026-11-07T06:00:00+03:00', 'Kianja ny tsena', 'tsena'),
('Lalao baolina kitra : Viliahazo - Ambohimanga', 'Football : Viliahazo - Ambohimanga',
 'Lalao fifanandrinana isam-paritra. Fidirana maimaim-poana.',
 'Match régional. Entrée gratuite.',
 '2026-11-21T15:00:00+03:00', 'Kianja fanatanjahantena', 'fanatanjahantena'),
('Fampisehoana sarimihetsika teny an-kalamanjana', 'Cinéma en plein air',
 'Fampisehoana sarimihetsika ho an''ny fianakaviana, ampiarahina amin''ny fifanakalozan-kevitra.',
 'Projection de film pour les familles, suivie d''un débat.',
 '2026-11-28T19:00:00+03:00', 'Kianja afovoany', 'fampisehoana'),
('Fiofanana: fitantanam-bola ho an''ny vehivavy', 'Formation : gestion budgétaire des femmes',
 'Fiofanana maimaim-poana ho an''ny vehivavy mpivarotra.',
 'Formation gratuite pour les femmes commercantes.',
 '2026-12-05T08:00:00+03:00', 'Birao ny Kaominina', 'fampisehoana');

-- ---------- Fiangonana ----------
insert into fiangonana (nom, responsable, horaire_mg, horaire_fr, contact, adresse) values
('Fiangonana Katolika', 'Pretra Jean-Baptiste RAKOTO', 'Alahady 7:00 sy 9:00', 'Dimanche 7h et 9h', '034 00 000 40', 'Viliahazo afovoany'),
('Fiangonana Loterana', 'Pastora Marie RANDRIA', 'Alahady 8:00', 'Dimanche 8h', '034 00 000 41', 'Anjomakely'),
('Fiangonana FJKM', 'Pastora Paul RAZAFY', 'Alahady 9:00', 'Dimanche 9h', '034 00 000 42', 'Anjoma Betoho'),
('Fiangonana Anglikana', 'Pretra Simon ANDRIA', 'Alahady 7:30', 'Dimanche 7h30', '034 00 000 43', 'Ambodivoara'),
('Moskea', 'Imam Abdallah', 'Zoma 12:30', 'Vendredi 12h30', '034 00 000 44', 'Viliahazo afovoany');
