import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Button } from "@/components/common";
import { listTracks } from "@/services/examData";
import dummyData from "@/assets/data/dummy.json";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(params.entries());
  }, [search]);
}

const ExamsList = () => {
  const query = useQuery();
  const tracks = listTracks();
  let filteredTracks = tracks;
  if (query.category) {
    filteredTracks = tracks.filter((track) => {
      const exam = dummyData.exams.find((e) => e.id === track.examId);
      return exam && exam.categoryId === query.category;
    });
  }
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
            {filteredTracks.map((track) => (
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
