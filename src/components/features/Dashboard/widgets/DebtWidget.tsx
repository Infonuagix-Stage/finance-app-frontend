import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./DebtWidget.module.css";

interface DebtWidgetProps {
  totalDebt: number;
}

const DebtWidget: React.FC<DebtWidgetProps> = ({ totalDebt }) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className={styles.debtWidget}>
      <h3 className={styles.debtWidgetTitle}>{t("debt_total")}</h3>
      <p className={styles.debtWidgetAmount}>${totalDebt.toFixed(2)}</p>
    </div>
  );
};

export default DebtWidget;
