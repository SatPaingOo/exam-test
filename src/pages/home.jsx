import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "src/components/common";

const Home = () => {
  const examCategories = [
    {
      id: "ip",
      title: "ITPEC IP",
      subtitle: "Information Technology Passport",
      description:
        "Entry-level certification covering fundamental IT knowledge and skills.",
      questions: 100,
      duration: "120 minutes",
    },
    {
      id: "fe",
      title: "ITPEC FE",
      subtitle: "Fundamental Information Technology Engineer",
      description: "Intermediate-level certification for IT professionals.",
      questions: 80,
      duration: "150 minutes",
    },
    {
      id: "ap",
      title: "ITPEC AP",
      subtitle: "Applied Information Technology Engineer",
      description: "Advanced certification for experienced IT engineers.",
      questions: 60,
      duration: "180 minutes",
    },
  ];

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
              <span className="hero__title-accent">IT Certification</span> Exams
            </h1>
            <p className="hero__description">
              Professional eLearning platform designed for adults preparing for
              ITPEC certification exams. Practice, learn, and succeed with our
              comprehensive exam simulations.
            </p>
            <div className="hero__actions">
              <Link to="/register">
                <Button variant="primary" size="large">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/exams">
                <Button variant="outline" size="large">
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
              Select from our range of ITPEC certification exams and start
              practicing today.
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
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Platform?</h2>
            <p className="section-description">
              Everything you need to ace your IT certification exams.
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
