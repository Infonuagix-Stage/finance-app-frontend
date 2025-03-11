import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import manuel des fichiers JSON
import enAbout from "./locales/en/about.json";
import enBudgeting from "./locales/en/budgeting.json";
import enDashboard from "./locales/en/dashboard.json";
import enGeneral from "./locales/en/general.json";
import enHomepage from "./locales/en/homepage.json";
import enLayouts from "./locales/en/layouts.json";
import enPaiement from "./locales/en/paiement.json";
import enProject from "./locales/en/project.json";

import frAbout from "./locales/fr/about.json";
import frBudgeting from "./locales/fr/budgeting.json";
import frDashboard from "./locales/fr/dashboard.json";
import frGeneral from "./locales/fr/general.json";
import frHomepage from "./locales/fr/homepage.json";
import frLayouts from "./locales/fr/layouts.json";
import frPaiement from "./locales/fr/paiement.json";
import frProject from "./locales/fr/project.json";

// Organisation des traductions
const resources = {
  en: { about: enAbout, budgeting: enBudgeting, dashboard: enDashboard, general: enGeneral, homepage: enHomepage, layouts: enLayouts, paiement: enPaiement, project: enProject },
  fr: { about: frAbout, budgeting: frBudgeting, dashboard: frDashboard, general: frGeneral, homepage: frHomepage, layouts: frLayouts, paiement: frPaiement, project: frProject },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    defaultNS: "general",
    interpolation: { escapeValue: false },
  });

export default i18n;
