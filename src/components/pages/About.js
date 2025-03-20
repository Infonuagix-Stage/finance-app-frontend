import React from "react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation("about"); // Charge le namespace "about"

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

        {/* Section Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("mission_title")}</h2>
          <p className="text-gray-300">{t("mission_text")}</p>
        </div>

        {/* Section Fonctionnalités */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("features_title")}</h2>
          <ul className="list-disc list-inside text-gray-300">
            {t("features", { returnObjects: true }).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Section Équipe */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("team_title")}</h2>
          <p className="text-gray-300">{t("team_text")}</p>
        </div>

        {/* Section Contact */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("contact_title")}</h2>
          <p className="text-gray-300">
            {t("contact_text")}
            <a href="mailto:support@financeapp.com" className="text-blue-400 hover:underline">
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
