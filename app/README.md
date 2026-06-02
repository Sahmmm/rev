# Application de revision

Ce dossier accueillera la web application de revision active pour le deep
learning.

## Dossiers

- `src/` : code source de l'application lorsque la stack aura ete choisie.
- `public/` : fichiers statiques, images ou ressources servies directement.
- `docs/` : documents de conception produit, UX educative et architecture.

## Documents

- `docs/product-design.md` : vision produit, architecture fonctionnelle,
  parcours utilisateur, donnees conceptuelles et pistes techniques.
- `docs/content-format.md` : format des contenus structures pour alimenter
  les flashcards, questions ecrites et challenges.

## Lancement local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

La premiere implementation charge les contenus JSON de `../resources/processed/`
et propose une interface claire avec page d'accueil, tableau de bord,
flashcards, questions ecrites, challenge, ressources et progression locale.

L'experience de revision inclut une navigation fluide carte par carte et
question par question, avec barres de progression, controles precedent/suivant
et auto-evaluation locale.
