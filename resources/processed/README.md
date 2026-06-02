# Contenus prepares pour l'application

Ce dossier contient les contenus structures qui alimenteront la future web app
de revision. Les fichiers sources restent dans `resources/courses/`,
`resources/exams/`, `resources/tp/` et `resources/personal-notes/`.

## Fichiers

- `resources.json` : index des documents sources importes.
- `topics.json` : taxonomie initiale des themes de deep learning.
- `flashcards.json` : cartes de revision question/reponse.
- `written-questions.json` : questions a reponse redigee.
- `challenges.json` : formats de challenges chronometres.
- `schemas/` : schemas JSON de validation conceptuelle.

## Principes de redaction

- Chaque item doit pointer vers une ressource source via `source.resourceId`.
- Les reponses doivent rester de niveau Master : hypotheses, limites, intuition
  et liens avec les notions voisines.
- Les contenus generes depuis les PDF doivent etre relus manuellement avant
  d'etre marques comme `reviewed`.
- Les tags servent au filtrage fin, tandis que `topicIds` sert au suivi de
  progression par theme.

## Cycle de vie conseille

1. `draft` : item cree rapidement depuis un cours ou une note.
2. `reviewed` : item relu et corrige.
3. `active` : item disponible dans l'application.
4. `archived` : item conserve mais masque des sessions normales.

Les exemples actuels sont une premiere base prudente, construite a partir des
themes visibles dans les supports deja importes. Ils devront etre enrichis apres
lecture detaillee des PDF, examens, TP et notes personnelles.
