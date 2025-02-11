// components/Dashboard/Dashboard.js
import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import ExpenseWidget from "./widgets/ExpenseWidget";
import BudgetWidget from "./widgets/BudgetWidget";
import SavingsWidget from "./widgets/SavingsWidget";
import DebtWidget from "./widgets/DebtWidget";
import { useBudgetContext } from "../../context/BudgetContext";

const Dashboard = () => {
  const { user } = useAuthContext();
  const { totalIncome, totalExpense, globalBalance } = useBudgetContext();

  // Données factices pour l'exemple (à remplacer par des données réelles plus tard)
  const savingsProgress = 45; // 45% de l'objectif d'épargne atteint
  const totalDebt = 500;

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

        {/* Grille de widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ExpenseWidget totalExpenses={totalExpense} />
          <BudgetWidget remainingBudget={globalBalance} />
          <SavingsWidget savingsProgress={savingsProgress} />
          <DebtWidget totalDebt={totalDebt} />
        </div>

        {/* Section pour les projets/épargne */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Projets et Épargne</h3>
          <p className="text-gray-300">
            Aucun projet ou épargne en cours pour le moment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
