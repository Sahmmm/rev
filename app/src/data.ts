import challengesJson from "../../resources/processed/challenges.json";
import flashcardsJson from "../../resources/processed/flashcards.json";
import resourcesJson from "../../resources/processed/resources.json";
import topicsJson from "../../resources/processed/topics.json";
import writtenQuestionsJson from "../../resources/processed/written-questions.json";
import type { Challenge, Flashcard, Resource, Topic, WrittenQuestion } from "./types";

export const topics = topicsJson.topics as Topic[];
export const resources = resourcesJson.resources as Resource[];
export const flashcards = flashcardsJson.flashcards as Flashcard[];
export const writtenQuestions = writtenQuestionsJson.writtenQuestions as WrittenQuestion[];
export const challenges = challengesJson.challenges as Challenge[];

export const topicById = new Map(topics.map((topic) => [topic.id, topic]));
export const resourceById = new Map(resources.map((resource) => [resource.id, resource]));

export function getTopicNames(topicIds: string[]) {
  return topicIds.map((id) => topicById.get(id)?.name ?? id);
}

export function getResourceTitle(resourceId: string) {
  return resourceById.get(resourceId)?.title ?? resourceId;
}

export function difficultyLabel(difficulty: string) {
  const labels: Record<string, string> = {
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile"
  };

  return labels[difficulty] ?? difficulty;
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Brouillon",
    reviewed: "Relu",
    active: "Actif",
    archived: "Archive"
  };

  return labels[status] ?? status;
}
