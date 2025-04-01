import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import ExpenseWidget from "../features/Dashboard/widgets/ExpenseWidget";
import BudgetWidget from "../features/Dashboard/widgets/BudgetWidget";
import SavingsWidget from "../features/Dashboard/widgets/SavingsWidget";
import DebtWidget from "../features/Dashboard/widgets/DebtWidget";
import ChartWidget from "../features/Dashboard/widgets/ChartWidget";
import { useTranslation } from "react-i18next";
import "./Dashboard.css";

// Type definitions
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  }[];
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation(["dashboard", "homepage"]);
  const { user } = useAuth0();
  const { totalExpense, globalBalance } = useBudgetContext();

  // Define chart data
  const chartData: ChartData = {
    labels: [
      t("months.jan"),
      t("months.feb"),
      t("months.mar"),
      t("months.apr"),
      t("months.may"),
      t("months.jun"),
    ],
    datasets: [
      {
        label: t("incomes"),
        data: [2500, 1900, 3000, 2800, 2000, 3000],
        backgroundColor: "rgba(40, 221, 79, 0.27)",
        borderColor: "rgb(58, 202, 130)",
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: t("expenses"),
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
        position: "top" as const,
        labels: { color: "#fff" },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#fff" },
      },
      y: {
        grid: { color: "#4A5568" },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t("dashboard")}</h1>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">
            {t("welcome")}, {user?.name || user?.nickname || "User"}!
          </h2>
          <p className="welcome-message">{t("welcomeMessage")}</p>
        </div>

        {/* Widgets Grid */}
        <div className="widgets-grid">
          <ExpenseWidget totalExpenses={totalExpense} />
          <BudgetWidget remainingBudget={globalBalance} />
          <DebtWidget totalDebt={500} />
        </div>

        {/* Chart Widget */}
        <div className="chart-widget">
          <ChartWidget chartData={chartData} chartOptions={chartOptions} />
        </div>

        {/* Savings Widget */}
        <div className="savings-widget">
          <SavingsWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
