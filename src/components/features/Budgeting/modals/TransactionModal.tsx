import React from "react";
import styles from "./TransactionModal.module.css";

interface TransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  onSave: () => void;
  categoryType: "INCOME" | "EXPENSE";
  isEditing?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isVisible,
  onClose,
  title,
  description,
  setDescription,
  amount,
  setAmount,
  onSave,
  categoryType,
  isEditing = false,
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.inputField}
        />
        <div className={styles.modalActions}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className={`${styles.confirmButton} ${
              categoryType === "INCOME" ? styles.incomeConfirmButton : styles.expenseConfirmButton
            }`}
          >
            {isEditing ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;