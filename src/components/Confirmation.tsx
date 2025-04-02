import React from "react";
import "./Confirmation.css";

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
  if (!isOpen) return null; // Do not render if modal is closed

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <h2 className="confirmation-title">{title}</h2>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-buttons">
          <button className="cancel-button" onClick={onCancel}>
            Annuler
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
