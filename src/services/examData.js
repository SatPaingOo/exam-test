import catalog from "@/assets/data/dummy.json";
import { logError } from "@/utils/logger";

const DEFAULT_LEVEL = "Practice";
const DEFAULT_SUMMARY = "Additional papers are in development.";

const exams = Array.isArray(catalog?.exams) ? catalog.exams : [];

const trackIndex = exams.flatMap((exam) => {
  const types = Array.isArray(exam.types) ? exam.types : [];
  return types.map((type) => ({
    examId: exam.id,
    examTitle: exam.title,
    id: type.id,
    name: type.displayName || type.name || type.id,
    description: type.description,
    summary: type.summary || type.description || DEFAULT_SUMMARY,
    level: type.level || DEFAULT_LEVEL,
    years: Array.isArray(type.years) ? type.years : [],
    jsonFormat: type.jsonFormat || [],
  }));
});

const paperFiles = import.meta.glob("/src/assets/data/*/*/*.json");

export function listTracks() {
  return trackIndex;
}

export function getTrack(trackId) {
  return trackIndex.find((track) => track.id === trackId) || null;
}

export function listPaperOptions(trackId) {
  const track = getTrack(trackId);
  if (!track) return [];
  return track.years.map((year) => ({
    id: year.id,
    label: year.name || year.id,
  }));
}

export function getPaperLabel(trackId, paperId, allPapers = []) {
  if (!paperId) return "";
  if (paperId === "random") {
    const total = allPapers.length || listPaperOptions(trackId).length;
    if (total <= 1) {
      return allPapers[0]?.label || "Random selection";
    }
    return `Random mix of ${total} papers`;
  }
  const papers = allPapers.length ? allPapers : listPaperOptions(trackId);
  return papers.find((paper) => paper.id === paperId)?.label || paperId;
}

async function loadPaperQuestions(trackId, paperId) {
  // Get the exam type from track configuration
  const track = getTrack(trackId);
  if (!track) return [];

  // Construct dynamic path: /src/assets/data/{examId}/{trackId}/{paperId}.json
  const key = `/src/assets/data/${track.examId}/${trackId}/${paperId}.json`;
  const loader = paperFiles[key];

  if (!loader) return [];
  try {
    const module = await loader();
    let questions = module?.default;
    if (!Array.isArray(questions)) return [];

    // Check if data is in session format (FE/AP style)
    const hasSessions =
      questions.length > 0 &&
      questions[0].questions &&
      Array.isArray(questions[0].questions);
    if (hasSessions) {
      // Flatten sessions into a single array of questions, adding session info
      questions = questions.flatMap((session) =>
        (session.questions || []).map((question) => ({
          ...question,
          session: session.id || session.name || "unknown",
        }))
      );
    }

    return questions;
  } catch (error) {
    logError(`Failed to load questions for ${key}`, {
      error: error.message,
      trackId,
      paperId,
    });
    return [];
  }
}

export async function resolveQuestions(trackId, paperId) {
  const paperOptions = listPaperOptions(trackId);
  const paperIds = paperOptions.map((paper) => paper.id);
  if (!paperIds.length) {
    return { questions: [], paperIds: [], paperOptions, resolvedPaperId: null };
  }

  const normalized = typeof paperId === "string" ? paperId.toLowerCase() : "";
  const canonicalPaperId = normalized
    ? paperOptions.find((option) => option.id.toLowerCase() === normalized)?.id
    : null;
  const isRandom =
    !normalized || normalized === "random" || normalized === "all";

  if (isRandom) {
    const all = await Promise.all(
      paperIds.map((id) => loadPaperQuestions(trackId, id))
    );
    return {
      questions: all.flat(),
      paperIds,
      paperOptions,
      resolvedPaperId: null,
    };
  }

  const targetPaper = canonicalPaperId || paperId;

  if (!paperIds.includes(targetPaper)) {
    return { questions: [], paperIds: [], paperOptions, resolvedPaperId: null };
  }

  const questions = await loadPaperQuestions(trackId, targetPaper);
  return {
    questions,
    paperIds: [targetPaper],
    paperOptions,
    resolvedPaperId: targetPaper,
  };
}
