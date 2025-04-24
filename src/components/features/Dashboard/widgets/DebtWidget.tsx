import React from "react";
import styles from "./DebtWidget.module.css";

interface DebtWidgetProps {
  totalDebt: number;
  remainingDebt: number;
  loading: boolean;
  error: string | null;
}

const DebtWidget: React.FC<DebtWidgetProps> = ({ totalDebt, remainingDebt, loading, error }) => {
  return (
    <div className={styles.debtWidget}>
      <h3>Total Debt</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <p>Total Debt: ${totalDebt.toFixed(2)}</p>
          <p>Remaining Debt: ${remainingDebt.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default DebtWidget;
