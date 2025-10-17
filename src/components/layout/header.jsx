import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header__content">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="header__logo-text">Exam</span>
          <span className="header__logo-accent">Test</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">
            Home
          </Link>
          <Link to="/exams" className="header__nav-link">
            Exams
          </Link>
          <Link to="/about" className="header__nav-link">
            About
          </Link>
          <Link to="/contact" className="header__nav-link">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="header__actions">
          <Link to="/login" className="header__btn header__btn--secondary">
            Login
          </Link>
          <Link to="/register" className="header__btn header__btn--primary">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="header__menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`header__menu-icon ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="header__mobile-menu">
          <Link to="/" className="header__mobile-link" onClick={toggleMenu}>
            Home
          </Link>
          <Link
            to="/exams"
            className="header__mobile-link"
            onClick={toggleMenu}
          >
            Exams
          </Link>
          <Link
            to="/admin/dashboard"
            className="header__mobile-link"
            onClick={toggleMenu}
          >
            Admin
          </Link>
          <Link
            to="/member/dashboard"
            className="header__mobile-link"
            onClick={toggleMenu}
          >
            Member
          </Link>
          <Link
            to="/about"
            className="header__mobile-link"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="header__mobile-link"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <div className="header__mobile-actions">
            <Link
              to="/login"
              className="header__btn header__btn--secondary"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="header__btn header__btn--primary"
              onClick={toggleMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
