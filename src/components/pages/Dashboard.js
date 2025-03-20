import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import ExpenseWidget from "../features/Dashboard/widgets/ExpenseWidget";
import BudgetWidget from "../features/Dashboard/widgets/BudgetWidget";
import SavingsWidget from "../features/Dashboard/widgets/SavingsWidget"; // Importez le nouveau composant
import DebtWidget from "../features/Dashboard/widgets/DebtWidget";
import ChartWidget from "../features/Dashboard/widgets/ChartWidget";
import { useTranslation } from "react-i18next";
const Dashboard = () => {
  const { t } = useTranslation( "dashboard", "homepage"); 
  const { user } = useAuth0(); // Destructure the Auth0 hook
  const { totalExpense, globalBalance } = useBudgetContext();

  // Données pour le graphique
  const chartData = {
    labels: [t("months.jan"), t("months.feb"), t("months.mar"), t("months.apr"), t("months.may"), t("months.jun")],
    datasets: [
      {
        label: `${t("incomes")}`,
        data: [2500, 1900, 3000, 2800, 2000, 3000],
        backgroundColor: "rgba(40, 221, 79, 0.27)",
        borderColor: "rgb(58, 202, 130)",
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: `${t("expenses")}`,
        data: [1500, 1200, 1800, 1000, 2000, 1500],
        backgroundColor: "rgba(255, 99, 99, 0.34)",
        borderColor: "rgb(255, 99, 99)",
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        grid: {
          color: "#4A5568",
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h1 className="text-3xl font-bold mb-8">{t("dashboard")}</h1>

        {/* Section de bienvenue */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">
           {t("welcome")}, {user ? user.name: user.nickname} !
          </h2>
          <p className="text-gray-300">
            {t("welcomeMessage")}
          </p>
        </div>

        {/* Grille de widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ExpenseWidget totalExpenses={totalExpense} />
          <BudgetWidget remainingBudget={globalBalance} />
          <DebtWidget totalDebt={500} />
        </div>

        {/* Widget du graphique */}
        <div className="mb-8">
          <ChartWidget chartData={chartData} chartOptions={chartOptions} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <SavingsWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
