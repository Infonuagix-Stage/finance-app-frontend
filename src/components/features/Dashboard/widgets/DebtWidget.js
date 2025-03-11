// components/Dashboard/widgets/DebtWidget.js
import React from "react";
import { useTranslation } from "react-i18next";

const DebtWidget = ({ totalDebt }) => {
    const { t } = useTranslation("dashboard");
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">{t("debt_total")}</h3>
      <p className="text-2xl text-yellow-400">${totalDebt.toFixed(2)}</p>
    </div>
  );
};

export default DebtWidget;
