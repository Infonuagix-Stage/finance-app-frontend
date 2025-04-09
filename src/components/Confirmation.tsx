import React from "react";
import styles from "./Confirmation.module.css";

interface ConfirmationProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.confirmationOverlay}>
      <div className={styles.confirmationModal}>
        <h2 className={styles.confirmationTitle}>{title}</h2>
        <p className={styles.confirmationMessage}>{message}</p>
        <div className={styles.confirmationButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Annuler
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
