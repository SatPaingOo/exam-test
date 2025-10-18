import React, { lazy } from "react";
import { ProtectedRoute } from "src/components/common";

// Use aliased absolute paths for consistency
const Home = lazy(() => import("src/pages/home"));
const NotFound = lazy(() => import("src/pages/404"));
const ServerError = lazy(() => import("src/pages/500"));
const AdminDashboard = lazy(() => import("src/pages/admin/dashboard"));
const AdminMembers = lazy(() => import("src/pages/admin/members"));
const AdminLogs = lazy(() => import("src/pages/admin/logs"));
const AdminSessions = lazy(() => import("src/pages/admin/sessions"));
const AdminSettings = lazy(() => import("src/pages/admin/settings"));
const MemberDashboard = lazy(() => import("src/pages/member/dashboard"));
const MemberHistory = lazy(() => import("src/pages/member/history"));
const ExamResultsDetail = lazy(() => import("src/pages/member/results"));
const ExamsList = lazy(() => import("src/pages/exams"));
const ExamSetup = lazy(() => import("src/pages/exams/exam"));
const QuizStart = lazy(() => import("src/pages/quiz/start"));
const QuizPlay = lazy(() => import("src/pages/quiz/play"));
const QuizResult = lazy(() => import("src/pages/quiz/result"));
const About = lazy(() => import("src/pages/about"));
const Contact = lazy(() => import("src/pages/contact"));
const FAQ = lazy(() => import("src/pages/faq"));
const Categories = lazy(() => import("src/pages/categories"));
const Login = lazy(() => import("src/pages/login"));
const Register = lazy(() => import("src/pages/register"));

const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/categories", element: <Categories /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // Exams
  { path: "/exams", element: <ExamsList /> },
  { path: "/exams/:track", element: <ExamSetup /> },
  // Quiz flow
  { path: "/quiz/start/:track/:paper", element: <QuizStart /> },
  { path: "/quiz/session/:sessionId", element: <QuizPlay /> },
  { path: "/result/:attemptId", element: <QuizResult /> },
  // Dashboards
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/members",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminMembers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/logs",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLogs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/sessions",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminSessions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/member/dashboard",
    element: (
      <ProtectedRoute>
        <MemberDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/member/history",
    element: (
      <ProtectedRoute>
        <MemberHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/member/results/:sessionId",
    element: (
      <ProtectedRoute>
        <ExamResultsDetail />
      </ProtectedRoute>
    ),
  },
  // Errors
  { path: "/500", element: <ServerError /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
