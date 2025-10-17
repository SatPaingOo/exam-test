import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "@/components/common";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <section className="page-hero page-hero--subtle">
        <div className="container">
          <p className="page-hero__eyebrow">Error 500</p>
          <h1 className="page-hero__title">Server Error</h1>
          <p className="page-hero__subtitle">
            Something went wrong on our end. Our team has been notified and is
            working to fix it.
          </p>
        </div>
      </section>

      <section className="error-page__content">
        <div className="container">
          <Card hover={false} className="error-page__card">
            <div className="error-page__illustration" aria-hidden="true">
              ⚠️
            </div>
            <div className="error-page__details">
              <h2>What happened?</h2>
              <p>
                An unexpected error occurred while processing your request. This
                issue has been automatically logged and our technical team is
                investigating.
              </p>
              <h2>What you can do</h2>
              <ul>
                <li>Wait a few moments and refresh the page.</li>
                <li>Try clearing your browser cache and reloading.</li>
                <li>
                  If the problem persists, email{" "}
                  <a href="mailto:support@examtest.io">support@examtest.io</a>{" "}
                  with your track and attempt ID.
                </li>
                <li>Check our status page for ongoing incidents.</li>
              </ul>
            </div>
            <div className="error-page__actions">
              <Link to="/">
                <Button variant="primary">Return Home</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
