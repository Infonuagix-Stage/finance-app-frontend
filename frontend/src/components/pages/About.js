// components/About.js
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8">À propos de FinanceApp</h1>

        {/* Section Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
          <p className="text-gray-300">
            FinanceApp est une application conçue pour vous aider à gérer vos
            finances personnelles de manière simple et efficace. Que vous
            souhaitiez suivre vos dépenses, planifier votre budget, ou atteindre
            vos objectifs d'épargne, FinanceApp est là pour vous accompagner.
          </p>
        </div>

        {/* Section Fonctionnalités */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Fonctionnalités</h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>Suivi des revenus et dépenses</li>
            <li>Gestion de budget personnalisé</li>
            <li>Objectifs d'épargne et projets</li>
            <li>Visualisation des données via des graphiques</li>
            <li>Gestion des dettes</li>
          </ul>
        </div>

        {/* Section Équipe */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notre Équipe</h2>
          <p className="text-gray-300">
            FinanceApp est développé par une équipe passionnée de développeurs
            et de designers qui croient en la puissance de la technologie pour
            améliorer la gestion des finances personnelles.
          </p>
        </div>

        {/* Section Contact */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contactez-nous</h2>
          <p className="text-gray-300">
            Vous avez des questions ou des suggestions ? N'hésitez pas à nous
            contacter à l'adresse suivante :{" "}
            <a
              href="mailto:support@financeapp.com"
              className="text-blue-400 hover:underline"
            >
              support@financeapp.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
