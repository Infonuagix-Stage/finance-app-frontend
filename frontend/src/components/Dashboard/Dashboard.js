// components/Dashboard/Dashboard.js
import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useBudgetContext } from "../../context/BudgetContext";
import ExpenseWidget from "./widgets/ExpenseWidget";
import BudgetWidget from "./widgets/BudgetWidget";
import SavingsWidget from "./widgets/SavingsWidget";
import DebtWidget from "./widgets/DebtWidget";
import ChartWidget from "./widgets/ChartWidget"; // Importez le nouveau composant

const Dashboard = () => {
  const { user } = useAuthContext();
  const { totalIncome, totalExpense, globalBalance } = useBudgetContext();

  // Données factices pour l'exemple (à remplacer par des données réelles plus tard)
  const savingsProgress = 45; // 45% de l'objectif d'épargne atteint
  const totalDebt = 500;

  // Données pour le graphique
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenus",
        data: [2500, 1900, 3000, 2800, 2000, 3000],
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Couleur des barres de revenus
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 5, // Bordures arrondies pour les barres
      },
      {
        label: "Dépenses",
        data: [1500, 1200, 1800, 1000, 2000, 1500],
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Couleur des barres de dépenses
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        borderRadius: 5, // Bordures arrondies pour les barres
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permet de redimensionner le graphique
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff", // Couleur du texte de la légende
        },
      },
      title: {
        display: false, // Masquer le titre (optionnel)
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Masquer la grille de l'axe X
        },
        ticks: {
          color: "#fff", // Couleur des étiquettes de l'axe X
        },
      },
      y: {
        grid: {
          color: "#4A5568", // Couleur de la grille de l'axe Y
        },
        ticks: {
          color: "#fff", // Couleur des étiquettes de l'axe Y
        },
      },
    },
  };

  // Données factices pour les dernières transactions
  const recentTransactions = [
    { id: 1, description: "Achat en ligne", amount: -50 },
    { id: 2, description: "Salaire", amount: 2000 },
    { id: 3, description: "Facture d'électricité", amount: -100 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-0">
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

        {/* Widget du graphique */}
        <div className="mb-8">
          <ChartWidget chartData={chartData} chartOptions={chartOptions} />
        </div>

        {/* Dernières transactions */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Dernières transactions</h3>
          <ul>
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="text-gray-300">
                {transaction.description} : ${transaction.amount}
              </li>
            ))}
          </ul>
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
