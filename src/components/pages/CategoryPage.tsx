import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ChevronLeft } from "lucide-react";
import useRecords from "../../hooks/useRecords";
import TransactionsList from "../features/Budgeting/budgetingComponents/TransactionList";
import TransactionModal from "../features/Budgeting/modals/TransactionModal";
import { toLocalISODate, formatMonth } from "../features/Budgeting/utils/budgetingUtils";
import styles from "./CategoryPage.module.css";

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

  // État local pour stocker le total calculé
  const [displayTotal, setDisplayTotal] = useState<number>(0);
  // État pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState<{
    description: string;
    amount: string;
  }>({
    description: "",
    amount: "",
  });
  
  useEffect(() => {
    setDisplayTotal(currentTotal ?? 0);
  }, [currentTotal, records]);

  const filteredRecords = records.filter((rec) => {
    const dateStr = rec.expenseDate || rec.incomeDate;
    if (!dateStr) return false;
    const [year, month] = dateStr.split("-").map(Number);
    return year === currentYear && month === currentMonth;
  });

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view this page.</div>;

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
            ${Math.abs(displayTotal).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Liste des transactions */}
      <TransactionsList 
        records={filteredRecords}
        categoryType={categoryType}
        onAddClick={() => setShowAddModal(true)}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* Modal d'ajout de transaction */}
      <TransactionModal
        isVisible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Ajouter ${categoryType === "INCOME" ? "un revenu" : "une dépense"}`}
        description={newRecord.description}
        setDescription={(value: string) => setNewRecord({ ...newRecord, description: value })}
        amount={newRecord.amount}
        setAmount={(value: string) => setNewRecord({ ...newRecord, amount: value })}
        onSave={handleAddRecord}
        categoryType={categoryType}
        isEditing={false}
      />
    </div>
  );
};

export default CategoryPage;