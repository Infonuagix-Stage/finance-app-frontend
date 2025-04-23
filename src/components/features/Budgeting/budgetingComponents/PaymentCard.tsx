import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import styles from "./PaymentCard.module.css";

// Interfaces
export interface DebtItem {
  debtId: string;
  creditor: string;
  amountOwed: number;
  amountPaid: number;
  dueDate: string;
  monthlyPayment: number;
  status: string;
}

export interface ProjectItem {
  projectId: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  priority: string;
  monthlyContribution?: number;
}

type PaymentItem = DebtItem | ProjectItem;

interface PaymentCardProps {
  item: PaymentItem;
  itemType: "DEBT" | "PROJECT";
  currentDate: Date;
  onEditClick: (item: PaymentItem) => void;
  onDeleteClick: (itemId: string) => Promise<void>;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  item,
  itemType,
  currentDate,
  onEditClick,
  onDeleteClick,
}) => {
  const { t } = useTranslation("budgeting");
  const [menuOpen, setMenuOpen] = useState(false);

  const isDebt = itemType === "DEBT";
  const debtItem = isDebt ? (item as DebtItem) : null;
  const projectItem = !isDebt ? (item as ProjectItem) : null;

  // Calculer le progrès
  const progress = isDebt
    ? Math.round((debtItem!.amountPaid / debtItem!.amountOwed) * 100)
    : Math.round((projectItem!.savedAmount / projectItem!.targetAmount) * 100);

  // Montant mensuel
  const monthlyAmount = isDebt
    ? debtItem!.monthlyPayment
    : projectItem!.monthlyContribution || 0;

  // Formater la date d'échéance
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // ID pour les opérations
  const itemId = isDebt ? debtItem!.debtId : projectItem!.projectId;
  
  // Nom à afficher
  const itemName = isDebt ? debtItem!.creditor : projectItem!.name;

  const handleDelete = async () => {
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer ${isDebt ? "cette dette" : "ce projet"} ?`);
    if (!confirmed) return;
    await onDeleteClick(itemId);
  };

  return (
    <div className={`${styles.paymentCard} ${isDebt ? styles.debtCard : styles.projectCard}`}>
      <div className={styles.cardContent}>
        <Link
          to={`/${isDebt ? "debt" : "project"}/${encodeURIComponent(itemName)}`}
          state={{
            itemName,
            itemId,
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
          }}
        >
          <h4 className={styles.paymentName}>{itemName}</h4>
          
          {isDebt ? (
            <div className={styles.paymentDetails}>
              <p className={styles.paymentAmount}>
                {t("debts.remaining", "Reste")}: ${(debtItem!.amountOwed - debtItem!.amountPaid).toFixed(2)}
              </p>
              <p className={styles.paymentDueDate}>
                {t("dueDate", "Échéance")}: {formatDate(debtItem!.dueDate)}
              </p>
            </div>
          ) : (
            <div className={styles.paymentDetails}>
              <p className={styles.paymentAmount}>
                {t("projects.progress", "Progression")}: ${projectItem!.savedAmount.toFixed(2)} / ${projectItem!.targetAmount.toFixed(2)}
              </p>
              <p className={styles.paymentPriority} style={{ 
                color: projectItem!.priority === "HIGH" ? "#f56565" : 
                       projectItem!.priority === "MEDIUM" ? "#f6ad55" : "#68d391" 
              }}>
                {t(`projects.priority.${projectItem!.priority.toLowerCase()}`, projectItem!.priority)}
              </p>
            </div>
          )}
          
          <div className={styles.monthlyAmount}>
            {t("monthlyContribution", "Mensuel")}: ${monthlyAmount.toFixed(2)}
          </div>
          
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar} 
              style={{ 
                width: `${progress}%`,
                background: isDebt 
                  ? "linear-gradient(to right, #f56565, #dd6b20)" 
                  : "linear-gradient(to right, #667eea, #764ba2)"
              }}
            ></div>
            <span className={styles.progressText}>{progress}%</span>
          </div>
        </Link>
      </div>

      <div className={styles.cardMenu}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className={styles.threeDotButton}
        >
          <FaEllipsisV />
        </button>
        {menuOpen && (
          <div className={styles.threeDotMenu}>
            <button
              className={styles.menuItem}
              onClick={() => {
                setMenuOpen(false);
                onEditClick(item);
              }}
            >
              Modifier
            </button>
            <button
              className={`${styles.menuItem} ${styles.deleteItem}`}
              onClick={() => {
                setMenuOpen(false);
                handleDelete();
              }}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCard;