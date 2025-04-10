import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";

const About: React.FC = () => {
  const { t } = useTranslation("about");

  const features: string[] = t("features", { returnObjects: true }) as string[];

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <h1 className={styles.aboutTitle}>{t("title")}</h1>

        <div className={styles.aboutSection}>
          <h2 className={styles.aboutSectionTitle}>{t("mission_title")}</h2>
          <p className={styles.aboutText}>{t("mission_text")}</p>
        </div>

        <div className={styles.aboutSection}>
          <h2 className={styles.aboutSectionTitle}>{t("features_title")}</h2>
          <ul className={styles.aboutList}>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className={styles.aboutSection}>
          <h2 className={styles.aboutSectionTitle}>{t("team_title")}</h2>
          <p className={styles.aboutText}>{t("team_text")}</p>
        </div>

        <div className={styles.aboutSection}>
          <h2 className={styles.aboutSectionTitle}>{t("contact_title")}</h2>
          <p className={styles.aboutText}>
            {t("contact_text")}
            <a href="mailto:support@financeapp.com" className={styles.aboutLink}>
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
