import React, { useState, ChangeEvent } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ChevronLeft, Edit, Trash2, Plus } from "lucide-react";
import useRecords from "../../hooks/useRecords";
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

  const [showAddModal, setShowAddModal] = useState(false);
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

  const formatMonth = (date: Date): string => {
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const handleAddRecord = () => {
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
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;
    
    handleEditRecord(
      editingRecord.expenseId ?? editingRecord.incomeId ?? "",
      editingRecord
    );
    setEditingRecord(null);
  };

  return (
    <div className={styles.categoryPageContainer}>
      <Link
        to="/budgeting"
        state={{ year: initialYear, month: initialMonth }}
        className={styles.backLink}
      >
        <ChevronLeft size={18} />
        Retour
      </Link>

      {/* Header avec titre et totaux */}
      <div className={styles.categoryHeader}>
        <h1 className={`${styles.categoryName} ${
          categoryType === "INCOME" ? styles.incomeName : styles.expenseName}`}>
          {categoryName}
        </h1>
        <div className={styles.monthDisplay}>{formatMonth(currentDate)}</div>
        
        <div className={styles.categoryTotal}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={`${styles.totalAmount} ${
            categoryType === "INCOME" ? styles.incomeAmount : styles.expenseAmount}`}>
            ${Math.abs(currentTotal ?? 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tableau des transactions */}
      <div className={styles.recordsContainer}>
        {filteredRecords.length > 0 ? (
          <>
            <div className={styles.tableHeader}>
              <table className={styles.recordsTable}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Actions</th>
                    {/* Bouton d'ajout dans l'en-tête du tableau */}
                    <th style={{ width: '1%' }}>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className={`${styles.tableAddButton} ${
                          categoryType === "INCOME" ? styles.incomeTableButton : styles.expenseTableButton
                        }`}
                      >
                        <Plus size={14} />
                        Ajouter
                      </button>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            
            <table className={styles.recordsTable}>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr 
                    key={record.expenseId || record.incomeId} 
                    className={styles.recordRow}
                  >
                    <td className={styles.recordDescription}>
                      {record.description || "Sans description"}
                    </td>
                    <td className={`${styles.recordAmount} ${
                        categoryType === "INCOME" ? styles.incomeAmount : styles.expenseAmount}`}>
                        ${record.amount.toFixed(2)}
                    </td>
                    <td>
                      <div className={styles.recordActions}>
                        <button 
                          onClick={() => setEditingRecord({ ...record })}
                          className={`${styles.actionButton} ${styles.editButton}`}
                          aria-label="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => 
                            handleDeleteRecord(
                              categoryType === "INCOME" 
                                ? record.incomeId! 
                                : record.expenseId!
                            )
                          }
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          aria-label="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className={styles.noRecords}>
            <p>Aucune transaction trouvée pour cette période.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className={`${styles.emptyStateAddButton} ${
                categoryType === "INCOME" ? styles.incomeEmptyButton : styles.expenseEmptyButton
              }`}
            >
              Ajouter une transaction
            </button>
          </div>
        )}
      </div>

      {/* Bouton d'ajout flottant (toujours présent) */}
      <div className={styles.addButtonContainer}>
        <button 
          onClick={() => setShowAddModal(true)}
          className={`${styles.addButton} ${
            categoryType === "INCOME" ? styles.incomeButton : styles.expenseButton
          }`}
          aria-label="Ajouter une transaction"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              Ajouter {categoryType === "INCOME" ? "un revenu" : "une dépense"}
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
              placeholder="Montant"
              value={newRecord.amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewRecord({ ...newRecord, amount: e.target.value })
              }
              className={styles.inputField}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowAddModal(false)}
                className={styles.cancelButton}
              >
                Annuler
              </button>
              <button
                onClick={handleAddRecord}
                className={`${styles.confirmButton} ${
                  categoryType === "INCOME" ? styles.incomeConfirmButton : styles.expenseConfirmButton
                }`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingRecord && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Modifier la transaction</h2>
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
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                className={`${styles.confirmButton} ${
                  categoryType === "INCOME" ? styles.incomeConfirmButton : styles.expenseConfirmButton
                }`}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;