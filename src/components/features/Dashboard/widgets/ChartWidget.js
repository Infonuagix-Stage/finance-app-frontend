// components/Dashboard/widgets/ChartWidget.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartWidget = ({ chartData, chartOptions }) => {
  const { t } = useTranslation("dashboard");
  return (
    <div className="chart-container">
      <h3 className="chart-title">{t("revenue_vs_expenses")}</h3>
      <div style={{ height: "200px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartWidget;
