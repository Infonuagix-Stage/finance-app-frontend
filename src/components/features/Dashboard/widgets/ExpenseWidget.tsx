import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./ExpenseWidget.module.css";

interface ExpenseWidgetProps {
  totalExpenses: number;
}

const ExpenseWidget: React.FC<ExpenseWidgetProps> = ({ totalExpenses }) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className={styles.expenseWidget}>
      <h3 className={styles.expenseWidgetTitle}>{t("expense_total")}</h3>
      <p className={styles.expenseWidgetAmount}>${totalExpenses.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseWidget;
