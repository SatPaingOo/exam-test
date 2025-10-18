import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button } from "@/components/common";
import { supabase } from "@/services/supabase";
import { logError } from "@/utils/logger";

const QuizResult = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttempt = async () => {
      setLoading(true);
      // Check if attemptId is numeric (DB id) or code
      if (/^\d+$/.test(attemptId)) {
        const { data, error } = await supabase
          .from("quiz_sessions")
          .select("*")
          .eq("id", attemptId)
          .single();
        if (error) {
          logError(
            "Error loading quiz session from DB",
            {
              error: error.message,
              attemptId,
            },
            { action: "load_quiz_session_failed" }
          );
          setAttempt(null);
        } else {
          // Transform to match expected format
          setAttempt({
            ...data,
            trackLabel: data.track?.toUpperCase() || "Practice",
            paperLabel: data.paper || "Session",
            papersUsed: [], // TODO: if needed
            resolvedPaper: null,
            countRequested: data.questions?.length || 0,
            questionsServed: data.questions?.length || 0,
            completedAt: data.updated_at,
            paperOptions: [],
          });
        }
      } else {
        // Load by code
        const { data, error } = await supabase
          .from("quiz_sessions")
          .select("*")
          .eq("code", attemptId)
          .single();
        if (error) {
          logError(
            "Error loading quiz session from DB by code",
            {
              error: error.message,
              attemptId,
            },
            { action: "load_quiz_session_failed" }
          );
          setAttempt(null);
        } else {
          // Transform to match expected format
          setAttempt({
            ...data,
            trackLabel: data.track?.toUpperCase() || "Practice",
            paperLabel: data.paper || "Session",
            papersUsed: [], // TODO: if needed
            resolvedPaper: null,
            countRequested: data.questions?.length || 0,
            questionsServed: data.questions?.length || 0,
            completedAt: data.updated_at,
            paperOptions: [],
          });
        }
      }
      setLoading(false);
    };
    loadAttempt();
  }, [attemptId]);

  const paperLookup = useMemo(
    () =>
      attempt
        ? new Map(
            (attempt.paperOptions || []).map((option) => [
              option.id,
              option.label,
            ])
          )
        : new Map(),
    [attempt]
  );

  if (loading) {
    return (
      <div className="quiz-result">
        <div className="container">
          <Card hover={false}>
            <p>Loading result...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="quiz-result quiz-result--missing">
        <div className="container">
          <Card hover={false}>
            <h1 className="quiz-result__title">Result not found</h1>
            <p className="quiz-result__subtitle">
              The attempt expired or was cleared from this device.
            </p>
            <div className="quiz-actions">
              <Link to="/exams">
                <Button variant="primary">Browse Exams</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const {
    track,
    paper,
    trackLabel,
    paperLabel,
    papersUsed = [],
    paperOptions = [],
    summary,
    countRequested,
  } = attempt;

  const displayTrack = trackLabel || track?.toUpperCase?.() || "Practice";
  const displayPaper = paperLabel || paper || "Session";
  const safeSummary = summary || {
    score: 0,
    correct: 0,
    total: 0,
    details: [],
  };
  const uniquePapers = Array.isArray(papersUsed)
    ? [...new Set(papersUsed)]
    : [];
  const paperBadges = uniquePapers.map((id) => paperLookup.get(id) || id);

  return (
    <div className="quiz-result">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__category">
            <span className={`category-badge category-badge--${track}`}>
              {track?.toUpperCase()}
            </span>
          </div>
          <p className="page-hero__eyebrow">Attempt Summary</p>
          <h1 className="page-hero__title">{displayTrack}</h1>
          <p className="page-hero__subtitle">{displayPaper}</p>
        </div>
      </section>

      <section className="quiz-result__content">
        <div className="container">
          <Card hover={false} className="quiz-result__card">
            <div className="quiz-result__overview">
              <div className="quiz-result__metric">
                <span className="label">Score</span>
                <span className="value">{safeSummary.score}%</span>
              </div>
              <div className="quiz-result__metric">
                <span className="label">Correct</span>
                <span className="value">
                  {safeSummary.correct} / {safeSummary.total}
                </span>
              </div>
              <div className="quiz-result__metric">
                <span className="label">Questions</span>
                <span className="value">{safeSummary.total}</span>
              </div>
              {countRequested ? (
                <div className="quiz-result__metric">
                  <span className="label">Requested</span>
                  <span className="value">{countRequested}</span>
                </div>
              ) : null}
              {uniquePapers.length > 1 ? (
                <div className="quiz-result__metric">
                  <span className="label">Papers Mixed</span>
                  <span className="value">{uniquePapers.length}</span>
                </div>
              ) : null}
            </div>

            {paperBadges.length ? (
              <div className="quiz-result__papers">
                <span className="label">Papers Included</span>
                <div className="quiz-result__paper-tags">
                  {paperBadges.map((label) => (
                    <span key={label} className="quiz-result__paper-tag">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="quiz-result__details">
              {safeSummary.details.map((detail) => (
                <div
                  key={detail.id}
                  className={`quiz-result__item ${
                    detail.isCorrect
                      ? "quiz-result__item--correct"
                      : "quiz-result__item--incorrect"
                  }`}
                >
                  <div className="question-id">Q{detail.id}</div>
                  <div className="question-text">
                    <span className="label">Question</span>
                    <span className="value">
                      {detail.question || "(Question text unavailable)"}
                    </span>
                  </div>

                  <div className="answer-summary">
                    <div className="answer-summary__item answer-summary__item--user">
                      <span className="answer-summary__label">
                        Your Answer:
                      </span>
                      <span className="answer-summary__value">
                        {detail.picked || "Not answered"}
                      </span>
                    </div>
                    <div className="answer-summary__item answer-summary__item--correct">
                      <span className="answer-summary__label">
                        Correct Answer:
                      </span>
                      <span className="answer-summary__value">
                        {detail.correctAnswer}
                      </span>
                    </div>
                  </div>

                  <div className="answers-list">
                    <span className="label">Answers</span>
                    <ul>
                      {(detail.answers || []).map((ans, idx) => {
                        // Use a unique key based on value and index
                        let key =
                          typeof ans === "object"
                            ? JSON.stringify(ans) + idx
                            : String(ans) + idx;
                        // Support both string and object answers
                        let display = "";
                        if (typeof ans === "object" && ans !== null) {
                          if (
                            typeof ans.text === "string" &&
                            ans.text.length > 0
                          ) {
                            display = ans.text;
                          } else if (Array.isArray(ans.text)) {
                            display = ans.text
                              .filter((t) => typeof t === "string")
                              .join(" ");
                          } else if (ans.images && Array.isArray(ans.images)) {
                            display = "[Image Option]";
                          } else if (ans.type === "image" && ans.source) {
                            display = "[Image Option]";
                          } else {
                            display = "[Unsupported Option]";
                          }
                        } else if (
                          typeof ans === "string" ||
                          typeof ans === "number"
                        ) {
                          display = ans;
                        } else {
                          display = "[Unsupported Option]";
                        }
                        const isPicked =
                          ans === detail.picked ||
                          (typeof ans === "object" &&
                            ans.text === detail.picked);
                        const isCorrect =
                          ans === detail.correctAnswer ||
                          (typeof ans === "object" &&
                            ans.text === detail.correctAnswer);
                        return (
                          <li
                            key={key}
                            className={`answer-option${
                              isPicked ? " answer-option--picked" : ""
                            }${isCorrect ? " answer-option--correct" : ""}`}
                          >
                            <span>{display}</span>
                            {isPicked && (
                              <span className="badge badge--picked">
                                Your choice
                              </span>
                            )}
                            {isCorrect && (
                              <span className="badge badge--correct">
                                Correct
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-actions quiz-actions--end">
              <Link to={`/exams/${track}`}>
                <Button variant="primary">Retry Session</Button>
              </Link>
              <Link to="/exams">
                <Button variant="outline">Back to Exams</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default QuizResult;
