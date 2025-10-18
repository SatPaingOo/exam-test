import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getTrack, resolveQuestions } from "@/services/examData";
import { supabase } from "@/services/supabase";
import { getUuid } from "@/services/localStorage";
import { logError, logSuccess } from "@/utils/logger";
import { useAuth } from "@/context/AuthContext";

function generateUniqueCode() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function sample(array, n) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const QuizStart = () => {
  const { track, paper } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hasStarted = useRef(false);
  const { user } = useAuth();

  const count = Math.max(
    1,
    Math.min(100, parseInt(params.get("count") || "20", 10))
  );
  const session = params.get("session") || "both";

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startQuiz = async () => {
      const trackConfig = getTrack(track);
      if (!trackConfig) {
        navigate("/exams");
        return;
      }

      try {
        const { questions: data } = await resolveQuestions(track, paper);
        let items = Array.isArray(data) ? data : [];
        if (session !== "both") {
          items = items.filter((q) => q.session === session);
        }
        const limit = Math.min(count, items.length || count);
        const subset = sample(items, limit);

        // Save to DB
        const uuid = getUuid();
        const code = generateUniqueCode();
        const sessionData = {
          code,
          uuid,
          user_id: user?.id,
          track,
          paper,
          finished: false,
          questions: subset,
          answers: {},
        };
        const { data: inserted, error } = await supabase
          .from("quiz_sessions")
          .insert([sessionData])
          .select("id")
          .single();
        if (error) {
          logError("Error creating quiz session", { error: error.message });
          navigate("/exams");
        } else {
          logSuccess("Quiz session created", { sessionId: inserted.id });
          navigate(`/quiz/session/${code}`);
        }
      } catch (error) {
        logError("Error starting quiz", { error: error.message });
        navigate("/exams");
      }
    };

    startQuiz();
  }, [track, paper, count, session]);

  return (
    <div className="quiz-start">
      <div className="container">
        <p>Starting quiz...</p>
      </div>
    </div>
  );
};

export default QuizStart;
