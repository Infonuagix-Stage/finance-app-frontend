import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import "./Navbar.css"; // Import CSS file

interface NavbarProps {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsDropdownOpen }) => {
  const { t } = useTranslation();
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => setIsMobileMenuOpen((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Finance<span>App</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">{t("home")}</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="navbar-link">{t("dashboard")}</Link>
              <Link to="/budgeting" className="navbar-link">{t("budget")}</Link>
              <Link to="/project" className="navbar-link">{t("projects")}</Link>
              <Link to="/payment" className="navbar-link">{t("payments")}</Link>
            </>
          )}
          <Link to="/about" className="navbar-link">{t("about")}</Link>
        </div>

        {/* Right side: Auth */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="navbar-link">{t("welcome")}, {user?.name || user?.nickname}!</span>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="profile-image"
              >
                <img
                  src={user?.picture || "https://via.placeholder.com/40"}
                  alt="Profile"
                />
              </button>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="auth-button primary"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => loginWithRedirect()}
                className="auth-button secondary"
              >
                {t("login")}
              </button>
              <button
                onClick={() => loginWithRedirect({ screen_hint: "signup" } as any)}
                className="auth-button primary"
              >
                {t("signup")}
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="mobile-menu-button">
            {isMobileMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>{t("dashboard")}</Link>
              <Link to="/budgeting" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>{t("budget")}</Link>
              <Link to="/project" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>{t("projects")}</Link>
              <Link to="/payment" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>{t("payments")}</Link>
            </>
          )}
          <Link to="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>{t("about")}</Link>
          {!isAuthenticated ? (
            <>
              <button onClick={() => { loginWithRedirect(); setIsMobileMenuOpen(false); }} className="auth-button secondary">{t("login")}</button>
              <button onClick={() => { loginWithRedirect({ screen_hint: "signup" } as any); setIsMobileMenuOpen(false); }} className="auth-button primary">{t("signup")}</button>
            </>
          ) : (
            <button onClick={() => { logout({ logoutParams: { returnTo: window.location.origin } }); setIsMobileMenuOpen(false); }} className="auth-button primary">{t("logout")}</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
