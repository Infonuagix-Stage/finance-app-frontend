import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import {
  FiMenu,
  FiX,
  FiHome,
  FiGrid,
  FiPieChart,
  FiFolder,
  FiCreditCard,
  FiInfo,
} from "react-icons/fi";
import "./Navbar.css";

interface NavbarProps {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsDropdownOpen }) => {
  const { t } = useTranslation("general");
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link
          to="/home"
          className="navbar-logo"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Budget<span>ly</span>
        </Link>

        {/* Menu desktop */}
        <div className="navbar-links">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="navbar-link">
                {t("dashboard")}
              </Link>
              <Link to="/budgeting" className="navbar-link">
                {t("budget")}
              </Link>
              <Link to="/project" className="navbar-link">
                {t("projects")}
              </Link>
              <Link to="/payment" className="navbar-link">
                {t("payments")}
              </Link>
            </>
          )}
          <Link to="/about" className="navbar-link">
            {t("about")}
          </Link>
        </div>
        {/* Zone de droite */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-button"
              aria-label="Toggle Menu"
              >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(prev => !prev);
                  setIsMobileMenuOpen(false);
                }}
                className="profile-image"
              >
                <img
                  src={user?.picture || "https://via.placeholder.com/40"}
                  alt="Profile"
                />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  loginWithRedirect();
                  setIsMobileMenuOpen(false);
                }}
                className="auth-button secondary"
              >
                {t("login")}
              </button>
              <button
                onClick={() => {
                  loginWithRedirect({ screen_hint: "signup" } as any);
                  setIsMobileMenuOpen(false);
                }}
                className="auth-button primary"
              >
                {t("signup")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>
            <FiHome /> {t("home")}
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={toggleMobileMenu}>
                <FiGrid /> {t("dashboard")}
              </Link>
              <Link to="/budgeting" className="mobile-link" onClick={toggleMobileMenu}>
                <FiPieChart /> {t("budget")}
              </Link>
              <Link to="/project" className="mobile-link" onClick={toggleMobileMenu}>
                <FiFolder /> {t("projects")}
              </Link>
              <Link to="/payment" className="mobile-link" onClick={toggleMobileMenu}>
                <FiCreditCard /> {t("payments")}
              </Link>
            </>
          )}
          <Link to="/about" className="mobile-link" onClick={toggleMobileMenu}>
            <FiInfo /> {t("about")}
          </Link>

          {!isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  loginWithRedirect();
                  toggleMobileMenu();
                }}
                className="auth-button secondary"
              >
                {t("login")}
              </button>
              <button
                onClick={() => {
                  loginWithRedirect({ screen_hint: "signup" } as any);
                  toggleMobileMenu();
                }}
                className="auth-button primary"
              >
                {t("signup")}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                logout({ logoutParams: { returnTo: window.location.origin } });
                toggleMobileMenu();
              }}
              className="auth-button primary"
            >
              {t("logout")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
