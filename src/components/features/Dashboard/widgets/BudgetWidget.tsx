import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./BudgetWidget.module.css"; // nouveau style

interface BudgetWidgetProps {
  remainingBudget: number;
}

const BudgetWidget: FC<BudgetWidgetProps> = ({ remainingBudget }) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className={styles.budgetWidget}>
      <h3 className={styles.budgetWidgetTitle}>{t("balance")}</h3>
      <p className={styles.budgetWidgetBalance}>${remainingBudget.toFixed(2)}</p>
    </div>
  );
};

export default BudgetWidget;
