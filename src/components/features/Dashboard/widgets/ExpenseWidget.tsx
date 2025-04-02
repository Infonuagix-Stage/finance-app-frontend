import React from "react";
import { useTranslation } from "react-i18next";
import "./ExpenseWidget.css"; // Import CSS file

interface ExpenseWidgetProps {
  totalExpenses: number;
}

const ExpenseWidget: React.FC<ExpenseWidgetProps> = ({ totalExpenses }) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="expense-widget">
      <h3 className="expense-widget-title">{t("expense_total")}</h3>
      <p className="expense-widget-amount">${totalExpenses.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseWidget;
