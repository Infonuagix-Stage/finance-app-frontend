import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import useCategories from "../../hooks/useCategories";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BudgetHeader from "../features/Budgeting/budgetingComponents/BudgetHeader";
import CategorySection from "../features/Budgeting/budgetingComponents/CategorySection";
import CategoryModal from "../features/Budgeting/modals/CategoryModal";
import { chunkArray } from "../features/Budgeting/utils/budgetingUtils";
import styles from "./BudgetingPage.module.css";

interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "INCOME" | "EXPENSE";
}

const BudgetingPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { setTotalIncome, setTotalExpense, setGlobalBalance } = useBudgetContext();
  const { t } = useTranslation("budgeting");

  const location = useLocation();
  const state = location.state as { year?: number; month?: number } | null;
  const [currentDate, setCurrentDate] = useState(() => {
    if (state?.year && state?.month) {
      return new Date(state.year, state.month - 1);
    }
    return new Date();
  });

  // État pour conserver l'ordre des catégories
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const formattedMonth = capitalize(
    currentDate.toLocaleString(i18n.language, {
      month: "long",
      year: "numeric",
    })
  );

  const userId = user?.sub || "";
  const {
    categories,
    totalsMap,
    newExpenseCategoryName,
    setNewExpenseCategoryName,
    newExpenseCategoryDesc,
    setNewExpenseCategoryDesc,
    newIncomeCategoryName,
    setNewIncomeCategoryName,
    newIncomeCategoryDesc,
    setNewIncomeCategoryDesc,
    addCategory,
    isExpenseModalVisible,
    setIsExpenseModalVisible,
    isIncomeModalVisible,
    setIsIncomeModalVisible,
    fetchCategories,
  } = useCategories(userId, currentDate);

  // Sauvegarder l'ordre des catégories lors du chargement initial
  useEffect(() => {
    if (categories.length >= categoryOrder.length) {
      const existingIds = new Set(categoryOrder);
      const updatedOrder = [...categoryOrder];
      
      categories.forEach(cat => {
        if (!existingIds.has(cat.categoryId)) {
          updatedOrder.push(cat.categoryId);
        }
      });
      
      setCategoryOrder(updatedOrder);
    }
  }, [categories]);

  // Fonction pour trier les catégories selon l'ordre mémorisé
  const sortCategoriesByOrder = (cats: Category[]) => {
    if (categoryOrder.length === 0) return cats;
    
    const sortedCats = [...cats];
    sortedCats.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.categoryId);
      const indexB = categoryOrder.indexOf(b.categoryId);
      
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      return indexA - indexB;
    });
    
    return sortedCats;
  };

  const totalIncome = categories.reduce(
    (acc, cat) => (cat.type === "INCOME" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );
  const totalExpense = categories.reduce(
    (acc, cat) => (cat.type === "EXPENSE" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );
  const globalBalance = totalIncome - totalExpense;

  useEffect(() => {
    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
    setGlobalBalance(globalBalance);
  }, [totalIncome, totalExpense, globalBalance, setTotalIncome, setTotalExpense, setGlobalBalance]);

  // Catégories triées
  const expenseCategories = sortCategoriesByOrder(categories.filter((c) => c.type === "EXPENSE"));
  const incomeCategories = sortCategoriesByOrder(categories.filter((c) => c.type === "INCOME"));

  // Pagination pour les dépenses
  const expensePages = chunkArray(expenseCategories, 8);
  const [expensePageIndex, setExpensePageIndex] = useState(0);

  // Pagination pour les revenus
  const incomePages = chunkArray(incomeCategories, 8);
  const [incomePageIndex, setIncomePageIndex] = useState(0);

  // Mettre à jour les indices de page si nécessaire
  useEffect(() => {
    if (expensePageIndex >= expensePages.length && expensePages.length > 0) {
      setExpensePageIndex(expensePages.length - 1);
    }
    if (incomePageIndex >= incomePages.length && incomePages.length > 0) {
      setIncomePageIndex(incomePages.length - 1);
    }
  }, [expensePages.length, incomePages.length, expensePageIndex, incomePageIndex]);

  // Gestionnaires de pagination
  const prevExpensePage = () => {
    if (expensePageIndex > 0) setExpensePageIndex(expensePageIndex - 1);
  };
  const nextExpensePage = () => {
    if (expensePageIndex < expensePages.length - 1) setExpensePageIndex(expensePageIndex + 1);
  };
  const prevIncomePage = () => {
    if (incomePageIndex > 0) setIncomePageIndex(incomePageIndex - 1);
  };
  const nextIncomePage = () => {
    if (incomePageIndex < incomePages.length - 1) setIncomePageIndex(incomePageIndex + 1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view this page.</div>;

  return (
    <div className={styles.budgetingContainer}>
      {/* Header avec titre, sélecteur de mois et statistiques */}
      <BudgetHeader 
        currentDate={currentDate}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        globalBalance={globalBalance}
      />

      {/* Container des catégories */}
      <div className={styles.categoriesContainer}>
        {/* Section des dépenses */}
        <CategorySection 
          title={t("categories.expenses")}
          type="EXPENSE"
          pages={expensePages}
          pageIndex={expensePageIndex}
          prevPage={prevExpensePage}
          nextPage={nextExpensePage}
          setPageIndex={setExpensePageIndex}
          onAddClick={() => setIsExpenseModalVisible(true)}
          currentDate={currentDate}
          totalsMap={totalsMap}
          fetchCategories={fetchCategories}
        />

        {/* Section des revenus */}
        <CategorySection 
          title={t("categories.income")}
          type="INCOME"
          pages={incomePages}
          pageIndex={incomePageIndex}
          prevPage={prevIncomePage}
          nextPage={nextIncomePage}
          setPageIndex={setIncomePageIndex}
          onAddClick={() => setIsIncomeModalVisible(true)}
          currentDate={currentDate}
          totalsMap={totalsMap}
          fetchCategories={fetchCategories}
        />
      </div>

      {/* Modal pour ajouter une catégorie de dépense */}
      <CategoryModal
        isVisible={isExpenseModalVisible}
        onClose={() => setIsExpenseModalVisible(false)}
        type="EXPENSE"
        title={t("modals.addExpense")}
        categoryName={newExpenseCategoryName}
        setName={setNewExpenseCategoryName}
        description={newExpenseCategoryDesc}
        setDescription={setNewExpenseCategoryDesc}
        onAdd={() => {
          addCategory("EXPENSE");
          setIsExpenseModalVisible(false);
        }}
      />

      {/* Modal pour ajouter une catégorie de revenu */}
      <CategoryModal
        isVisible={isIncomeModalVisible}
        onClose={() => setIsIncomeModalVisible(false)}
        type="INCOME"
        title={t("modals.addIncome")}
        categoryName={newIncomeCategoryName}
        setName={setNewIncomeCategoryName}
        description={newIncomeCategoryDesc}
        setDescription={setNewIncomeCategoryDesc}
        onAdd={() => {
          addCategory("INCOME");
          setIsIncomeModalVisible(false);
        }}
      />
    </div>
  );
};

export default BudgetingPage;