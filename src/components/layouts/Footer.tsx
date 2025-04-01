import React from "react";
import { useTranslation } from "react-i18next";
import "./Footer.css"; // Import CSS file

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation("layouts");
  const currentYear: number = new Date().getFullYear();

  const changeLanguage = (lng: "fr" | "en"): void => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Centered text with translation */}
        <p
          className="footer-text"
          dangerouslySetInnerHTML={{ __html: t("rights_reserved", { year: currentYear }) }}
        />

        {/* Language selector */}
        <div className="lang-selector">
          <button
            onClick={() => changeLanguage("fr")}
            className={`lang-button ${i18n.language === "fr" ? "active" : ""}`}
          >
            Français
          </button>
          <span className="lang-separator">|</span>
          <button
            onClick={() => changeLanguage("en")}
            className={`lang-button ${i18n.language === "en" ? "active" : ""}`}
          >
            English
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
