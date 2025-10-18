import React, { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { Button, Card } from "@/components/common";
import { getTrack, resolveQuestions, getPaperLabel } from "@/services/examData";
import { supabase } from "@/services/supabase";
import { getUuid } from "@/services/localStorage";
import { logError, logSuccess } from "@/utils/logger";

function sample(array, n) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const QuizPlay = () => {
  const { sessionId: sessionCode } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // id -> optionId
  const [loading, setLoading] = useState(true);
  const [paperOptions, setPaperOptions] = useState([]);
  const [paperSources, setPaperSources] = useState([]);
  const [resolvedPaper, setResolvedPaper] = useState(null);
  const [track, setTrack] = useState("");
  const [paper, setPaper] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const trackConfig = useMemo(() => getTrack(track), [track]);
  const trackLabel = trackConfig?.name || track?.toUpperCase();

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("code", sessionCode)
        .single();
      if (error || !data) {
        logError("Error loading quiz session", {
          error: error?.message,
          sessionCode,
        });
        navigate("/exams");
        return;
      }
      setQuestions(data.questions || []);
      setAnswers(data.answers || {});
      setPaperOptions([]); // TODO: if needed
      setPaperSources([]);
      setResolvedPaper(data.paper);
      setTrack(data.track);
      setPaper(data.paper);
      setLoading(false);
      setStartedAt(new Date());
    };
    if (sessionCode) {
      loadSession();
    } else {
      navigate("/exams");
    }
  }, [sessionCode, navigate]);

  useEffect(() => {
    if (trackConfig) return;
    setQuestions([]);
    setAnswers({});
    setPaperOptions([]);
    setPaperSources([]);
    setResolvedPaper(null);
    setLoading(false);
  }, [trackConfig]);

  const current = questions[idx];
  const total = questions.length;
  const progress = useMemo(
    () => (total ? Math.round(((idx + 1) / total) * 100) : 0),
    [idx, total]
  );

  const sourceOptions = useMemo(() => {
    if (!paperSources.length) return [];
    const map = new Map(
      paperOptions.map((option) => [option.id, option.label])
    );
    return paperSources.map((id) => ({ id, label: map.get(id) || id }));
  }, [paperOptions, paperSources]);

  const paperLabel = useMemo(() => {
    if (!trackConfig) return resolvedPaper || paper;
    const lookupSource = sourceOptions.length ? sourceOptions : paperOptions;
    const paperKey = resolvedPaper || paper;
    return getPaperLabel(track, paperKey, lookupSource);
  }, [track, trackConfig, paper, resolvedPaper, paperOptions, sourceOptions]);

  const selectAnswer = (qid, optionId) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  };

  const next = () => {
    if (idx < total - 1) setIdx(idx + 1);
  };
  const prev = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const quit = async () => {
    if (!questions.length) return;
    const summary = computeResult(questions, answers);
    const finished = Object.keys(answers).length === questions.length; // finished if all answered
    const timeSpent = startedAt
      ? Math.floor((new Date() - startedAt) / 1000)
      : 0;
    const sessionData = {
      answers,
      summary,
      finished,
      time_spent: timeSpent,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("quiz_sessions")
      .update(sessionData)
      .eq("code", sessionCode);
    if (error) {
      logError(
        "Error updating quiz session",
        {
          error: error.message,
          sessionCode,
        },
        { action: "update_quiz_session" }
      );
      navigate(`/result/${sessionCode}`);
    } else {
      logSuccess(
        "Quiz session updated",
        { sessionCode },
        { action: "update_quiz_session" }
      );
      navigate(`/result/${sessionCode}`);
    }
  };

  if (!trackConfig) {
    return (
      <div className="quiz-play quiz-play--missing">
        <div className="container">
          <Card hover={false}>
            <h1 className="quiz-play__title">Unknown track</h1>
            <p className="quiz-play__empty">
              We could not find practice papers for this track. Please select a
              valid exam from the library.
            </p>
            <div className="quiz-actions">
              <Link to="/exams">
                <Button variant="primary">Back to Exams</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="quiz-play quiz-play--loading">
        <div className="container">
          <Card hover={false}>
            <p className="quiz-play__loading">Loading questions…</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="quiz-play quiz-play--empty">
        <div className="container">
          <Card hover={false}>
            <p className="quiz-play__empty">
              No questions available for this selection. Try choosing a
              different paper or adjust your filters.
            </p>
            <div className="quiz-actions">
              <Link to={`/exams/${track}`}>
                <Button variant="outline">Back to {trackLabel}</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const qid = current.id;
  const selected = answers[qid];

  return (
    <div className="quiz-play">
      <section className="page-hero page-hero--subtle">
        <div className="container">
          <div className="page-hero__category">
            <span className={`category-badge category-badge--${track}`}>
              {trackConfig?.level || track?.toUpperCase()}
            </span>
          </div>
          <p className="page-hero__eyebrow">Practice Mode</p>
          <h1 className="page-hero__title">{trackLabel}</h1>
          {paperLabel ? (
            <p className="page-hero__subtitle">{paperLabel}</p>
          ) : null}
          <div className="quiz-play__meta">
            <span>Question {idx + 1}</span>
            <span>of {total}</span>
          </div>
          <div className="quiz-play__progress">
            <div
              className="quiz-play__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="quiz-play__content">
        <div className="container">
          <Card hover={false} className="quiz-play__card">
            <div className="quiz-question">
              <h2 className="quiz-question__title">{current.question?.text}</h2>
              {current.session && (
                <p className="quiz-question__session">
                  Session: {current.session}
                </p>
              )}
              <div
                className="quiz-question__options"
                role="radiogroup"
                aria-label="Answer choices"
              >
                {current.options?.map((opt) => {
                  const isSelected = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectAnswer(qid, opt.id)}
                      className={`quiz-option ${
                        isSelected ? "quiz-option--selected" : ""
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                    >
                      <span
                        className="quiz-option__indicator"
                        aria-hidden="true"
                      />
                      <span className="quiz-option__label">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="quiz-actions">
              <Button variant="outline" onClick={prev} disabled={idx === 0}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={next}
                disabled={idx === total - 1}
              >
                Next
              </Button>
              <Button variant="danger" onClick={quit} disabled={!total}>
                Finish & Review
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

function computeResult(questions, answers) {
  let correct = 0;
  const details = questions.map((q) => {
    const picked = answers[q.id];
    const isCorrect = picked === q.answer;
    if (isCorrect) correct += 1;

    // Extract question text properly
    let questionText = "";
    if (typeof q.question === "string") {
      questionText = q.question;
    } else if (typeof q.question === "object" && q.question !== null) {
      if (typeof q.question.text === "string") {
        questionText = q.question.text;
      } else if (Array.isArray(q.question.text)) {
        questionText = q.question.text
          .filter((t) => typeof t === "string")
          .join(" ");
      } else {
        questionText = "[Question with images or special content]";
      }
    }

    return {
      id: q.id,
      question: questionText,
      answers: q.options || [],
      picked,
      correctAnswer: q.answer,
      isCorrect,
    };
  });
  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  return { correct, total, score, details };
}

export default QuizPlay;
