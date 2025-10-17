import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* About Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <span className="footer__logo-text">Exam</span>
              <span className="footer__logo-accent">Test</span>
            </h3>
            <p className="footer__description">
              Professional eLearning platform for IT certification exam
              preparation. Practice, learn, and succeed with our comprehensive
              exam simulations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__heading">Quick Links</h4>
            <nav className="footer__nav">
              <Link to="/" className="footer__link">
                Home
              </Link>
              <Link to="/exams" className="footer__link">
                Exams
              </Link>
              <Link to="/about" className="footer__link">
                About Us
              </Link>
              <Link to="/contact" className="footer__link">
                Contact
              </Link>
            </nav>
          </div>

          {/* Exam Categories */}
          <div className="footer__section">
            <h4 className="footer__heading">Exam Categories</h4>
            <nav className="footer__nav">
              <Link to="/exams/itpec/ip" className="footer__link">
                ITPEC IP
              </Link>
              <Link to="/exams/itpec/fe" className="footer__link">
                ITPEC FE
              </Link>
              <Link to="/exams/itpec/ap" className="footer__link">
                ITPEC AP
              </Link>
              <Link to="/exams" className="footer__link">
                View All
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="footer__section">
            <h4 className="footer__heading">Support</h4>
            <nav className="footer__nav">
              <Link to="/faq" className="footer__link">
                FAQ
              </Link>
              <Link to="/help" className="footer__link">
                Help Center
              </Link>
              <Link to="/privacy" className="footer__link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer__link">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Exam Test. All rights reserved.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <span aria-hidden="true">Fb</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="X">
              <span aria-hidden="true">X</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <span aria-hidden="true">In</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="GitHub">
              <span aria-hidden="true">Gh</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
