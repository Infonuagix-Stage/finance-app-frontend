import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation("layouts");
  const currentYear: number = new Date().getFullYear();

  const changeLanguage = (lng: "fr" | "en"): void => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p
          className={styles.footerText}
          dangerouslySetInnerHTML={{
            __html: t("rights_reserved", { year: currentYear }),
          }}
        />

        <div className={styles.langSelector}>
          <button
            onClick={() => changeLanguage("fr")}
            className={`${styles.langButton} ${i18n.language === "fr" ? styles.active : ""}`}
          >
            Français
          </button>
          <span className={styles.langSeparator}>|</span>
          <button
            onClick={() => changeLanguage("en")}
            className={`${styles.langButton} ${i18n.language === "en" ? styles.active : ""}`}
          >
            English
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
