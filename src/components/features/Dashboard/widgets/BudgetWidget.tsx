import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import "./BudgetWidget.css"; // Import the CSS file

interface BudgetWidgetProps {
  remainingBudget: number;
}

const BudgetWidget: FC<BudgetWidgetProps> = ({ remainingBudget }) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="budget-widget">
      <h3 className="budget-widget-title">{t("balance")}</h3>
      <p className="budget-widget-balance">${remainingBudget.toFixed(2)}</p>
    </div>
  );
};

export default BudgetWidget;
