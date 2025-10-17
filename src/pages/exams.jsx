import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "@/components/common";
import { listTracks } from "@/services/examData";

const tracks = listTracks();

const ExamsList = () => {
  return (
    <div className="exams-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">Exam Library</p>
          <h1 className="page-hero__title">Start Your Practice Session</h1>
          <p className="page-hero__subtitle">
            Choose a track to access curated question banks that follow the
            latest ITPEC exam blueprints.
          </p>
        </div>
      </section>

      <section className="exam-list">
        <div className="container">
          <div className="exam-list__grid">
            {tracks.map((track) => (
              <Card key={track.id} className="exam-card" hover>
                <div className="exam-card__header">
                  <span className="exam-card__badge">{track.level}</span>
                  <h2 className="exam-card__title">{track.name}</h2>
                </div>
                <p className="exam-card__summary">{track.summary}</p>
                <div className="exam-card__meta">
                  {track.years.length > 0 ? (
                    <>
                      <span className="exam-card__label">Available Papers</span>
                      <ul className="exam-card__papers">
                        {track.years.map((paper) => (
                          <li key={paper.id}>{paper.name || paper.id}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <span className="exam-card__coming-soon">
                      {track.description ||
                        "Additional papers are in development."}
                    </span>
                  )}
                </div>
                <Link to={`/exams/${track.id}`} className="exam-card__cta">
                  <Button variant="primary" fullWidth>
                    Explore {track.name}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExamsList;
