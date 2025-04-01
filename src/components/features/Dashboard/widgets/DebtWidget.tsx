import React from "react";
import { useTranslation } from "react-i18next";
import "./DebtWidget.css"; // Import CSS file

interface DebtWidgetProps {
  totalDebt: number;
}

const DebtWidget: React.FC<DebtWidgetProps> = ({ totalDebt }) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="debt-widget">
      <h3 className="debt-widget-title">{t("debt_total")}</h3>
      <p className="debt-widget-amount">${totalDebt.toFixed(2)}</p>
    </div>
  );
};

export default DebtWidget;
