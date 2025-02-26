import React, { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useBudgetContext } from "../../context/BudgetContext";
import ExpenseWidget from "./widgets/ExpenseWidget";
import BudgetWidget from "./widgets/BudgetWidget";
import SavingsWidget from "./widgets/SavingsWidget";
import DebtWidget from "./widgets/DebtWidget";
import ChartWidget from "./widgets/ChartWidget";
import { getExpensesForCategory } from "../../services/expenseService";
import { getIncomesForCategory } from "../../services/incomeService";
import { getCategoriesForUser } from "../../services/categoryService";

const Dashboard = () => {
  const { user } = useAuthContext();
  const {
    totalIncome,
    totalExpense,
    globalBalance,
    setTotalIncome,
    setTotalExpense,
    setGlobalBalance,
  } = useBudgetContext();
  const userId = user ? user.id : null;

  // Recalculate totals whenever the Dashboard is displayed
  useEffect(() => {
    if (!userId) return;

    const fetchTotals = async () => {
      try {
        let totalExpense = 0;
        let totalIncome = 0;

        // Récupérer toutes les catégories de l'utilisateur
        const categories = await getCategoriesForUser(userId);
        console.log("Catégories récupérées :", categories); // Log pour vérifier les catégories

        if (!categories || categories.length === 0) {
          console.warn("Aucune catégorie trouvée pour l'utilisateur.");
          return;
        }

        // Calculer les totaux pour chaque catégorie
        for (const category of categories) {
          if (category.type === "EXPENSE") {
            const expenses = await getExpensesForCategory(userId, category.id);
            console.log(
              "Dépenses pour la catégorie",
              category.id,
              ":",
              expenses
            ); // Log pour vérifier les dépenses
            totalExpense += expenses.reduce(
              (acc, expense) =>
                acc + parseFloat(expense.amount || expense.montant || 0), // Utilisez le bon champ
              0
            );
          } else if (category.type === "INCOME") {
            const incomes = await getIncomesForCategory(userId, category.id);
            console.log("Revenus pour la catégorie", category.id, ":", incomes); // Log pour vérifier les revenus
            totalIncome += incomes.reduce(
              (acc, income) =>
                acc + parseFloat(income.amount || income.montant || 0), // Utilisez le bon champ
              0
            );
          }
        }

        console.log("Total des dépenses :", totalExpense); // Log pour vérifier le total des dépenses
        console.log("Total des revenus :", totalIncome); // Log pour vérifier le total des revenus

        // Calculer le solde global
        const globalBalance = totalIncome - totalExpense;

        // Mettre à jour le contexte global
        setTotalIncome(totalIncome);
        setTotalExpense(totalExpense);
        setGlobalBalance(globalBalance);
      } catch (error) {
        console.error("Erreur lors du calcul des totaux :", error);
      }
    };

    fetchTotals();
  }, [userId, setTotalIncome, setTotalExpense, setGlobalBalance]);

  // Données pour le graphique
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenus",
        data: [2500, 1900, 3000, 2800, 2000, 3000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: "Dépenses",
        data: [1500, 1200, 1800, 1000, 2000, 1500],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
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
