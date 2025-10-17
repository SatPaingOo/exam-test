import React, { lazy } from "react";

// Use aliased absolute paths for consistency
const Home = lazy(() => import("src/pages/home"));
const NotFound = lazy(() => import("src/pages/404"));
const ServerError = lazy(() => import("src/pages/500"));
// const AdminDashboard = lazy(() => import("src/pages/admin/dashboard"));
// const MemberDashboard = lazy(() => import("src/pages/member/dashboard"));
const ExamsList = lazy(() => import("src/pages/exams"));
const ExamSetup = lazy(() => import("src/pages/exams/exam"));
const QuizPlay = lazy(() => import("src/pages/quiz/play"));
const QuizResult = lazy(() => import("src/pages/quiz/result"));
const About = lazy(() => import("src/pages/about"));
const Contact = lazy(() => import("src/pages/contact"));
const FAQ = lazy(() => import("src/pages/faq"));
const Categories = lazy(() => import("src/pages/categories"));

const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/categories", element: <Categories /> },
  // Exams
  { path: "/exams", element: <ExamsList /> },
  { path: "/exams/:track", element: <ExamSetup /> },
  // Quiz flow
  { path: "/quiz/:track/:paper", element: <QuizPlay /> },
  { path: "/result/:attemptId", element: <QuizResult /> },
  // // Dashboards
  // { path: "/admin/dashboard", element: <AdminDashboard /> },
  // { path: "/member/dashboard", element: <MemberDashboard /> },
  // Errors
  { path: "/500", element: <ServerError /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
