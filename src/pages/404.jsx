import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "@/components/common";

const suggestionLinks = [
  { label: "Go Home", to: "/", variant: "primary" },
  { label: "Browse Exams", to: "/exams", variant: "outline" },
  { label: "Visit About", to: "/about", variant: "outline" },
];

const NotFound = () => {
  return (
    <div className="error-page">
      <section className="page-hero page-hero--subtle">
        <div className="container">
          <p className="page-hero__eyebrow">Error 404</p>
          <h1 className="page-hero__title">Page Not Found</h1>
          <p className="page-hero__subtitle">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
      </section>

      <section className="error-page__content">
        <div className="container">
          <Card hover={false} className="error-page__card">
            <div className="error-page__illustration" aria-hidden="true">
              🔍
            </div>
            <div className="error-page__details">
              <h2>What happened?</h2>
              <p>
                The link you followed may be broken, or the page may have been
                removed. Double-check the URL for typos, or use the navigation
                menu to find what you need.
              </p>
              <h2>What you can do</h2>
              <ul>
                <li>Verify the URL is correct and try again.</li>
                <li>Use the header navigation to explore major sections.</li>
                <li>Return to the home page and start fresh.</li>
                <li>
                  <Link to="/contact">Contact us</Link> if you believe this is
                  an error.
                </li>
              </ul>
            </div>
            <div className="error-page__actions">
              {suggestionLinks.map((action) => (
                <Link key={action.to} to={action.to}>
                  <Button variant={action.variant}>{action.label}</Button>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
