import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper to check if path is active
  const isActive = (path) => {
    // For root, match exactly
    if (path === "/") return location.pathname === "/";
    // For others, match if pathname starts with path
    return location.pathname.startsWith(path);
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
          <Link
            to="/"
            className={`header__nav-link${isActive("/") ? " active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/categories"
            className={`header__nav-link${
              isActive("/categories") ? " active" : ""
            }`}
          >
            Categories
          </Link>
          <Link
            to="/exams"
            className={`header__nav-link${isActive("/exams") ? " active" : ""}`}
          >
            Exams
          </Link>
          <Link
            to="/about"
            className={`header__nav-link${isActive("/about") ? " active" : ""}`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`header__nav-link${
              isActive("/contact") ? " active" : ""
            }`}
          >
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
          <Link
            to="/"
            className={`header__mobile-link${isActive("/") ? " active" : ""}`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/categories"
            className={`header__mobile-link${
              isActive("/categories") ? " active" : ""
            }`}
            onClick={toggleMenu}
          >
            Categories
          </Link>
          <Link
            to="/exams"
            className={`header__mobile-link${
              isActive("/exams") ? " active" : ""
            }`}
            onClick={toggleMenu}
          >
            Exams
          </Link>
          <Link
            to="/contact"
            className={`header__mobile-link${
              isActive("/contact") ? " active" : ""
            }`}
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
