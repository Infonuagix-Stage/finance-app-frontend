import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import "./HomePage.css"; // Import the CSS file

// Define the type for the chart data
interface ChartData {
  name: string;
  value: number;
}

export default function HomePage() {
  const { t } = useTranslation("homepage");

  // Use useMemo to ensure the translations are correctly applied
  const data: ChartData[] = useMemo(
    () => [
      { name: t("months.jan"), value: 400 },
      { name: t("months.feb"), value: 300 },
      { name: t("months.mar"), value: 500 },
      { name: t("months.apr"), value: 700 },
      { name: t("months.may"), value: 600 },
      { name: t("months.jun"), value: 800 },
    ],
    [t]
  );

  return (
    <div className="homepage-container">
      {/* Section d'accueil */}
      <header className="homepage-header">
        <h1 className="homepage-title">{t("manage_finances")}</h1>
        <p className="homepage-subtitle">{t("track_expenses")}</p>
      </header>

      {/* Aperçu des statistiques */}
      <section className="stats-grid">
        <div className="stats-card">
          <h2 className="stats-value">12 500 $</h2>
          <p className="stats-label">{t("total_balance")}</p>
        </div>
        <div className="stats-card">
          <h2 className="stats-value">3 200 $</h2>
          <p className="stats-label">{t("monthly_income")}</p>
        </div>
        <div className="stats-card">
          <h2 className="stats-value">2 100 $</h2>
          <p className="stats-label">{t("monthly_expenses")}</p>
        </div>
      </section>

      {/* Section Graphique */}
      <section className="chart-section">
        <div className="chart-container">
          <h3 className="chart-title">{t("expense_evolution")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#CBD5E0" />
              <YAxis stroke="#CBD5E0" />
              <Tooltip contentStyle={{ backgroundColor: "#2D3748", borderRadius: "8px", color: "#fff" }} />
              <Line type="monotone" dataKey="value" stroke="#63B3ED" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
