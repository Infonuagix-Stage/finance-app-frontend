import React from "react";
import { useTranslation } from "react-i18next";
import "./About.css"; // Import CSS file

const About: React.FC = () => {
  const { t } = useTranslation("about");

  // Ensure that `features` is an array of strings
  const features: string[] = t("features", { returnObjects: true }) as string[];

  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">{t("title")}</h1>

        {/* Section Description */}
        <div className="about-section">
          <h2 className="about-section-title">{t("mission_title")}</h2>
          <p className="about-text">{t("mission_text")}</p>
        </div>

        {/* Section Fonctionnalités */}
        <div className="about-section">
          <h2 className="about-section-title">{t("features_title")}</h2>
          <ul className="about-list">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Section Équipe */}
        <div className="about-section">
          <h2 className="about-section-title">{t("team_title")}</h2>
          <p className="about-text">{t("team_text")}</p>
        </div>

        {/* Section Contact */}
        <div className="about-section">
          <h2 className="about-section-title">{t("contact_title")}</h2>
          <p className="about-text">
            {t("contact_text")}
            <a href="mailto:support@financeapp.com" className="about-link">
              {t("contact_email")}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
