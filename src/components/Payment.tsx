import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebts } from "../hooks/useDebts";
import { Debt } from "../services/debtService";
import "./Payment.css"; // Make sure this CSS file handles .debt-actions, .modal, etc.

const Payment: React.FC = () => {
  const { t } = useTranslation("payement");
  const { debts, loading, error, createDebt, deleteDebt, updateDebt } = useDebts();

  const [newCreditor, setNewCreditor] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newDueDate, setNewDueDate] = useState("");
  const [newMonthly, setNewMonthly] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const openEditModal = (debt: Debt) => {
    setEditingDebt(debt);
    setNewCreditor(debt.creditor);
    setNewAmount(debt.amountOwed);
    setNewMonthly(debt.monthlyPayment);
    setNewDueDate(debt.dueDate.split("T")[0]); // for <input type="date" />
    setIsModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingDebt(null);
    setNewCreditor("");
    setNewAmount(0);
    setNewMonthly(0);
    setNewDueDate("");
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!newCreditor.trim() || newAmount <= 0 || !newDueDate || newMonthly <= 0) return;

    try {
      if (editingDebt) {
        await updateDebt(editingDebt.debtId, {
          creditor: newCreditor,
          amountOwed: newAmount,
          dueDate: newDueDate,
          monthlyPayment: newMonthly,
          status: editingDebt.status,
          amountPaid: editingDebt.amountPaid,
        });
      } else {
        await createDebt({
          creditor: newCreditor,
          amountOwed: newAmount,
          amountPaid: 0,
          dueDate: newDueDate,
          monthlyPayment: newMonthly,
          status: "Pending",
        });
      }

      setIsModalVisible(false);
      setEditingDebt(null);
      setNewCreditor("");
      setNewAmount(0);
      setNewDueDate("");
      setNewMonthly(0);
    } catch (err) {
      console.error("Erreur lors de l'ajout/mise à jour de la dette", err);
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
            <div className="debt-list">
            {debts.map((debt) => {
              const progress = 100 * (debt.amountPaid / debt.amountOwed);
              return (
                <div key={debt.debtId} className="debt-card">
                  <h4>{debt.creditor}</h4>
                  <p>Total Amount: ${debt.amountOwed.toFixed(2)}</p>
                  <p>Remaining Amount: ${(debt.amountOwed - debt.amountPaid).toFixed(2)}</p>
                  <p>Progress: <span className="progress">{progress.toFixed(2)}%</span></p>
                  <p>Due Date: {new Date(debt.dueDate).toLocaleDateString()}</p>
                  <div className="debt-actions">
                    <button onClick={() => openEditModal(debt)}>✏️</button>
                    <button onClick={() => deleteDebt(debt.debtId)}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>

        )}

        <button className="add-debt-btn" onClick={openCreateModal}>
          <span>+</span>
        </button>
      </div>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingDebt ? t("editDebt") : t("addDebt")}</h3>
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
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingDebt(null);
                }}
              >
                {t("cancel")}
              </button>
              <button className="confirm-btn" onClick={handleSubmit}>
                {editingDebt ? t("update") : t("add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
