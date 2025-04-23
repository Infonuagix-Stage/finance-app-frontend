import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./BudgetHeader.module.css";

interface BudgetHeaderProps {
  currentDate: Date;
  previousMonth: () => void;
  nextMonth: () => void;
  totalIncome: number;
  totalExpense: number;
  globalBalance: number;
}

const BudgetHeader: React.FC<BudgetHeaderProps> = ({
  currentDate,
  previousMonth,
  nextMonth,
  totalIncome,
  totalExpense,
  globalBalance,
}) => {
  const { t } = useTranslation("budgeting");

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const formattedMonth = capitalize(
    currentDate.toLocaleString(i18n.language, {
      month: "long",
      year: "numeric",
    })
  );

  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>{t("header.title")}</h1>

      <div className={styles.monthSelector}>
        <button onClick={previousMonth} className={styles.monthButton}>
          <FaChevronLeft />
        </button>
        <span className={styles.monthText}>{formattedMonth}</span>
        <button onClick={nextMonth} className={styles.monthButton}>
          <FaChevronRight />
        </button>
      </div>

      <div className={styles.headerStats}>
        <p className={styles.headerIncomeExpenses}>
          <span className={styles.income}>${totalIncome.toFixed(2)}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.expenses}>${totalExpense.toFixed(2)}</span>
        </p>
        <p
          className={`${styles.balance} ${
            globalBalance >= 0 ? styles.positive : styles.negative
          }`}
        >
          {t("header.balance")}: ${globalBalance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BudgetHeader;