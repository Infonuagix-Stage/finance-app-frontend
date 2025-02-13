// components/Dashboard.js
import React from "react";
import { useAuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        {/* Section de bienvenue */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Bienvenue, {user ? user.name : "Utilisateur"} !
          </h2>
          <p className="text-gray-300">
            Voici un aperçu de vos finances et de vos activités récentes.
          </p>
        </div>

        {/* Statistiques ou résumé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Solde total</h3>
            <p className="text-2xl text-green-400">$5,000.00</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Dépenses ce mois-ci</h3>
            <p className="text-2xl text-red-400">$1,200.00</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Revenus ce mois-ci</h3>
            <p className="text-2xl text-blue-400">$2,500.00</p>
          </div>
        </div>

        {/* Graphiques ou autres éléments */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Activités récentes</h3>
          <p className="text-gray-300">
            Aucune activité récente pour le moment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
