import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebts } from "../hooks/useDebts";
import "./Payment.css"; // Assure-toi que le style existe

const Payment: React.FC = () => {
  const { t } = useTranslation("payement");
  const { debts, loading, error, createDebt, deleteDebt, updateDebt } =
    useDebts();

  const [newCreditor, setNewCreditor] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newDueDate, setNewDueDate] = useState("");
  const [newMonthly, setNewMonthly] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddDebt = async () => {
    if (!newCreditor.trim() || newAmount <= 0 || !newDueDate || newMonthly <= 0)
      return;

    try {
      await createDebt({
        creditor: newCreditor,
        amountOwed: newAmount,
        amountPaid: 0,
        dueDate: newDueDate,
        monthlyPayment: newMonthly,
        status: "Pending",
      });

      setNewCreditor("");
      setNewAmount(0);
      setNewDueDate("");
      setNewMonthly(0);
      setIsModalVisible(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la dette", err);
    }
  };

  return (
    <div className="payment-container">
      <div className="header">
        <h1>{t("title")}</h1>
      </div>

      <div className="debt-section">
        <h2>{t("debt")}</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : debts.length === 0 ? (
          <p className="no-debt">{t("noDebt")}</p>
        ) : (
          debts.map((debt) => {
            const progress = 100 * (debt.amountPaid / debt.amountOwed);
            return (
              <div key={debt.debtId} className="debt-card">
                <h4>{debt.creditor}</h4>
                <p>
                  {t("totalAmount")}: ${debt.amountOwed.toFixed(2)}
                </p>
                <p>
                  {t("remainingAmount")}: $
                  {(debt.amountOwed - debt.amountPaid).toFixed(2)}
                </p>
                <p>
                  {t("progress")}:{" "}
                  <span className="progress">{progress.toFixed(2)}%</span>
                </p>
                <p>
                  {t("dueDate")}: {new Date(debt.dueDate).toLocaleDateString()}
                </p>
              </div>
            );
          })
        )}

        <button
          className="add-debt-btn"
          onClick={() => setIsModalVisible(true)}
        >
          <span>+</span>
        </button>
      </div>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("addDebt")}</h3>
            <input
              type="text"
              placeholder={t("debtNamePlaceholder")}
              value={newCreditor}
              onChange={(e) => setNewCreditor(e.target.value)}
            />
            <input
              type="number"
              placeholder={t("totalAmountPlaceholder")}
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder={t("monthlyAmountPlaceholder")}
              value={newMonthly}
              onChange={(e) => setNewMonthly(Number(e.target.value))}
            />
            <input
              type="date"
              placeholder={t("dueDate")}
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setIsModalVisible(false)}
              >
                {t("cancel")}
              </button>
              <button className="confirm-btn" onClick={handleAddDebt}>
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
