import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "src/components/common";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/services/supabase";

const MemberDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    examsCompleted: 0,
    totalQuestions: 0,
    averageScore: 0,
    studyTime: 0,
  });
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [user]);

  const fetchMemberData = async () => {
    try {
      // Fetch quiz sessions for this user using user_id
      const { data: sessions, error: sessionsError } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (sessionsError) throw sessionsError;

      // Calculate stats
      const completedSessions =
        sessions?.filter((session) => session.finished) || [];
      const totalQuestions = completedSessions.reduce((sum, session) => {
        return sum + (session.questions?.length || 0);
      }, 0);

      const totalScore = completedSessions.reduce((sum, session) => {
        const summary = session.summary;
        if (
          summary &&
          summary.correct !== undefined &&
          summary.total !== undefined
        ) {
          return sum + (summary.correct / summary.total) * 100;
        }
        return sum;
      }, 0);

      const averageScore =
        completedSessions.length > 0
          ? totalScore / completedSessions.length
          : 0;
      const totalTime = completedSessions.reduce(
        (sum, session) => sum + (session.time_spent || 0),
        0
      );

      setStats({
        examsCompleted: completedSessions.length,
        totalQuestions: totalQuestions,
        averageScore: Math.round(averageScore),
        studyTime: Math.round(totalTime / 60), // Convert to minutes
      });

      // Get recent exams (last 3 completed sessions)
      const recentSessions = completedSessions.slice(0, 3).map((session) => {
        const summary = session.summary;
        const score = summary
          ? Math.round((summary.correct / summary.total) * 100)
          : 0;
        const status = score >= 70 ? "Passed" : "Failed"; // Assuming 70% pass rate

        return {
          name: `${session.track.toUpperCase()} ${session.paper.toUpperCase()}`,
          date: formatDate(session.created_at),
          score: `${score}%`,
          status: status,
          questions: summary ? `${summary.correct}/${summary.total}` : "0/0",
        };
      });

      setRecentExams(recentSessions);
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const userStats = [
    {
      title: "Exams Completed",
      value: stats.examsCompleted.toString(),
      icon: "📝",
    },
    {
      title: "Total Questions",
      value: stats.totalQuestions.toString(),
      icon: "❓",
    },
    { title: "Average Score", value: `${stats.averageScore}%`, icon: "📊" },
    { title: "Study Time", value: `${stats.studyTime}m`, icon: "⏱️" },
  ];

  const recommendedExams = [
    { id: "ip", name: "ITPEC IP", level: "Beginner", duration: "120 min" },
    { id: "fe", name: "ITPEC FE", level: "Intermediate", duration: "150 min" },
    { id: "ap", name: "ITPEC AP", level: "Advanced", duration: "180 min" },
  ];

  return (
    <div className="member-dashboard">
      <div className="container">
        <div className="member-dashboard__header">
          <h1 className="member-dashboard__title">
            Welcome back, {user?.full_name || user?.username}!
          </h1>
          <p className="member-dashboard__subtitle">
            Track your progress and continue your learning journey
          </p>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="member-dashboard__stats">
              {userStats.map((stat, index) => (
                <Card key={index} className="stat-card">
                  <div className="stat-card__icon">{stat.icon}</div>
                  <div className="stat-card__content">
                    <h3 className="stat-card__title">{stat.title}</h3>
                    <div className="stat-card__value">{stat.value}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Exams */}
            <div className="member-dashboard__section">
              <h2 className="member-dashboard__section-title">
                Recent Exam Results
              </h2>
              <Card>
                <div className="exam-history">
                  {recentExams.map((exam, index) => (
                    <div key={index} className="exam-history__item">
                      <div className="exam-history__info">
                        <h4 className="exam-history__name">{exam.name}</h4>
                        <p className="exam-history__meta">
                          {exam.questions} questions • {exam.date}
                        </p>
                      </div>
                      <div className="exam-history__result">
                        <span className="exam-history__score">
                          {exam.score}
                        </span>
                        <span
                          className={`exam-history__status exam-history__status--${exam.status.toLowerCase()}`}
                        >
                          {exam.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="exam-history__footer">
                  <Link to="/member/history">
                    <Button variant="secondary" size="medium">
                      View All Results
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Recommended Exams */}
            <div className="member-dashboard__section">
              <h2 className="member-dashboard__section-title">
                Continue Learning
              </h2>
              <div className="recommended-exams">
                {recommendedExams.map((exam) => (
                  <Card key={exam.id} className="recommended-exam" hover>
                    <h3 className="recommended-exam__name">{exam.name}</h3>
                    <div className="recommended-exam__meta">
                      <span className="recommended-exam__level">
                        {exam.level}
                      </span>
                      <span className="recommended-exam__duration">
                        {exam.duration}
                      </span>
                    </div>
                    <Link to={`/exams/${exam.id}`}>
                      <Button variant="primary" size="medium" fullWidth>
                        Start Practice
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
