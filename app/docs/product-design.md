# Conception produit - application de revision Deep Learning

## 1. Vision globale de la web app

L'application vise a transformer des ressources de cours classiques en un
systeme de revision active pour un etudiant de Master en informatique ou IA qui
prepare des epreuves de rattrapage en deep learning.

Le principe central n'est pas de relire passivement les PDF, mais de revenir
regulierement sur les notions difficiles via :

- des flashcards pour l'ancrage rapide des definitions, intuitions et formules ;
- des questions a reponse ecrite pour travailler l'explication rigoureuse ;
- des challenges courts pour simuler une contrainte d'examen ;
- un suivi de progression pour orienter les revisions vers les points faibles ;
- une repetition espacee pour maintenir les connaissances sur plusieurs semaines.

Les premiers supports disponibles couvrent deja des themes structurants :
reseaux de neurones, descente de gradient stochastique, CNN et approches
centrees donnees. L'application devra rester extensible pour integrer ensuite
les examens, TP et notes personnelles.

## 2. Architecture fonctionnelle

### Onglets principaux

1. **Tableau de bord**
   - Vue synthetique de la progression.
   - Recommandations de revision du jour.
   - Themes forts/faibles.
   - Acces rapide a la prochaine session.

2. **Flashcards**
   - Revision par cartes question/reponse.
   - Filtrage par theme, difficulte, source et statut.
   - Affichage progressif de la reponse.
   - Evaluation apres chaque carte : "OK", "A revoir", "Difficile".

3. **Questions ecrites**
   - Reponses redigees dans un champ texte.
   - Affichage de la reponse officielle apres validation.
   - Auto-evaluation qualitative.
   - Travail des raisonnements attendus en examen.

4. **Challenge**
   - Sprint court et chronometre.
   - Exemple de format : 20 minutes, 10 flashcards et 1 probleme type examen.
   - Bilan final avec score, erreurs et themes a retravailler.

5. **Ressources**
   - Inventaire des cours, examens, TP et notes.
   - Association entre une question et sa source.
   - Consultation des contenus prepares pour la revision.

6. **Statistiques**
   - Historique des sessions.
   - Courbe de maitrise par theme.
   - Nombre de cartes dues aujourd'hui.
   - Repartition des erreurs par difficulte et type de question.

### Flux utilisateur cible

1. L'etudiant ouvre le tableau de bord.
2. L'application propose les cartes dues selon la repetition espacee.
3. L'etudiant fait une session flashcards ou questions ecrites.
4. Il s'auto-evalue apres chaque item.
5. Le systeme met a jour la prochaine date de revision.
6. En fin de semaine, l'etudiant lance un challenge pour tester sa maitrise sous
   contrainte.

## 3. Description detaillee des fonctionnalites

### 3.1 Flashcards

Chaque flashcard contient :

- une question claire ;
- une reponse detaillee ;
- un theme principal ;
- une difficulte ;
- une source ;
- des tags secondaires.

Exemples de themes adaptes au niveau Master :

- CNN ;
- backpropagation ;
- descente de gradient stochastique ;
- regularisation ;
- generalisation ;
- fonctions d'activation ;
- architectures profondes ;
- biais inductifs ;
- approches centrees donnees.

Utilite pedagogique :

- force le rappel actif ;
- limite l'illusion de maitrise liee a la relecture ;
- permet de reviser souvent en sessions courtes ;
- facilite la memorisation des definitions, formules et intuitions.

La reponse ne doit pas etre seulement une phrase courte. Pour un niveau Master,
elle doit inclure les hypotheses, les limites, les cas d'usage et les liens avec
les notions voisines.

### 3.2 Questions a reponse ecrite

Ce module sert a travailler la formulation et le raisonnement. L'etudiant ecrit
sa reponse avant de consulter la correction.

Exemples :

- "Explique pourquoi la convolution introduit un biais inductif utile pour les
  images."
- "Compare batch gradient descent, stochastic gradient descent et mini-batch
  gradient descent."
- "Pourquoi la normalisation ou la regularisation peuvent ameliorer la
  generalisation ?"

Utilite pedagogique :

- prepare directement aux questions de cours et d'examen ;
- oblige a structurer une reponse ;
- revele les lacunes que les QCM ou flashcards ne montrent pas ;
- entraine la precision du vocabulaire scientifique.

L'auto-evaluation peut rester simple :

- **OK** : reponse correcte et suffisamment complete ;
- **A revoir** : idee generale presente mais manque de precision ;
- **Difficile** : notion non maitrisee.

### 3.3 Challenge

Le challenge est un mode rapide, contraint et ludique. Il ne remplace pas la
revision quotidienne, mais sert a tester la disponibilite des connaissances.

Format initial propose :

- duree : 20 minutes ;
- contenu : 10 flashcards et 1 probleme type examen ;
- selection : melange de cartes dues, themes faibles et questions de difficulte
  moyenne a elevee ;
- sortie : score, temps utilise, themes echoues, prochaine action conseillee.

Utilite pedagogique :

- entraine la recuperation sous pression ;
- simule une partie de la contrainte d'examen ;
- aide a prioriser les revisions suivantes ;
- rend la progression plus visible et motivante.

### 3.4 Suivi de progression

Le tableau de bord suit :

- nombre de cartes revisees ;
- taux de reussite par theme ;
- questions marquees "A revoir" ;
- evolution des themes faibles ;
- temps passe par session ;
- regularite des revisions.

L'objectif n'est pas de produire des statistiques complexes, mais de repondre a
des questions pratiques :

- Que dois-je reviser aujourd'hui ?
- Quels themes me posent encore probleme ?
- Est-ce que je progresse ou est-ce que je relis sans retenir ?

### 3.5 Historique des sessions

Chaque session garde une trace :

- date ;
- duree ;
- type de session ;
- items vus ;
- auto-evaluations ;
- themes travailles.

Utilite pedagogique :

- permet de mesurer la regularite ;
- aide a reconstruire le travail effectue avant l'examen ;
- rend visibles les notions recalcitrantes.

### 3.6 Repetition espacee

La repetition espacee planifie la prochaine apparition d'un item selon la
difficulte ressentie.

Regle conceptuelle simple pour une premiere version :

- **OK** : revoir plus tard ;
- **A revoir** : revoir bientot ;
- **Difficile** : revoir tres rapidement.

Pour une version plus avancee, l'application pourra utiliser un algorithme de
type SM-2 ou FSRS. Au demarrage, une logique simple suffit pour rester
implementable et explicable.

### 3.7 Filtres par difficulte et theme

Les filtres doivent permettre de construire une session ciblee :

- theme : CNN, SGD, reseaux de neurones, etc. ;
- difficulte : facile, moyen, difficile ;
- type : flashcard, question ecrite, probleme ;
- statut : nouveau, du aujourd'hui, a revoir, maitrise ;
- source : cours, examen, TP, note personnelle.

Utilite pedagogique :

- evite les sessions trop generales ;
- permet une revision strategique avant un rattrapage ;
- aide a isoler un chapitre faible.

## 4. Exemples de parcours utilisateur

### Parcours A - Revision quotidienne courte

1. L'etudiant ouvre le tableau de bord.
2. Il voit 18 cartes dues aujourd'hui, dont 7 sur les CNN.
3. Il lance une session flashcards de 10 minutes.
4. Il masque les reponses, tente de repondre mentalement, puis revele.
5. Il marque 6 cartes "OK", 3 "A revoir" et 1 "Difficile".
6. Le tableau de bord met a jour les revisions futures.

### Parcours B - Preparation d'une question de cours

1. L'etudiant ouvre l'onglet "Questions ecrites".
2. Il filtre sur "SGD / optimisation".
3. Il repond a une question comparative sur SGD et mini-batch SGD.
4. Il consulte la correction detaillee.
5. Il s'auto-evalue "A revoir" car il a oublie de parler de variance du
   gradient.
6. La question revient rapidement dans le planning.

### Parcours C - Challenge avant examen blanc

1. L'etudiant lance un sprint de 20 minutes.
2. L'application selectionne 10 flashcards et 1 exercice type examen.
3. Le chronometre impose une reponse rapide.
4. Le bilan montre une faiblesse sur les CNN et la regularisation.
5. L'application propose une session ciblee sur ces themes.

## 5. Proposition de structure de donnees conceptuelle

### Resource

Represente un document source.

- `id`
- `title`
- `type` : course, exam, tp, personal_note
- `path`
- `uploadedAt`
- `topics`
- `status` : raw, processed, reviewed

### Topic

Represente un theme pedagogique.

- `id`
- `name`
- `parentTopicId`
- `description`

Exemples :

- Deep Learning
  - Reseaux de neurones
  - Optimisation
  - CNN
  - Regularisation
  - Approches centrees donnees

### StudyItem

Base commune pour les contenus de revision.

- `id`
- `type` : flashcard, written_question, exam_problem
- `prompt`
- `officialAnswer`
- `difficulty`
- `topicIds`
- `sourceResourceId`
- `createdAt`
- `updatedAt`

### Flashcard

Specialisation de `StudyItem`.

- `question`
- `answer`
- `hints`
- `commonMistakes`

### WrittenQuestion

Specialisation de `StudyItem`.

- `expectedStructure`
- `gradingCriteria`
- `officialAnswer`

### ReviewState

Etat de revision propre a l'utilisateur.

- `userId`
- `studyItemId`
- `status` : new, learning, due, mastered
- `lastReviewedAt`
- `nextReviewAt`
- `interval`
- `easeFactor`
- `lastSelfRating` : ok, review, difficult

### StudySession

Trace une session de travail.

- `id`
- `userId`
- `type` : flashcards, written_questions, challenge
- `startedAt`
- `endedAt`
- `durationSeconds`
- `itemResults`

### ItemResult

Trace le resultat d'un item pendant une session.

- `studyItemId`
- `selfRating`
- `answerText`
- `timeSpentSeconds`
- `wasAnswerRevealed`

## 6. Suggestions techniques

La stack devra rester simple pour livrer rapidement une premiere version
utilisable.

### Option recommandee pour une premiere version

- **Frontend** : React avec TypeScript.
- **Build tool** : Vite.
- **UI** : composants simples, CSS modules ou Tailwind CSS.
- **Stockage local initial** : IndexedDB ou localStorage structure.
- **Format des contenus prepares** : JSON ou YAML versionnes dans
  `resources/processed/`.

Avantages :

- rapide a mettre en place ;
- facile a heberger statiquement ;
- suffisant pour une application personnelle de revision ;
- les contenus peuvent rester dans le depot Git.

### Evolution possible avec backend

Si l'application devient multi-utilisateur :

- **Backend** : Node.js/NestJS, FastAPI ou serveur serverless.
- **Base de donnees** : PostgreSQL.
- **Authentification** : email/password ou OAuth.
- **Recherche** : index par tags et themes.

### Pipeline de contenu

Etapes possibles :

1. Deposer les ressources sources dans `resources/`.
2. Extraire ou rediger les questions dans des fichiers structures.
3. Relire les contenus pour verifier exactitude et niveau Master.
4. Importer les fichiers structures dans l'application.
5. Suivre les revisions et ajuster la difficulte.

Il est preferable de garder une validation humaine des flashcards et
corrections, car les erreurs conceptuelles en deep learning peuvent etre
subtiles.

## 7. Idees d'evolutions futures

- Generation assistee de flashcards depuis les PDF, avec validation manuelle.
- Import automatique des TP notebooks pour creer des questions code/concepts.
- Mode "examen blanc" avec correction structuree.
- Cartes de concepts reliant les themes : optimisation, regularisation,
  architectures et generalisation.
- Export Anki.
- Recherche plein texte dans les questions et corrections.
- Niveau de confiance par theme.
- Mode oral : l'etudiant explique une notion, puis compare avec une correction.
- Ajout de rubriques "erreurs frequentes" issues des auto-evaluations.
- Integration de problemes numeriques : calcul de dimensions de tenseurs,
  nombre de parametres, receptive field, gradients simples.

## Prochaine etape proposee

Avant de coder, la prochaine etape logique est de definir le format exact des
contenus dans `resources/processed/`, par exemple :

- un schema JSON/YAML pour les flashcards ;
- un schema JSON/YAML pour les questions ecrites ;
- une premiere liste de themes ;
- quelques exemples rediges manuellement a partir des cours deja importes.
