import React from "react";
import { Card, Button } from "@/components/common";

const milestones = [
  {
    year: "2018",
    title: "Foundations",
    description:
      "We launched a lightweight quiz builder to help IT students track their progress between classes.",
  },
  {
    year: "2020",
    title: "Curriculum Expansion",
    description:
      "Added full ITPEC coverage with expert-written explanations, analytics, and personalized study plans.",
  },
  {
    year: "2024",
    title: "Team Growth",
    description:
      "Scaled our remote-first team to support localized content, accessibility audits, and rapid feature delivery.",
  },
];

const pillars = [
  {
    title: "Learner Obsession",
    description:
      "Every workflow is designed to reduce friction, celebrate wins, and surface insight when it matters most.",
  },
  {
    title: "Trusted Content",
    description:
      "We collaborate with certified professionals to keep question banks aligned with the latest certification objectives.",
  },
  {
    title: "Inclusive Design",
    description:
      "Accessibility is built in—from high-contrast themes to keyboard-first navigation and localized glossaries.",
  },
];

const About = () => {
  return (
    <div className="about-page">
      <section className="page-hero page-hero--subtle">
        <div className="container">
          <p className="page-hero__eyebrow">Our Story</p>
          <h1 className="page-hero__title">Built for Lifelong Learners</h1>
          <p className="page-hero__subtitle">
            Exam Test empowers professionals preparing for certification exams
            with curated content, actionable analytics, and an empathetic
            learning experience.
          </p>
        </div>
      </section>

      <section className="about-page__mission">
        <div className="container">
          <div className="about-page__mission-grid">
            <Card className="about-page__mission-card" hover={false}>
              <h2>Why We Exist</h2>
              <p>
                Certification journeys can feel overwhelming. We streamline the
                path by blending accurate exam simulations with coaching tools
                that adapt to each learner.
              </p>
              <p>
                Whether you have ten minutes or a full evening, our modular
                sessions help you stay consistent, confident, and connected to
                your goals.
              </p>
            </Card>
            <Card className="about-page__mission-card" hover={false}>
              <h2>What Sets Us Apart</h2>
              <ul>
                <li>Fresh question banks reviewed before every exam window.</li>
                <li>Progress dashboards that highlight strengths and gaps.</li>
                <li>
                  Peer community events and instructor-led review sprints.
                </li>
              </ul>
              <Button variant="primary" fullWidth>
                Explore the Platform
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="about-page__pillars">
        <div className="container">
          <h2 className="about-page__section-title">Our Guiding Principles</h2>
          <div className="about-page__pillars-grid">
            {pillars.map((pillar) => (
              <Card key={pillar.title} hover className="about-page__pillar">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page__timeline">
        <div className="container">
          <h2 className="about-page__section-title">Milestones</h2>
          <div className="about-page__timeline-grid">
            {milestones.map((milestone) => (
              <Card key={milestone.year} hover={false}>
                <span className="about-page__timeline-year">
                  {milestone.year}
                </span>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
