import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Payment.css"; // Import the CSS file

interface Debt {
  id: number;
  name: string;
  totalAmount: number;
  remainingAmount: number;
}

const Payment: React.FC = () => {
  const { t } = useTranslation("payement");
  const [debts, setDebts] = useState<Debt[]>([]);
  const [newDebtName, setNewDebtName] = useState<string>("");
  const [newDebtTotalAmount, setNewDebtTotalAmount] = useState<number>(0);
  const [isDebtModalVisible, setIsDebtModalVisible] = useState<boolean>(false);

  const addDebt = () => {
    if (!newDebtName.trim() || newDebtTotalAmount <= 0) return;

    const newDebt: Debt = {
      id: Date.now(),
      name: newDebtName,
      totalAmount: newDebtTotalAmount,
      remainingAmount: newDebtTotalAmount,
    };

    setDebts((prevDebts) => [...prevDebts, newDebt]);
    setIsDebtModalVisible(false);
    setNewDebtName("");
    setNewDebtTotalAmount(0);
  };

  return (
    <div className="payment-container">
      {/* Header */}
      <div className="header">
        <h1>{t("title")}</h1>
      </div>

      {/* Debts Section */}
      <div className="debt-section">
        <h2>{t("debt")}</h2>
        <div className="debt-list">
          {debts.length === 0 ? (
            <p className="no-debt">{t("noDebt")}</p>
          ) : (
            debts.map((debt) => (
              <div key={debt.id} className="debt-card">
                <h4>{debt.name}</h4>
                <p>{t("totalAmount")}: ${debt.totalAmount.toFixed(2)}</p>
                <p>{t("remainingAmount")}: ${debt.remainingAmount.toFixed(2)}</p>
                <p>
                  {t("progress")}:{" "}
                  <span className="progress">
                    {((1 - debt.remainingAmount / debt.totalAmount) * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
            ))
          )}
          {/* Add Debt Button */}
          <button className="add-debt-btn" onClick={() => setIsDebtModalVisible(true)}>
            <span>+</span>
          </button>
        </div>
      </div>

      {/* Add Debt Modal */}
      {isDebtModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("addDebt")}</h3>
            <input
              type="text"
              placeholder={t("debtNamePlaceholder")}
              value={newDebtName}
              onChange={(e) => setNewDebtName(e.target.value)}
            />
            <input
              type="number"
              placeholder={t("totalAmountPlaceholder")}
              value={newDebtTotalAmount}
              onChange={(e) => setNewDebtTotalAmount(Number(e.target.value))}
            />
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setIsDebtModalVisible(false)}>
                {t("cancel")}
              </button>
              <button className="confirm-btn" onClick={addDebt}>
                {t("add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
