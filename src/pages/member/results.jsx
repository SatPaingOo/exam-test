import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "src/components/common";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/services/supabase";

const ExamResultsDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && sessionId) {
      fetchSessionDetails();
    }
  }, [user, sessionId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("code", sessionId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (!data) {
        setError("Exam session not found");
        return;
      }

      setSession(data);
    } catch (err) {
      console.error("Error fetching session details:", err);
      setError("Failed to load exam results");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatDateParts = (dateString) => {
    if (!dateString) return { date: "", time: "" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "score--excellent";
    if (score >= 70) return "score--good";
    if (score >= 60) return "score--average";
    return "score--poor";
  };

  const getQuestionResult = (question, userAnswerId, questionIndex) => {
    try {
      // Get correct answer ID (should be like "a", "b", "c", "d")
      // Try different possible field names for correct answer
      const correctAnswerId =
        question.answer || question.correct_answer || question.correctAnswer;

      // Handle user answer ID - try both object access and array access
      let processedUserAnswerId = userAnswerId;

      // If userAnswerId is still null, try accessing by index as fallback
      if (!processedUserAnswerId && session.answers) {
        if (Array.isArray(session.answers)) {
          processedUserAnswerId = session.answers[questionIndex];
        }
      }

      const isCorrect =
        processedUserAnswerId &&
        correctAnswerId &&
        processedUserAnswerId === correctAnswerId;

      // Handle question text - it might be an object with text property or a string
      const questionText =
        typeof question.question === "object" && question.question.text
          ? question.question.text
          : question.question || "Question text not available";

      // Handle explanation - it might be an object with text property or a string
      const explanationText = question.explanation
        ? typeof question.explanation === "object" && question.explanation.text
          ? question.explanation.text
          : question.explanation
        : null;

      // Process options to ensure they have proper structure
      const processedOptions = (question.options || []).map((option) => {
        if (typeof option === "object" && option.id && option.text) {
          return option;
        } else if (typeof option === "string") {
          // If option is just a string, create an object structure
          return { id: option.charAt(0).toLowerCase(), text: option };
        }
        return option;
      });

      return {
        questionNumber: questionIndex + 1,
        question: questionText,
        userAnswerId: processedUserAnswerId,
        correctAnswerId: correctAnswerId,
        isCorrect: isCorrect,
        options: processedOptions,
        explanation: explanationText,
      };
    } catch (error) {
      console.error("Error processing question result:", error, question);
      return {
        questionNumber: questionIndex + 1,
        question: "Error loading question",
        userAnswerId: null,
        correctAnswerId: null,
        isCorrect: false,
        options: [],
        explanation: "Error loading explanation",
      };
    }
  };

  if (loading) {
    return (
      <div className="exam-results-detail">
        <div className="container">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading exam results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="exam-results-detail">
        <div className="container">
          <Card className="error-card">
            <h2>Exam Results Not Found</h2>
            <p>{error || "The requested exam results could not be found."}</p>
            <Button
              variant="primary"
              onClick={() => navigate("/member/history")}
            >
              Back to History
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const summary = session.summary;
  const score =
    summary && summary.correct && summary.total
      ? Math.round((summary.correct / summary.total) * 100)
      : null;

  const grade = score !== null ? (score >= 70 ? "Passed" : "Failed") : null;
  const gradeClass =
    grade === "Passed" ? "status-badge--passed" : "status-badge--failed";

  const completedDateParts = formatDateParts(session.created_at);

  return (
    <div className="exam-results-detail">
      <div className="container">
        {/* Header */}
        <div className="exam-results-detail__header">
          <Button
            variant="secondary"
            onClick={() => navigate("/member/history")}
            className="back-button"
          >
            ← Back to History
          </Button>
          <div className="exam-results-detail__title">
            <h1>Exam Results</h1>
            <p className="exam-results-detail__subtitle">
              {session.track.toUpperCase()} {session.paper.toUpperCase()}
            </p>
          </div>
          <div className="exam-results-detail__actions">
            {grade && (
              <span className={`status-badge ${gradeClass}`}>{grade}</span>
            )}
            <Button
              variant="primary"
              onClick={() => navigate("/member/dashboard")}
              size="small"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="exam-results-detail__summary">
          <div className="exam-summary">
            <div className="exam-summary__stats">
              <div className="summary-stat">
                <span className="summary-stat__label">Final Score:</span>
                <span
                  className={`summary-stat__value ${
                    score !== null ? getScoreColor(score) : ""
                  }`}
                >
                  {score !== null ? `${score}%` : "N/A"}
                </span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__label">Questions:</span>
                <span className="summary-stat__value">
                  {summary ? `${summary.correct}/${summary.total}` : "N/A"}
                </span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__label">Time Spent:</span>
                <span className="summary-stat__value">
                  {formatDuration(session.time_spent)}
                </span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__label">Completed:</span>
                <span className="summary-stat__value summary-stat__value--multiline">
                  <span className="completed-date">
                    {completedDateParts.date}
                  </span>
                  <span className="completed-time">
                    {completedDateParts.time}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Questions Section */}
        <Card className="exam-results-detail__questions">
          <h2>Question Details</h2>
          {session.questions &&
          Array.isArray(session.questions) &&
          session.questions.length > 0 ? (
            <div className="question-results">
              {session.questions.map((question, index) => {
                // Get user's answer by question ID
                const userAnswerId = session.answers
                  ? session.answers[question.id]
                  : null;
                const result = getQuestionResult(question, userAnswerId, index);

                return (
                  <div
                    key={question.id || index}
                    className={`question-result ${
                      result.isCorrect
                        ? "question-result--correct"
                        : "question-result--incorrect"
                    }`}
                  >
                    <div className="question-result__header">
                      <span className="question-result__number">
                        Question {result.questionNumber}
                      </span>
                      <span
                        className={`question-result__status ${
                          result.isCorrect
                            ? "status--correct"
                            : "status--incorrect"
                        }`}
                      >
                        {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <div className="question-result__content">
                      <p className="question-result__question">
                        {result.question}
                      </p>

                      {result.options && result.options.length > 0 ? (
                        <div className="question-result__options">
                          <h4>Options:</h4>
                          <div className="options-list">
                            {result.options.map((option) => {
                              const optionText =
                                typeof option === "object" && option.text
                                  ? option.text
                                  : option;
                              const optionId =
                                typeof option === "object" && option.id
                                  ? option.id
                                  : typeof option === "string"
                                  ? option.charAt(0).toLowerCase()
                                  : "";

                              const isUserAnswer =
                                optionId === result.userAnswerId;
                              const isCorrectAnswer =
                                optionId === result.correctAnswerId;

                              let optionClass = "option";
                              if (isCorrectAnswer) {
                                optionClass += " option--correct";
                              } else if (isUserAnswer && !result.isCorrect) {
                                optionClass += " option--incorrect";
                              }

                              return (
                                <div key={optionId} className={optionClass}>
                                  <span className="option-label">
                                    {optionId.toUpperCase()}.
                                  </span>
                                  <span className="option-text">
                                    {optionText}
                                  </span>
                                  {isUserAnswer && (
                                    <span className="option-indicator">
                                      (Your Answer)
                                    </span>
                                  )}
                                  {isCorrectAnswer && !isUserAnswer && (
                                    <span className="option-indicator">
                                      (Correct)
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="question-result__options">
                          <h4>Answer:</h4>
                          <div className="answer-summary">
                            {result.userAnswerId ? (
                              <p
                                className={`answer ${
                                  result.isCorrect
                                    ? "answer--correct"
                                    : "answer--incorrect"
                                }`}
                              >
                                Your Answer: {result.userAnswerId.toUpperCase()}
                              </p>
                            ) : (
                              <p className="answer answer--not-answered">
                                Your Answer: Not answered
                              </p>
                            )}
                            {result.correctAnswerId && (
                              <p className="answer answer--correct">
                                Correct Answer:{" "}
                                {result.correctAnswerId.toUpperCase()}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {result.explanation && (
                        <div className="question-result__explanation">
                          <h4>Explanation:</h4>
                          <p>{result.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-questions">
              No question details available for this exam.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ExamResultsDetail;
