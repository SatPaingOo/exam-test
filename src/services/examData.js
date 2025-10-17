import catalog from "@/assets/data/dummy.json";

// Friendly metadata for each track that is not present in the JSON catalog
const TRACK_META = {
  ip: {
    displayName: "IT Passport (IP)",
    level: "Beginner",
    summary:
      "Perfect starting point covering the core fundamentals of information technology.",
  },
  fe: {
    displayName: "Fundamental Engineer (FE)",
    level: "Intermediate",
    summary:
      "Build on your foundation with algorithm, database, and network deep dives.",
  },
  ap: {
    displayName: "Applied Engineer (AP)",
    level: "Advanced",
    summary:
      "Challenge yourself with applied scenarios that mirror the actual exam.",
  },
};

const DEFAULT_LEVEL = "Practice";
const DEFAULT_SUMMARY = "Additional papers are in development.";

const exams = Array.isArray(catalog?.exams) ? catalog.exams : [];

const trackIndex = exams.flatMap((exam) => {
  const types = Array.isArray(exam.types) ? exam.types : [];
  return types.map((type) => {
    const meta = TRACK_META[type.id] || {};
    return {
      examId: exam.id,
      examTitle: exam.title,
      id: type.id,
      name: meta.displayName || type.name || type.id,
      description: type.description,
      summary: meta.summary || type.description || DEFAULT_SUMMARY,
      level: meta.level || DEFAULT_LEVEL,
      years: Array.isArray(type.years) ? type.years : [],
    };
  });
});

const paperFiles = import.meta.glob("/src/assets/data/itpec/*/*.json");

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
  const key = `/src/assets/data/itpec/${trackId}/${paperId}.json`;
  const loader = paperFiles[key];
  if (!loader) return [];
  try {
    const module = await loader();
    const questions = module?.default;
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.warn(`Failed to load questions for ${key}`, error);
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
