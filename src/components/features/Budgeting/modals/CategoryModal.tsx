import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./CategoryModal.module.css";

interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  type: "INCOME" | "EXPENSE";
  title: string;
  categoryName: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  onAdd: () => void;
  isEditing?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isVisible,
  onClose,
  type,
  title,
  categoryName,
  setName,
  description,
  setDescription,
  onAdd,
  isEditing = false,
}) => {
  const { t } = useTranslation("budgeting");

  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <input
          type="text"
          placeholder={t("modals.name") || "Name"}
          value={categoryName}
          onChange={(e) => setName(e.target.value)}
          className={styles.modalInput}
        />
        <textarea
          placeholder={t("modals.description") || "Description"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.modalTextarea}
        />
        <div className={styles.modalButtons}>
          <button
            onClick={onClose}
            className={`${styles.modalBtn} ${styles.cancelBtn}`}
          >
            {t("modals.cancel")}
          </button>
          <button
            onClick={onAdd}
            className={`${styles.modalBtn} ${styles.addBtn}`}
          >
            {isEditing ? t("modals.save") : t("modals.add")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;