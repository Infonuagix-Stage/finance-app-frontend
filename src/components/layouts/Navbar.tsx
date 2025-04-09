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
import styles from "./Navbar.module.css";

interface NavbarProps {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsDropdownOpen }) => {
  const { t } = useTranslation("general");
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/home" className={styles.navbarLogo} onClick={() => setIsMobileMenuOpen(false)}>
          Budget<span>ly</span>
        </Link>

        <div className={styles.navbarLinks}>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className={styles.navbarLink}>{t("dashboard")}</Link>
              <Link to="/budgeting" className={styles.navbarLink}>{t("budget")}</Link>
              <Link to="/project" className={styles.navbarLink}>{t("projects")}</Link>
              <Link to="/payment" className={styles.navbarLink}>{t("payments")}</Link>
            </>
          )}
          <Link to="/about" className={styles.navbarLink}>{t("about")}</Link>
        </div>

        <div className={styles.authButtons}>
          {isAuthenticated ? (
            <>
              <button
                onClick={toggleMobileMenu}
                className={styles.mobileMenuButton}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(prev => !prev);
                  setIsMobileMenuOpen(false);
                }}
                className={styles.profileImage}
              >
                <img src={user?.picture || "https://via.placeholder.com/40"} alt="Profile" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  loginWithRedirect();
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.authButton} ${styles.secondary}`}
              >
                {t("login")}
              </button>
              <button
                onClick={() => {
                  loginWithRedirect({ screen_hint: "signup" } as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.authButton} ${styles.primary}`}
              >
                {t("signup")}
              </button>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileLink} onClick={toggleMobileMenu}>
            <FiHome /> {t("home")}
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className={styles.mobileLink} onClick={toggleMobileMenu}>
                <FiGrid /> {t("dashboard")}
              </Link>
              <Link to="/budgeting" className={styles.mobileLink} onClick={toggleMobileMenu}>
                <FiPieChart /> {t("budget")}
              </Link>
              <Link to="/project" className={styles.mobileLink} onClick={toggleMobileMenu}>
                <FiFolder /> {t("projects")}
              </Link>
              <Link to="/payment" className={styles.mobileLink} onClick={toggleMobileMenu}>
                <FiCreditCard /> {t("payments")}
              </Link>
            </>
          )}
          <Link to="/about" className={styles.mobileLink} onClick={toggleMobileMenu}>
            <FiInfo /> {t("about")}
          </Link>

          {!isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  loginWithRedirect();
                  toggleMobileMenu();
                }}
                className={`${styles.authButton} ${styles.secondary}`}
              >
                {t("login")}
              </button>
              <button
                onClick={() => {
                  loginWithRedirect({ screen_hint: "signup" } as any);
                  toggleMobileMenu();
                }}
                className={`${styles.authButton} ${styles.primary}`}
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
              className={`${styles.authButton} ${styles.primary}`}
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
