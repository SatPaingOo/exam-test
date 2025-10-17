import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "../../components/common";

const MemberDashboard = () => {
  const userStats = [
    { title: "Exams Completed", value: "12", icon: "📝" },
    { title: "Total Questions", value: "1,200", icon: "❓" },
    { title: "Average Score", value: "85%", icon: "📊" },
    { title: "Study Time", value: "24h", icon: "⏱️" },
  ];

  const recentExams = [
    {
      name: "ITPEC IP",
      date: "2 days ago",
      score: "90%",
      status: "Passed",
      questions: "100/100",
    },
    {
      name: "ITPEC FE",
      date: "5 days ago",
      score: "82%",
      status: "Passed",
      questions: "80/80",
    },
    {
      name: "ITPEC IP",
      date: "1 week ago",
      score: "78%",
      status: "Passed",
      questions: "100/100",
    },
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
          <h1 className="member-dashboard__title">My Dashboard</h1>
          <p className="member-dashboard__subtitle">
            Track your progress and continue your learning journey
          </p>
        </div>

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
                    <span className="exam-history__score">{exam.score}</span>
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
          <h2 className="member-dashboard__section-title">Continue Learning</h2>
          <div className="recommended-exams">
            {recommendedExams.map((exam) => (
              <Card key={exam.id} className="recommended-exam" hover>
                <h3 className="recommended-exam__name">{exam.name}</h3>
                <div className="recommended-exam__meta">
                  <span className="recommended-exam__level">{exam.level}</span>
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
      </div>
    </div>
  );
};

export default MemberDashboard;
