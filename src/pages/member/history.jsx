import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "src/components/common";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/services/supabase";

const MemberHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, completed, in-progress

  useEffect(() => {
    if (user) {
      fetchExamHistory();
    }
  }, [user, filter]);

  const fetchExamHistory = async () => {
    try {
      let query = supabase
        .from("quiz_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Apply filter
      if (filter === "completed") {
        query = query.eq("finished", true);
      } else if (filter === "in-progress") {
        query = query.eq("finished", false);
      }

      const { data, error } = await query;
      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching exam history:", error);
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

  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  const handleViewDetails = (session) => {
    navigate(`/member/results/${session.code}`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "score--excellent";
    if (score >= 70) return "score--good";
    if (score >= 60) return "score--average";
    return "score--poor";
  };

  const getStatusBadge = (session) => {
    if (!session.finished) {
      return (
        <span className="status-badge status-badge--in-progress">
          In Progress
        </span>
      );
    }

    const summary = session.summary;
    if (!summary || !summary.correct || !summary.total) {
      return (
        <span className="status-badge status-badge--unknown">Unknown</span>
      );
    }

    const score = Math.round((summary.correct / summary.total) * 100);
    const status = score >= 70 ? "Passed" : "Failed";
    const statusClass =
      status === "Passed" ? "status-badge--passed" : "status-badge--failed";

    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="member-history">
        <div className="container">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading your exam history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="member-history">
      <div className="container">
        <div className="member-history__header">
          <h1 className="member-history__title">Exam History</h1>
          <p className="member-history__subtitle">
            View all your past exam attempts and results
          </p>
          <div className="member-history__actions">
            <Button
              variant="primary"
              onClick={() => navigate("/member/dashboard")}
              size="small"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        <div className="member-history__filters">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Exams ({sessions.length})
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed ({sessions.filter((s) => s.finished).length})
            </button>
            <button
              className={`filter-btn ${
                filter === "in-progress" ? "active" : ""
              }`}
              onClick={() => setFilter("in-progress")}
            >
              In Progress ({sessions.filter((s) => !s.finished).length})
            </button>
          </div>
        </div>

        <Card className="member-history__card">
          {sessions.length === 0 ? (
            <div className="member-history__empty">
              <h3>No exam history found</h3>
              <p>
                You haven't taken any exams yet. Start your first practice exam!
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/exams")}
              >
                Browse Exams
              </Button>
            </div>
          ) : (
            <div className="exam-sessions">
              {sessions.map((session) => {
                const summary = session.summary;
                const score =
                  summary && summary.correct && summary.total
                    ? Math.round((summary.correct / summary.total) * 100)
                    : null;

                return (
                  <div key={session.id} className="exam-session">
                    <div className="exam-session__header">
                      <div className="exam-session__info">
                        <h3 className="exam-session__title">
                          {session.track.toUpperCase()}{" "}
                          {session.paper.toUpperCase()}
                        </h3>
                        <p className="exam-session__date">
                          {formatDate(session.created_at)}
                        </p>
                      </div>
                      <div className="exam-session__status">
                        {getStatusBadge(session)}
                      </div>
                    </div>

                    <div className="exam-session__details">
                      {session.finished && summary ? (
                        <div className="exam-session__stats">
                          <div className="stat-item">
                            <span className="stat-label">Score:</span>
                            <span
                              className={`stat-value score ${getScoreColor(
                                score
                              )}`}
                            >
                              {score}%
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Questions:</span>
                            <span className="stat-value">
                              {summary.correct}/{summary.total}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Time:</span>
                            <span className="stat-value">
                              {formatDuration(session.time_spent)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="exam-session__progress">
                          <p className="exam-session__progress-text">
                            Exam in progress -{" "}
                            {Object.keys(session.answers || {}).length}{" "}
                            questions answered
                          </p>
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() =>
                              navigate(`/quiz/session/${session.code}`)
                            }
                          >
                            Continue Exam
                          </Button>
                        </div>
                      )}
                      {session.finished && (
                        <div className="exam-session__actions">
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleViewDetails(session)}
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MemberHistory;
