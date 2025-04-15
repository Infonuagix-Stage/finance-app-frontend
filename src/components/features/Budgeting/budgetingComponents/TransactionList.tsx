import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import TransactionModal from "../modals/TransactionModal";
import styles from "./TransactionList.module.css";

interface TransactionRecord {
  expenseId?: string;
  incomeId?: string;
  description: string;
  amount: number;
  expenseDate?: string;
  incomeDate?: string;
}

interface TransactionsListProps {
  records: TransactionRecord[];
  categoryType: "INCOME" | "EXPENSE";
  onAddClick: () => void;
  onEditRecord: (id: string, record: TransactionRecord) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  records,
  categoryType,
  onAddClick,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [editingRecord, setEditingRecord] = useState<TransactionRecord | null>(null);

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    
    await onEditRecord(
      editingRecord.expenseId ?? editingRecord.incomeId ?? "",
      editingRecord
    );
    setEditingRecord(null);
  };

  const handleDelete = (recordId: string) => {
    onDeleteRecord(recordId);
  };

  return (
    <>
      <div className={styles.recordsContainer}>
        {records.length > 0 ? (
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
                        onClick={onAddClick}
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
                {records.map((record) => (
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
                            handleDelete(
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
              onClick={onAddClick}
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
          onClick={onAddClick}
          className={`${styles.addButton} ${
            categoryType === "INCOME" ? styles.incomeButton : styles.expenseButton
          }`}
          aria-label="Ajouter une transaction"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal d'édition */}
      {editingRecord && (
        <TransactionModal
          isVisible={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          title="Modifier la transaction"
          description={editingRecord.description}
          setDescription={(value: string) => setEditingRecord({ ...editingRecord, description: value })}
          amount={String(editingRecord.amount)}
          setAmount={(value: string) => setEditingRecord({
            ...editingRecord,
            amount: parseFloat(value) || 0
          })}
          onSave={handleSaveEdit}
          categoryType={categoryType}
          isEditing={true}
        />
      )}
    </>
  );
};

export default TransactionsList;