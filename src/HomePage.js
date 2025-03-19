import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation("homepage"); 

  const data = [
    { name: t("months.jan"), value: 400 },
    { name: t("months.feb"), value: 300 },
    { name: t("months.mar"), value: 500 },
    { name: t("months.apr"), value: 700 },
    { name: t("months.may"), value: 600 },
    { name: t("months.jun"), value: 800 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Section d'accueil */}
      <header className="py-16 text-center">
        <h1 className="text-4xl font-bold">{t("manage_finances")}</h1>
        <p className="mt-4 text-lg text-gray-400">
          {t("track_expenses")}
        </p>
      </header>

      {/* Aperçu des statistiques */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold">12 500 $</h2>
          <p className="text-gray-400">{t("total_balance")}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold">3 200 $</h2>
          <p className="text-gray-400">{t("monthly_income")}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold">2 100 $</h2>
          <p className="text-gray-400">{t("monthly_expenses")}</p>
        </div>
      </section>

      {/* Section Graphique */}
      <section className="mt-12 px-6 md:px-20">
        <div className="chart-container">
          <h3 className="chart-title">{t("expense_evolution")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#CBD5E0" />
              <YAxis stroke="#CBD5E0" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#63B3ED" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}