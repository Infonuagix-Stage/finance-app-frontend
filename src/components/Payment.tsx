import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebts } from "../hooks/useDebts";
import { Debt } from "../services/debtService";
import styles from "./Payment.module.css";

const Payment: React.FC = () => {
  const { t } = useTranslation("payement");
  const { debts, loading, error, createDebt, deleteDebt, updateDebt } = useDebts();

  const [newCreditor, setNewCreditor] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newAmountPaid, setNewAmountPaid] = useState<number>(0);
  const [newDueDate, setNewDueDate] = useState("");
  const [newMonthly, setNewMonthly] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const openEditModal = (debt: Debt) => {
    setEditingDebt(debt);
    setNewCreditor(debt.creditor);
    setNewAmount(debt.amountOwed);
    setNewAmountPaid(debt.amountPaid);
    setNewMonthly(debt.monthlyPayment);
    setNewDueDate(debt.dueDate.split("T")[0]);
    setIsModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingDebt(null);
    setNewCreditor("");
    setNewAmount(0);
    setNewAmountPaid(0);
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
          amountPaid: newAmountPaid,
          dueDate: newDueDate,
          monthlyPayment: newMonthly,
          status: editingDebt.status,
        });
      } else {
        await createDebt({
          creditor: newCreditor,
          amountOwed: newAmount,
          amountPaid: newAmountPaid,
          dueDate: newDueDate,
          monthlyPayment: newMonthly,
          status: "Pending",
        });
      }

      setIsModalVisible(false);
      setEditingDebt(null);
      setNewCreditor("");
      setNewAmount(0);
      setNewAmountPaid(0);
      setNewDueDate("");
      setNewMonthly(0);
    } catch (err) {
      console.error("Erreur lors de l'ajout/mise à jour de la dette", err);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.header}>
        <h1>{t("title")}</h1>
      </div>

      <div className={styles.debtSection}>
        <h2 className={styles.debtSectionTitle}>{t("debt")}</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : debts.length === 0 ? (
          <p className={styles.noDebt}>{t("noDebt")}</p>
        ) : (
          <div className={styles.debtList}>
            {debts.map((debt) => {
              const progress = 100 * (debt.amountPaid / debt.amountOwed);
              return (
                <div key={debt.debtId} className={styles.debtCard}>
                  <h4>{debt.creditor}</h4>
                  <p>Total Amount: ${debt.amountOwed.toFixed(2)}</p>
                  <p>Remaining Amount: ${(debt.amountOwed - debt.amountPaid).toFixed(2)}</p>
                  <p>
                    Progress:{" "}
                    <span className={styles.progress}>
                      {progress.toFixed(2)}%
                    </span>
                  </p>
                  <p>Due Date: {new Date(debt.dueDate).toLocaleDateString()}</p>
                  <div className={styles.debtActions}>
                    <button onClick={() => openEditModal(debt)}>✏️</button>
                    <button onClick={() => deleteDebt(debt.debtId)}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button className={styles.addDebtBtn} onClick={openCreateModal}>
          +
        </button>
      </div>

      {isModalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              {editingDebt ? t("editDebt") : t("addDebt")}
            </h3>

            <label className={styles.modalLabel}>{t("debtNameLabel")}</label>
            <input
              type="text"
              value={newCreditor}
              onChange={(e) => setNewCreditor(e.target.value)}
              className={styles.modalInput}
            />

            <label className={styles.modalLabel}>{t("totalAmountLabel")}</label>
            <input
              type="number"
              min={0}
              placeholder={t("totalAmountPlaceholder") as string}
              value={newAmount}
              onChange={(e) => setNewAmount(Math.max(0, Number(e.target.value)))}
              className={styles.modalInput}
            />

            <label className={styles.modalLabel}>{t("amountPaidLabel")}</label>
            <input
              type="number"
              min={0}
              placeholder={t("amountPaidPlaceholder") as string}
              value={newAmountPaid}
              onChange={(e) => setNewAmountPaid(Math.max(0, Number(e.target.value)))}
              className={styles.modalInput}
            />

            <label className={styles.modalLabel}>{t("monthlyAmountLabel")}</label>
            <input
              type="number"
              min={0}
              placeholder={t("monthlyAmountPlaceholder") as string}
              value={newMonthly}
              onChange={(e) => setNewMonthly(Math.max(0, Number(e.target.value)))}
              className={styles.modalInput}
            />

            <label className={styles.modalLabel}>{t("dueDateLabel")}</label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className={styles.modalInput}
            />

            <div className={styles.modalButtons}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingDebt(null);
                }}
              >
                {t("cancel")}
              </button>
              <button className={styles.confirmBtn} onClick={handleSubmit}>
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
