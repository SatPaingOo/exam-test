import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "src/components/common";
import { listTracks } from "src/services/examData";
import { useAuth } from "src/context/AuthContext";

const Home = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/member/dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  // Get dynamic exam categories from the data service
  const allExamCategories = listTracks().map((track) => ({
    id: track.id,
    title: track.name,
    subtitle: track.description,
    description: track.summary,
    questions: track.years.length > 0 ? 50 : 0, // Estimate based on available papers
    duration:
      track.level === "Beginner"
        ? "120 minutes"
        : track.level === "Intermediate"
        ? "150 minutes"
        : "180 minutes",
  }));

  // Show only first 6 exams on home page
  const examCategories = allExamCategories.slice(0, 3);
  const hasMoreExams = allExamCategories.length > 3;

  const features = [
    {
      icon: "📝",
      title: "Comprehensive Question Bank",
      description:
        "Access thousands of practice questions covering all exam topics.",
    },
    {
      icon: "⏱️",
      title: "Timed Practice Tests",
      description:
        "Simulate real exam conditions with timed practice sessions.",
    },
    {
      icon: "📊",
      title: "Detailed Analytics",
      description: "Track your progress and identify areas for improvement.",
    },
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "Get customized study plans based on your performance.",
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">
              Master Your{" "}
              <span className="hero__title-accent">Certification</span> Exams
            </h1>
            <p className="hero__description">
              Professional eLearning platform designed for adults preparing for
              certification exams. Practice, learn, and succeed with our
              comprehensive exam simulations.
            </p>
            <div className="hero__actions">
              <Link to="/register">
                <Button variant="primary" size="large">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/exams">
                <Button
                  variant="outline"
                  size="large"
                  style={{ color: "white" }}
                >
                  Browse Exams
                </Button>
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">10,000+</span>
                <span className="hero__stat-label">Practice Questions</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">5,000+</span>
                <span className="hero__stat-label">Active Learners</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">95%</span>
                <span className="hero__stat-label">Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories */}
      <section className="exams">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Exam</h2>
            <p className="section-description">
              Select from our range of certification exams and start practicing
              today.
            </p>
          </div>
          <div className="exams__grid">
            {examCategories.map((exam) => (
              <Card key={exam.id} className="exam-card" hover={true}>
                <h3 className="exam-card__title">{exam.title}</h3>
                <p className="exam-card__subtitle">{exam.subtitle}</p>
                <p className="exam-card__description">{exam.description}</p>
                <div className="exam-card__meta">
                  <div className="exam-card__meta-item">
                    <span className="exam-card__meta-label">Questions:</span>
                    <span className="exam-card__meta-value">
                      {exam.questions}
                    </span>
                  </div>
                  <div className="exam-card__meta-item">
                    <span className="exam-card__meta-label">Duration:</span>
                    <span className="exam-card__meta-value">
                      {exam.duration}
                    </span>
                  </div>
                </div>
                <Link to={`/exams/${exam.id}`}>
                  <Button variant="primary" fullWidth>
                    Start Practice
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          {hasMoreExams && (
            <div
              className="exams__view-all"
              style={{
                textAlign: "center",
                marginTop: "3rem",
                padding: "2rem 0",
              }}
            >
              <p
                style={{
                  marginBottom: "1rem",
                  color: "#666",
                  fontSize: "1.1rem",
                }}
              >
                Looking for more certification exams?
              </p>
              <Link to="/exams">
                <Button variant="primary" size="large">
                  View All Exams
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Platform?</h2>
            <p className="section-description">
              Everything you need to ace your certification exams.
            </p>
          </div>
          <div className="features__grid">
            {features.map((feature, index) => (
              <div key={index} className="feature">
                <div className="feature__icon">{feature.icon}</div>
                <h3 className="feature__title">{feature.title}</h3>
                <p className="feature__description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta__content">
            <h2 className="cta__title">Ready to Start Your Journey?</h2>
            <p className="cta__description">
              Join thousands of successful learners who have passed their IT
              certification exams with us.
            </p>
            <Link to="/register">
              <Button variant="primary" size="large">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
