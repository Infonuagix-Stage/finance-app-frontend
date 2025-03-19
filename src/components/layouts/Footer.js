import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation("layouts");
  const currentYear = new Date().getFullYear();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-10">
        {/* Texte centré avec traduction */}
        <p
          className="text-sm flex-1 text-center"
          // Utilisation de dangerouslySetInnerHTML pour interpréter la balise HTML &copy;
          dangerouslySetInnerHTML={{ __html: t("rights_reserved", { year: currentYear }) }}
        />
        {/* Sélecteur de langue affiché dans sa langue d'origine */}
        <div className="flex space-x-3">
          <button
            onClick={() => changeLanguage("fr")}
            className={`text-gray-300 hover:text-white transition ${i18n.language === "fr" ? "font-bold" : ""}`}
          >
            Français
          </button>
          <span className="text-gray-500">|</span>
          <button
            onClick={() => changeLanguage("en")}
            className={`text-gray-300 hover:text-white transition ${i18n.language === "en" ? "font-bold" : ""}`}
          >
            English
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
