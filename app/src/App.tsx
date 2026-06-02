import { useEffect, useMemo, useState } from "react";
import {
  challenges,
  difficultyLabel,
  flashcards,
  getResourceTitle,
  getTopicNames,
  resources,
  statusLabel,
  topics,
  writtenQuestions
} from "./data";
import type { Challenge, Flashcard, ProgressEntry, ReviewRating, SessionEntry, WrittenQuestion } from "./types";

type Tab = "dashboard" | "flashcards" | "written" | "challenge" | "resources" | "progress";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "flashcards", label: "Flashcards" },
  { id: "written", label: "Questions ecrites" },
  { id: "challenge", label: "Challenge" },
  { id: "resources", label: "Ressources" },
  { id: "progress", label: "Progression" }
];

const ratingLabels: Record<ReviewRating, string> = {
  ok: "OK",
  review: "A revoir",
  difficult: "Difficile"
};

const ratingClassNames: Record<ReviewRating, string> = {
  ok: "success",
  review: "warning",
  difficult: "danger"
};

const topicOptions = [{ id: "all", name: "Tous les themes" }, ...topics];
const difficultyOptions = ["all", "easy", "medium", "hard"] as const;

function useLocalState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function nextReviewDate(rating: ReviewRating) {
  const date = new Date();
  const daysByRating: Record<ReviewRating, number> = {
    ok: 7,
    review: 2,
    difficult: 1
  };
  date.setDate(date.getDate() + daysByRating[rating]);
  return date.toISOString();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getItemTopics(item: Flashcard | WrittenQuestion) {
  return getTopicNames(item.topicIds).join(", ");
}

function selectChallengeCards(challenge: Challenge, progress: Record<string, ProgressEntry>) {
  const ratingPriority: Record<ReviewRating | "new", number> = {
    difficult: 0,
    review: 1,
    new: 2,
    ok: 3
  };

  return [...flashcards]
    .sort((a, b) => {
      const aRating = progress[a.id]?.rating ?? "new";
      const bRating = progress[b.id]?.rating ?? "new";
      return ratingPriority[aRating] - ratingPriority[bRating];
    })
    .slice(0, challenge.selection.flashcardCount);
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [progress, setProgress] = useLocalState<Record<string, ProgressEntry>>("dl-revision-progress", {});
  const [sessions, setSessions] = useLocalState<SessionEntry[]>("dl-revision-sessions", []);

  const rateItem = (
    itemId: string,
    rating: ReviewRating,
    title: string,
    type: SessionEntry["type"]
  ) => {
    const now = new Date().toISOString();
    setProgress((current) => ({
      ...current,
      [itemId]: {
        rating,
        reviewedAt: now,
        nextReviewAt: nextReviewDate(rating),
        count: (current[itemId]?.count ?? 0) + 1
      }
    }));
    setSessions((current) => [
      {
        id: crypto.randomUUID(),
        type,
        title,
        rating,
        createdAt: now
      },
      ...current
    ].slice(0, 30));
  };

  const dueCount = useMemo(() => {
    const now = Date.now();
    return Object.values(progress).filter((entry) => new Date(entry.nextReviewAt).getTime() <= now).length;
  }, [progress]);

  const reviewedCount = Object.keys(progress).length;
  const masteryRate = reviewedCount === 0
    ? 0
    : Math.round(
        (Object.values(progress).filter((entry) => entry.rating === "ok").length / reviewedCount) * 100
      );

  const weakTopics = useMemo(() => {
    const counts = new Map<string, number>();
    const allItems = [...flashcards, ...writtenQuestions];

    allItems.forEach((item) => {
      const entry = progress[item.id];
      if (!entry || entry.rating === "ok") {
        return;
      }

      item.topicIds.forEach((topicId) => {
        counts.set(topicId, (counts.get(topicId) ?? 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topicId, count]) => ({
        topic: topics.find((topic) => topic.id === topicId)?.name ?? topicId,
        count
      }));
  }, [progress]);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">Revision active - Deep Learning Master</span>
          <h1>Apprendre durablement, pas seulement relire.</h1>
          <p>
            Une premiere interface claire pour reviser les notions de reseaux de neurones,
            SGD, CNN et approches centrees donnees avec rappel actif et auto-evaluation.
          </p>
        </div>
        <div className="hero-card">
          <span className="hero-number">{flashcards.length}</span>
          <span>flashcards pretes</span>
          <small>{writtenQuestions.length} questions ecrites structurees</small>
        </div>
      </header>

      <nav className="tabs" aria-label="Navigation principale">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "tab active" : "tab"}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === "dashboard" && (
          <Dashboard
            dueCount={dueCount}
            masteryRate={masteryRate}
            reviewedCount={reviewedCount}
            sessions={sessions}
            weakTopics={weakTopics}
            onStartFlashcards={() => setActiveTab("flashcards")}
            onStartChallenge={() => setActiveTab("challenge")}
          />
        )}
        {activeTab === "flashcards" && <FlashcardsPanel progress={progress} onRate={rateItem} />}
        {activeTab === "written" && <WrittenQuestionsPanel progress={progress} onRate={rateItem} />}
        {activeTab === "challenge" && <ChallengePanel progress={progress} onRate={rateItem} />}
        {activeTab === "resources" && <ResourcesPanel />}
        {activeTab === "progress" && (
          <ProgressPanel progress={progress} sessions={sessions} weakTopics={weakTopics} />
        )}
      </main>
    </div>
  );
}

function Dashboard({
  dueCount,
  masteryRate,
  reviewedCount,
  sessions,
  weakTopics,
  onStartFlashcards,
  onStartChallenge
}: {
  dueCount: number;
  masteryRate: number;
  reviewedCount: number;
  sessions: SessionEntry[];
  weakTopics: Array<{ topic: string; count: number }>;
  onStartFlashcards: () => void;
  onStartChallenge: () => void;
}) {
  return (
    <section className="grid two-columns">
      <div className="panel">
        <span className="section-kicker">Aujourd'hui</span>
        <h2>Plan de revision</h2>
        <p className="muted">
          Commence par les items dus, puis termine par un sprint court si tu veux
          verifier la disponibilite des connaissances.
        </p>
        <div className="stats-grid">
          <StatCard label="Items dus" value={dueCount} tone="lavender" />
          <StatCard label="Items vus" value={reviewedCount} tone="mint" />
          <StatCard label="Maitrise OK" value={`${masteryRate}%`} tone="peach" />
        </div>
        <div className="actions-row">
          <button className="primary-button" onClick={onStartFlashcards} type="button">
            Reviser les cartes
          </button>
          <button className="ghost-button" onClick={onStartChallenge} type="button">
            Lancer un challenge
          </button>
        </div>
      </div>

      <div className="panel pastel-panel">
        <span className="section-kicker">Diagnostic</span>
        <h2>Points a surveiller</h2>
        {weakTopics.length > 0 ? (
          <ul className="topic-list">
            {weakTopics.map((entry) => (
              <li key={entry.topic}>
                <span>{entry.topic}</span>
                <strong>{entry.count} a revoir</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            Pas encore de point faible detecte. Fais quelques cartes pour alimenter le suivi.
          </p>
        )}
      </div>

      <div className="panel wide">
        <span className="section-kicker">Historique recent</span>
        <h2>Dernieres auto-evaluations</h2>
        <SessionList sessions={sessions.slice(0, 6)} />
      </div>
    </section>
  );
}

function FlashcardsPanel({
  progress,
  onRate
}: {
  progress: Record<string, ProgressEntry>;
  onRate: (itemId: string, rating: ReviewRating, title: string, type: SessionEntry["type"]) => void;
}) {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<(typeof difficultyOptions)[number]>("all");
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const filteredCards = useMemo(() => {
    return flashcards.filter((card) => {
      const matchesTopic = selectedTopic === "all" || card.topicIds.includes(selectedTopic);
      const matchesDifficulty = selectedDifficulty === "all" || card.difficulty === selectedDifficulty;
      return matchesTopic && matchesDifficulty;
    });
  }, [selectedDifficulty, selectedTopic]);

  useEffect(() => {
    setCardIndex(0);
    setRevealed(false);
  }, [selectedTopic, selectedDifficulty]);

  const card = filteredCards[cardIndex];

  if (!card) {
    return (
      <section className="panel empty-state">
        <h2>Aucune carte trouvee</h2>
        <p>Modifie les filtres pour afficher des flashcards.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <PanelHeader
        kicker="Rappel actif"
        title="Flashcards"
        description="Tente de repondre avant d'afficher la correction. L'auto-evaluation alimente la repetition espacee."
      />

      <Filters
        selectedTopic={selectedTopic}
        selectedDifficulty={selectedDifficulty}
        onTopicChange={setSelectedTopic}
        onDifficultyChange={setSelectedDifficulty}
      />

      <article className="study-card">
        <div className="card-meta">
          <Badge>{difficultyLabel(card.difficulty)}</Badge>
          <Badge>{statusLabel(card.status)}</Badge>
          <span>
            Carte {cardIndex + 1} / {filteredCards.length}
          </span>
        </div>
        <h3>{card.question}</h3>
        <p className="muted">{getItemTopics(card)}</p>

        {card.hints.length > 0 && (
          <div className="hint-box">
            <strong>Indice</strong>
            <span>{card.hints[0]}</span>
          </div>
        )}

        {revealed ? (
          <div className="answer-box">
            <strong>Reponse detaillee</strong>
            <p>{card.answer}</p>
            {card.commonMistakes.length > 0 && (
              <p className="mistake">
                Piege frequent : {card.commonMistakes[0]}
              </p>
            )}
          </div>
        ) : (
          <button className="primary-button" onClick={() => setRevealed(true)} type="button">
            Afficher la reponse
          </button>
        )}

        <RatingButtons
          disabled={!revealed}
          onRate={(rating) => {
            onRate(card.id, rating, card.question, "flashcards");
            setRevealed(false);
            setCardIndex((current) => (current + 1) % filteredCards.length);
          }}
        />

        <div className="card-footer">
          <button
            className="ghost-button"
            onClick={() => {
              setRevealed(false);
              setCardIndex((current) => (current === 0 ? filteredCards.length - 1 : current - 1));
            }}
            type="button"
          >
            Precedente
          </button>
          <button
            className="ghost-button"
            onClick={() => {
              setRevealed(false);
              setCardIndex((current) => (current + 1) % filteredCards.length);
            }}
            type="button"
          >
            Suivante
          </button>
        </div>
        {progress[card.id] && (
          <p className="review-note">
            Derniere evaluation : {ratingLabels[progress[card.id].rating]} -
            prochaine revision {formatDate(progress[card.id].nextReviewAt)}
          </p>
        )}
      </article>
    </section>
  );
}

function WrittenQuestionsPanel({
  progress,
  onRate
}: {
  progress: Record<string, ProgressEntry>;
  onRate: (itemId: string, rating: ReviewRating, title: string, type: SessionEntry["type"]) => void;
}) {
  const [selectedId, setSelectedId] = useState(writtenQuestions[0]?.id ?? "");
  const [answer, setAnswer] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);

  const question = writtenQuestions.find((item) => item.id === selectedId) ?? writtenQuestions[0];

  if (!question) {
    return (
      <section className="panel empty-state">
        <h2>Aucune question ecrite disponible</h2>
      </section>
    );
  }

  return (
    <section className="grid two-columns">
      <div className="panel">
        <PanelHeader
          kicker="Production ecrite"
          title="Questions a reponse redigee"
          description="Redige d'abord ta reponse, puis compare avec la correction officielle."
        />
        <label className="field-label" htmlFor="question-select">
          Choisir une question
        </label>
        <select
          id="question-select"
          value={selectedId}
          onChange={(event) => {
            setSelectedId(event.target.value);
            setAnswer("");
            setShowCorrection(false);
          }}
        >
          {writtenQuestions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.prompt}
            </option>
          ))}
        </select>

        <article className="written-prompt">
          <Badge>{difficultyLabel(question.difficulty)}</Badge>
          <h3>{question.prompt}</h3>
          <p className="muted">{getItemTopics(question)}</p>
        </article>

        <label className="field-label" htmlFor="written-answer">
          Ma reponse
        </label>
        <textarea
          id="written-answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Ecris une reponse structuree avant d'afficher la correction..."
        />

        <div className="actions-row">
          <button className="primary-button" onClick={() => setShowCorrection(true)} type="button">
            Afficher la correction
          </button>
          <button className="ghost-button" onClick={() => setAnswer("")} type="button">
            Effacer
          </button>
        </div>
      </div>

      <div className="panel pastel-panel">
        <span className="section-kicker">Correction</span>
        {showCorrection ? (
          <>
            <h2>Reponse officielle</h2>
            <p>{question.officialAnswer}</p>
            <h3>Structure attendue</h3>
            <Checklist items={question.expectedStructure} />
            <h3>Criteres d'auto-evaluation</h3>
            <Checklist items={question.gradingCriteria} />
            <RatingButtons
              onRate={(rating) => {
                onRate(question.id, rating, question.prompt, "written-question");
              }}
            />
            {progress[question.id] && (
              <p className="review-note">
                Derniere evaluation : {ratingLabels[progress[question.id].rating]}
              </p>
            )}
          </>
        ) : (
          <p className="muted">
            La correction reste masquee pour proteger le rappel actif. Affiche-la
            apres avoir formule une vraie tentative.
          </p>
        )}
      </div>
    </section>
  );
}

function ChallengePanel({
  progress,
  onRate
}: {
  progress: Record<string, ProgressEntry>;
  onRate: (itemId: string, rating: ReviewRating, title: string, type: SessionEntry["type"]) => void;
}) {
  const activeChallenges = challenges.filter((challenge) => challenge.status !== "archived");
  const [selectedId, setSelectedId] = useState(activeChallenges[0]?.id ?? "");
  const [started, setStarted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const challenge = activeChallenges.find((item) => item.id === selectedId) ?? activeChallenges[0];
  const challengeCards = challenge ? selectChallengeCards(challenge, progress) : [];
  const challengeQuestion = writtenQuestions[0];

  useEffect(() => {
    if (!started || remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds, started]);

  if (!challenge) {
    return (
      <section className="panel empty-state">
        <h2>Aucun challenge disponible</h2>
      </section>
    );
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <section className="panel">
      <PanelHeader
        kicker="Mode evaluation"
        title="Challenge"
        description="Un sprint court pour tester le rappel sous contrainte et identifier les themes faibles."
      />

      <div className="challenge-toolbar">
        <select
          value={selectedId}
          onChange={(event) => {
            setSelectedId(event.target.value);
            setStarted(false);
            setRemainingSeconds(0);
          }}
        >
          {activeChallenges.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="timer">{started ? `${minutes}:${seconds}` : `${challenge.durationMinutes}:00`}</div>
        <button
          className="primary-button"
          onClick={() => {
            setStarted(true);
            setRemainingSeconds(challenge.durationMinutes * 60);
          }}
          type="button"
        >
          Demarrer
        </button>
      </div>

      <div className="challenge-grid">
        <div className="challenge-summary">
          <h3>{challenge.name}</h3>
          <p>{challenge.description}</p>
          <p className="muted">{challenge.pedagogicalGoal}</p>
          <h4>Critere de reussite</h4>
          <Checklist items={challenge.successCriteria} />
        </div>
        <div className="challenge-summary soft">
          <h3>Selection prevue</h3>
          <p>{challenge.selection.topicStrategy}</p>
          <div className="mini-stats">
            <span>{challenge.selection.flashcardCount} flashcards</span>
            <span>{challenge.selection.writtenQuestionCount} question ecrite</span>
          </div>
        </div>
      </div>

      {started && (
        <div className="challenge-content">
          <h3>Flashcards du sprint</h3>
          <div className="compact-list">
            {challengeCards.map((card) => (
              <div className="compact-card" key={card.id}>
                <span>{card.question}</span>
                <RatingButtons
                  compact
                  onRate={(rating) => onRate(card.id, rating, card.question, "challenge")}
                />
              </div>
            ))}
          </div>

          {challengeQuestion && (
            <div className="exam-problem">
              <h3>Probleme type examen</h3>
              <p>{challengeQuestion.prompt}</p>
              <details>
                <summary>Voir la correction apres tentative</summary>
                <p>{challengeQuestion.officialAnswer}</p>
              </details>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ResourcesPanel() {
  return (
    <section className="panel">
      <PanelHeader
        kicker="Sources"
        title="Ressources importees"
        description="Les contenus de revision restent relies aux supports sources pour permettre une verification rapide."
      />
      <div className="resource-grid">
        {resources.map((resource) => (
          <article className="resource-card" key={resource.id}>
            <Badge>{resource.type}</Badge>
            <h3>{resource.title}</h3>
            <p>{resource.path}</p>
            <div className="tag-row">
              {getTopicNames(resource.topics).map((topic) => (
                <span className="tag" key={topic}>{topic}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgressPanel({
  progress,
  sessions,
  weakTopics
}: {
  progress: Record<string, ProgressEntry>;
  sessions: SessionEntry[];
  weakTopics: Array<{ topic: string; count: number }>;
}) {
  return (
    <section className="grid two-columns">
      <div className="panel">
        <PanelHeader
          kicker="Repetition espacee"
          title="Etat des revisions"
          description="Chaque auto-evaluation planifie une prochaine revision selon une regle simple."
        />
        <div className="progress-list">
          {Object.entries(progress).length > 0 ? (
            Object.entries(progress).map(([itemId, entry]) => (
              <div className="progress-row" key={itemId}>
                <span>{itemId}</span>
                <strong className={ratingClassNames[entry.rating]}>{ratingLabels[entry.rating]}</strong>
                <small>Prochaine : {formatDate(entry.nextReviewAt)}</small>
              </div>
            ))
          ) : (
            <p className="muted">Aucune revision enregistree pour le moment.</p>
          )}
        </div>
      </div>

      <div className="panel pastel-panel">
        <span className="section-kicker">Themes faibles</span>
        <h2>Priorites actuelles</h2>
        {weakTopics.length > 0 ? (
          <ul className="topic-list">
            {weakTopics.map((entry) => (
              <li key={entry.topic}>
                <span>{entry.topic}</span>
                <strong>{entry.count}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Les priorites apparaitront apres quelques auto-evaluations.</p>
        )}
      </div>

      <div className="panel wide">
        <span className="section-kicker">Sessions</span>
        <h2>Historique</h2>
        <SessionList sessions={sessions} />
      </div>
    </section>
  );
}

function Filters({
  selectedTopic,
  selectedDifficulty,
  onTopicChange,
  onDifficultyChange
}: {
  selectedTopic: string;
  selectedDifficulty: (typeof difficultyOptions)[number];
  onTopicChange: (value: string) => void;
  onDifficultyChange: (value: (typeof difficultyOptions)[number]) => void;
}) {
  return (
    <div className="filters">
      <label>
        Theme
        <select value={selectedTopic} onChange={(event) => onTopicChange(event.target.value)}>
          {topicOptions.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Difficulte
        <select
          value={selectedDifficulty}
          onChange={(event) => onDifficultyChange(event.target.value as (typeof difficultyOptions)[number])}
        >
          {difficultyOptions.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty === "all" ? "Toutes" : difficultyLabel(difficulty)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function RatingButtons({
  disabled = false,
  compact = false,
  onRate
}: {
  disabled?: boolean;
  compact?: boolean;
  onRate: (rating: ReviewRating) => void;
}) {
  return (
    <div className={compact ? "rating-buttons compact" : "rating-buttons"}>
      {(Object.keys(ratingLabels) as ReviewRating[]).map((rating) => (
        <button
          className={`rating-button ${ratingClassNames[rating]}`}
          disabled={disabled}
          key={rating}
          onClick={() => onRate(rating)}
          type="button"
        >
          {ratingLabels[rating]}
        </button>
      ))}
    </div>
  );
}

function PanelHeader({
  kicker,
  title,
  description
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="panel-header">
      <span className="section-kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className={`stat-card ${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return <span className="badge">{children}</span>;
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="checklist">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SessionList({ sessions }: { sessions: SessionEntry[] }) {
  if (sessions.length === 0) {
    return <p className="muted">Aucune session enregistree.</p>;
  }

  return (
    <div className="session-list">
      {sessions.map((session) => (
        <div className="session-row" key={session.id}>
          <div>
            <strong>{session.title}</strong>
            <span>{session.type}</span>
          </div>
          <div>
            <strong className={ratingClassNames[session.rating]}>{ratingLabels[session.rating]}</strong>
            <span>{formatDate(session.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
