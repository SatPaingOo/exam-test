import React, { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Layout from "src/components/layout/layout";
import routes from "src/routes/routes.jsx";
import "src/scss/main.scss";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <Router basename="/exam-test">
      <Layout>
        <Suspense
          fallback={
            <div className="loading-screen">
              <div className="container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
