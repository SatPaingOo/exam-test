import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    logout();
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
          {isAuthenticated ? (
            <div className="header__user-dropdown" ref={dropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="header__user-btn"
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="true"
              >
                <span className="header__user-avatar">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
                <span className="header__user-name">{user?.username}</span>
                <span className="header__dropdown-arrow">
                  {isUserDropdownOpen ? "▲" : "▼"}
                </span>
              </button>
              {isUserDropdownOpen && (
                <div className="header__dropdown-menu">
                  <div className="header__dropdown-header">
                    <div className="header__user-info">
                      <strong>{user?.username}</strong>
                      <span className="header__user-role">
                        {user?.role === "admin" ? "Administrator" : "Member"}
                      </span>
                    </div>
                  </div>
                  <div className="header__dropdown-divider"></div>
                  <Link
                    to={
                      user?.role === "admin"
                        ? "/admin/dashboard"
                        : "/member/dashboard"
                    }
                    className="header__dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="header__dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    👤 Account Settings
                  </Link>
                  <div className="header__dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="header__dropdown-item header__dropdown-item--logout"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="header__btn header__btn--secondary">
                Login
              </Link>
              <Link to="/register" className="header__btn header__btn--primary">
                Get Started
              </Link>
            </>
          )}
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
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="header__btn header__btn--secondary"
              >
                Logout
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
