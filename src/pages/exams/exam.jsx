import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Button, Select, Input } from "@/components/common";
import { getTrack, listPaperOptions, getPaperLabel } from "@/services/examData";

const ExamSetup = () => {
  const { track } = useParams();
  const navigate = useNavigate();
  const [count, setCount] = useState(20);
  const [paper, setPaper] = useState("random");
  const [session, setSession] = useState("both");
  const [starting, setStarting] = useState(false);

  const trackConfig = useMemo(() => getTrack(track), [track]);
  const paperOptions = useMemo(() => listPaperOptions(track), [track]);
  const hasPapers = paperOptions.length > 0;

  const selectOptions = useMemo(() => {
    if (!hasPapers) return [];
    return [
      { value: "random", label: "Random (All available years)" },
      ...paperOptions.map((option) => ({
        value: option.id,
        label: option.label,
      })),
    ];
  }, [hasPapers, paperOptions]);

  useEffect(() => {
    if (!hasPapers) {
      setPaper("");
    } else if (!paper) {
      setPaper("random");
    }
  }, [hasPapers, paper]);

  if (!trackConfig) {
    return (
      <div className="exam-setup exam-setup--missing">
        <div className="container">
          <Card hover={false}>
            <h1>Unknown track: {track}</h1>
            <p>Please choose a valid exam track from the library.</p>
            <div className="form-actions">
              <Link to="/exams" className="form-actions__link">
                <Button variant="primary">Back to Exams</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const startQuiz = () => {
    if (
      starting ||
      !hasPapers ||
      count === "" ||
      !Number.isFinite(Number(count))
    )
      return;
    setStarting(true);
    const selected = paper || "random";
    const params = new URLSearchParams({ count: count.toString() });
    if (session !== "both") {
      params.set("session", session);
    }
    navigate(`/quiz/start/${track}/${selected}?${params.toString()}`);
  };

  const handleCountChange = (value) => {
    // Accept empty string for controlled input
    if (value === "") {
      setCount("");
      return;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 1) {
      setCount(1);
      return;
    }
    setCount(Math.min(100, Math.floor(numeric)));
  };

  return (
    <div className="exam-setup">
      <section className="page-hero page-hero--subtle">
        <div className="container">
          <div className="page-hero__category">
            <span className="category-badge category-badge--{track}">
              {trackConfig?.level || "EXAM"}
            </span>
          </div>
          <p className="page-hero__eyebrow">Practice Settings</p>
          <h1 className="page-hero__title">
            {trackConfig?.name || track?.toUpperCase()} Session
          </h1>
          <p className="page-hero__subtitle">
            Tailor the session length and paper so your practice mirrors the
            real exam pacing.
          </p>
        </div>
      </section>

      <section className="exam-setup__content">
        <div className="container">
          <div className="exam-setup__grid">
            <Card className="exam-setup__card" hover={false}>
              <div className="exam-setup__form">
                <Select
                  label="Paper"
                  name="paper"
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  options={selectOptions}
                  placeholder={
                    hasPapers
                      ? "Choose a specific year or stay on random"
                      : "No papers available"
                  }
                  disabled={!hasPapers}
                />

                {(track === "fe" || track === "ap") && (
                  <Select
                    label="Session"
                    name="session"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    options={[
                      { value: "both", label: "Both Sessions" },
                      { value: "morning", label: "Morning Only" },
                      { value: "afternoon", label: "Afternoon Only" },
                    ]}
                  />
                )}

                <Input
                  label="Question Count"
                  type="number"
                  name="count"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => handleCountChange(e.target.value)}
                  onBlur={(e) => handleCountChange(e.target.value)}
                />
                <p className="exam-setup__helper">
                  We will sample unique questions from the selected paper.
                </p>

                <div className="form-actions">
                  <Button
                    variant="primary"
                    onClick={startQuiz}
                    disabled={!hasPapers || starting}
                  >
                    {starting ? "Starting..." : "Start Practice"}
                  </Button>
                  <Link to="/exams" className="form-actions__link">
                    <Button variant="outline">Back to Exams</Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="exam-setup__summary" hover={false}>
              <div className="exam-setup__summary-header">
                <h2>Session Overview</h2>
                <p>
                  Focus on accuracy and pacing. Each attempt stores your results
                  locally so you can review progress later.
                </p>
              </div>
              <ul className="exam-setup__summary-list">
                <li>
                  <span className="label">Mode</span>
                  <span className="value">
                    Timed practice without penalties
                  </span>
                </li>
                <li>
                  <span className="label">Paper</span>
                  <span className="value">
                    {paper
                      ? getPaperLabel(track, paper, paperOptions)
                      : hasPapers
                      ? "Select a paper"
                      : "—"}
                  </span>
                </li>
                <li>
                  <span className="label">Questions</span>
                  <span className="value">{count}</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExamSetup;
