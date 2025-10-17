import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button } from "@/components/common";

const QuizResult = () => {
  const { attemptId } = useParams();
  const attempt = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(attemptId);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }, [attemptId]);

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
  const paperLookup = useMemo(
    () => new Map(paperOptions.map((option) => [option.id, option.label])),
    [paperOptions]
  );
  const paperBadges = uniquePapers.map((id) => paperLookup.get(id) || id);

  return (
    <div className="quiz-result">
      <section className="page-hero">
        <div className="container">
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
                  <div className="answer">
                    <span className="label">Your answer</span>
                    <span className="value">{detail.picked || "—"}</span>
                  </div>
                  <div className="answer">
                    <span className="label">Correct</span>
                    <span className="value">{detail.correctAnswer}</span>
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
