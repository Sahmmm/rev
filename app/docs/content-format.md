# Format des contenus de revision

Ce document decrit le format initial des contenus places dans
`resources/processed/`. Il sert de contrat entre les ressources pedagogiques et
la future application.

## Objectif

Les PDF, examens, TP et notes personnelles sont des sources brutes. La web app a
besoin de contenus plus structures pour proposer :

- des flashcards filtrables ;
- des questions ecrites avec correction ;
- des challenges chronometres ;
- un suivi par theme et difficulte ;
- une repetition espacee.

## Fichiers de donnees

### `resources.json`

Indexe les documents sources. Chaque ressource possede un `id` stable utilise
par les flashcards et questions.

Exemple d'usage :

- retrouver le PDF source d'une question ;
- afficher "issu du cours CNN" dans l'app ;
- verifier quels supports n'ont pas encore ete transformes en questions.

### `topics.json`

Definit les themes de revision. Ces themes alimentent :

- les filtres ;
- les statistiques ;
- le choix des items dans les challenges ;
- le suivi des points forts/faibles.

### `flashcards.json`

Contient les cartes question/reponse. Une carte doit etre courte a lire, mais la
reponse peut etre dense. Le but est de declencher un rappel actif, pas de
remplacer le cours.

### `written-questions.json`

Contient les questions a reponse redigee. Elles sont plus proches du format
examen et incluent :

- une correction officielle ;
- une structure attendue ;
- des criteres d'auto-evaluation.

### `challenges.json`

Definit les modes d'entrainement chronometres. Un challenge ne liste pas
necessairement des items fixes : il peut decrire une strategie de selection,
par exemple "prendre les cartes dues et les themes faibles".

## Statuts

Les contenus utilisent un statut explicite :

- `draft` : contenu cree mais non relu ;
- `reviewed` : contenu relu pedagogiquement ;
- `active` : contenu pret a etre utilise dans l'app ;
- `archived` : contenu conserve mais masque par defaut.

Pour les ressources sources :

- `raw` : document depose mais non analyse ;
- `processed` : document exploite pour creer des contenus ;
- `reviewed` : contenus issus du document relus et valides.

## Regles de qualite

1. Une question doit evaluer une connaissance ou un raisonnement identifiable.
2. Une reponse doit expliciter les limites et confusions frequentes quand c'est
   utile.
3. Un item doit avoir au moins un theme.
4. Un item doit pointer vers une source.
5. Les contenus issus d'une extraction automatique doivent rester `draft` tant
   qu'ils n'ont pas ete relus.

## Exemple de flux d'ajout

1. Ajouter un PDF dans `resources/courses/`, `resources/exams/`,
   `resources/tp/` ou `resources/personal-notes/`.
2. Ajouter une entree dans `resources/processed/resources.json`.
3. Ajouter ou reutiliser les themes dans `topics.json`.
4. Creer des flashcards et questions en statut `draft`.
5. Relire les items et les passer a `reviewed` ou `active`.

## Prochaine evolution technique

Quand l'application sera codee, elle pourra charger ces fichiers JSON au
demarrage. Une premiere version peut se contenter de fichiers statiques. Une
version plus avancee pourra migrer ces donnees dans IndexedDB ou dans une base
PostgreSQL si l'app devient multi-utilisateur.
