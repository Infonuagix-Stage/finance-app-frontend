import React, { useState, ChangeEvent } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import RecordActions from "../RecordActions";
import useRecords from "../../hooks/useRecords";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./CategoryPage.module.css";

interface TransactionRecord {
  expenseId?: string;
  incomeId?: string;
  description: string;
  amount: number;
  expenseDate?: string;
  incomeDate?: string;
}

interface CategoryPageLocationState {
  categoryId?: string;
  categoryType?: "INCOME" | "EXPENSE";
  year?: number;
  month?: number;
}

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const location = useLocation();
  const state = location.state as CategoryPageLocationState | undefined;
  const { user, isAuthenticated, isLoading } = useAuth0();

  const userId: string = user?.sub ?? "";

  const { categoryId, year: initialYear, month: initialMonth } = state || {};
  const categoryType: "INCOME" | "EXPENSE" = state?.categoryType ?? "EXPENSE";

  const initialDate =
    initialYear && initialMonth
      ? new Date(initialYear, initialMonth - 1)
      : new Date();
  const [currentDate] = useState<Date>(initialDate);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const {
    records,
    currentTotal,
    addRecord,
    handleDeleteRecord,
    handleEditRecord,
  } = useRecords({
    userId,
    categoryId: categoryId ?? "",
    categoryType,
    year: currentYear,
    month: currentMonth,
  });

  const filteredRecords = records.filter((rec) => {
    const dateStr = rec.expenseDate || rec.incomeDate;
    if (!dateStr) return false;
    const [year, month] = dateStr.split("-").map(Number);
    return year === currentYear && month === currentMonth;
  });

  const [newRecord, setNewRecord] = useState<{
    description: string;
    amount: string;
  }>({
    description: "",
    amount: "",
  });

  const [editingRecord, setEditingRecord] = useState<TransactionRecord | null>(
    null
  );

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view this page.</div>;

  const toLocalISODate = (date: Date): string => {
    const tzoffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().split("T")[0];
  };

  return (
    <div className={styles.categoryPageContainer}>
      {/* Titre principal */}
      <h1 className={styles.categoryPageTitle}>
        Category: {categoryName} ({categoryType})
      </h1>

      {/* Lien de retour */}
      <div className={styles.backLinkWrapper}>
        <Link
          to="/budgeting"
          state={{ year: initialYear, month: initialMonth }}
          className={styles.backLink}
        >
          <ChevronLeft className={styles.icon} />
          Back to Budgeting
        </Link>
      </div>

      {/* Affichage du mois */}
      <div className={styles.monthDisplayWrapper}>
        <div className={styles.monthDisplayText}>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Encadré du total */}
      <div className={styles.totalCard}>
        <h2 className={styles.totalCardTitle}>Total</h2>
        <p className={styles.totalCardAmount}>
          ${(currentTotal ?? 0).toFixed(2)}
        </p>
      </div>

      {/* Formulaire pour ajouter une transaction */}
      <div className={styles.addRecordCard}>
        <h2 className={styles.addRecordTitle}>
          Add {categoryType === "INCOME" ? "Income" : "Expense"}
        </h2>
        <input
          type="text"
          placeholder="Description"
          value={newRecord.description}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewRecord({ ...newRecord, description: e.target.value })
          }
          className={styles.inputField}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newRecord.amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewRecord({ ...newRecord, amount: e.target.value })
          }
          className={styles.inputField}
        />
        <button
          onClick={() => {
            const recordData = {
              description: newRecord.description,
              amount: parseFloat(newRecord.amount),
              userId,
              categoryId,
              incomeDate:
                categoryType === "INCOME" ? toLocalISODate(currentDate) : undefined,
              expenseDate:
                categoryType === "EXPENSE" ? toLocalISODate(currentDate) : undefined,
            };
            addRecord(recordData);
            setNewRecord({ description: "", amount: "" });
          }}
          className={styles.addButton}
        >
          Add
        </button>
      </div>

      {/* Liste des transactions */}
      <div className={styles.recordsContainer}>
        <h2 className={styles.recordsTitle}>
          {categoryType === "INCOME" ? "Income" : "Expense"} List
        </h2>
        {filteredRecords.length > 0 ? (
          <ul className={styles.recordsList}>
            {filteredRecords.map((rec) => (
              <li key={rec.expenseId || rec.incomeId} className={styles.recordItem}>
                <div className={styles.recordInfo}>
                  <p className={styles.recordDescription}>
                    {rec.description ?? "No description"}
                  </p>
                  <p className={styles.recordAmount}>Amount: ${rec.amount}</p>
                </div>
                <RecordActions
                  onEdit={() => setEditingRecord({ ...rec })}
                  onDelete={() =>
                    handleDeleteRecord(
                      categoryType === "INCOME" ? rec.incomeId! : rec.expenseId!
                    )
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noRecords}>No records found.</p>
        )}
      </div>

      {/* Modal d'édition */}
      {editingRecord && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Edit Record</h2>
            <input
              type="text"
              value={editingRecord.description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditingRecord({ ...editingRecord, description: e.target.value })
              }
              className={styles.inputField}
            />
            <input
              type="number"
              value={editingRecord.amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditingRecord({ ...editingRecord, amount: parseFloat(e.target.value) })
              }
              className={styles.inputField}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setEditingRecord(null)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleEditRecord(
                    editingRecord.expenseId ?? editingRecord.incomeId ?? "",
                    editingRecord
                  );
                  setEditingRecord(null);
                }}
                className={styles.saveButton}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
