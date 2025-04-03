import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import useCategories from "../../hooks/useCategories";
import { useTranslation } from "react-i18next";
import "./BudgetingPage.css";
import { useLocation } from "react-router-dom";

// Define Category Type
interface Category {
  categoryId: string;
  name: string;
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

  const userId = user?.sub || "";

  
  // Navigation du mois (précédent/suivant)
  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const formattedMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Hook personnalisé pour gérer les catégories et états
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
  } = useCategories(userId, currentDate);

  // Calcul des totaux
  const totalIncome = categories.reduce(
    (acc: number, cat: Category) => (cat.type === "INCOME" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );

  const totalExpense = categories.reduce(
    (acc: number, cat: Category) => (cat.type === "EXPENSE" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );

  const globalBalance = totalIncome - totalExpense;

  // Mise à jour du contexte Budget (totalIncome, totalExpense, etc.)
  useEffect(() => {
    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
    setGlobalBalance(globalBalance);
  }, [totalIncome, totalExpense, globalBalance, setTotalIncome, setTotalExpense, setGlobalBalance]);

  if (isLoading) return <div>{t("messages.loading")}</div>;
  if (!isAuthenticated) return <div>{t("messages.loginRequired")}</div>;

  return (
    <div className="budgeting-container">
      
      {/* Sélecteur de mois */}
      <div className="month-selector">
        <button onClick={previousMonth} className="month-button">{"<"}</button>
        <span className="month-text">{formattedMonth}</span>
        <button onClick={nextMonth} className="month-button">{">"}</button>
      </div>

      {/* Header principal */}
      <div className="header-container">
        <h1 className="header-title">{t("header.title")}</h1>
        <div className="header-stats">
          <p className="header-income-expenses">
            <span className="income">
              {t("header.income")}: ${totalIncome.toFixed(2)}
            </span> 
            {" | "}
            <span className="expenses">
              {t("header.expenses")}: ${totalExpense.toFixed(2)}
            </span>
          </p>
          <p className={`balance ${globalBalance >= 0 ? "positive" : "negative"}`}>
            {t("header.balance")}: ${globalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Catégories */}
      <div className="categories-container">
        
        {/* Partie Dépenses */}
        <div>
          <h2 className="category-title expenses-title">{t("categories.expenses")}</h2>
          <div className="category-list">
            {categories
              .filter((cat) => cat.type === "EXPENSE")
              .map((cat) => (
                <Link
                  key={cat.categoryId}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{
                    categoryName: cat.name,
                    categoryId: cat.categoryId,
                    categoryType: cat.type,
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                  }}
                  className="category-card"
                >
                  <h4 className="category-name">{cat.name}</h4>
                  <p className="category-total">
                    {t("categories.total")}: ${totalsMap[cat.categoryId] || 0}
                  </p>
                </Link>
              ))}
            <button onClick={() => setIsExpenseModalVisible(true)} className="add-category-button">
              <span className="add-icon">+</span>
            </button>
          </div>
        </div>

        {/* Partie Revenus */}
        <div>
          <h2 className="category-title income-title">{t("categories.income")}</h2>
          <div className="category-list">
            {categories
              .filter((cat) => cat.type === "INCOME")
              .map((cat) => (
                <Link
                  key={cat.categoryId}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{
                    categoryName: cat.name,
                    categoryId: cat.categoryId,
                    categoryType: cat.type,
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                  }}
                  className="category-card"
                >
                  <h4 className="category-name">{cat.name}</h4>
                  <p className="category-total">
                    {t("categories.total")}: ${totalsMap[cat.categoryId] || 0}
                  </p>
                </Link>
              ))}
            <button onClick={() => setIsIncomeModalVisible(true)} className="add-category-button">
              <span className="add-icon">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* Modal "Dépenses"              */}
      {/* ============================== */}
      {isExpenseModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{t("modals.addExpense")}</h3>
            <input
              type="text"
              placeholder={t("modals.name") || "Name"}
              value={newExpenseCategoryName}
              onChange={(e) => setNewExpenseCategoryName(e.target.value)}
              className="modal-input"
            />
            <textarea
              placeholder={t("modals.description") || "Description"}
              value={newExpenseCategoryDesc}
              onChange={(e) => setNewExpenseCategoryDesc(e.target.value)}
              className="modal-textarea"
            />
            <div className="modal-buttons">
              <button
                onClick={() => setIsExpenseModalVisible(false)}
                className="modal-btn cancel-btn"
              >
                {t("modals.cancel")}
              </button>
              <button
                onClick={() => {
                  addCategory("EXPENSE");
                  setIsExpenseModalVisible(false);
                }}
                className="modal-btn add-btn"
              >
                {t("modals.add")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================== */}
      {/* Modal "Revenus"               */}
      {/* ============================== */}
      {isIncomeModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{t("modals.addIncome")}</h3>
            <input
              type="text"
              placeholder={t("modals.name") || "Name"}
              value={newIncomeCategoryName}
              onChange={(e) => setNewIncomeCategoryName(e.target.value)}
              className="modal-input"
            />
            <textarea
              placeholder={t("modals.description") || "Description"}
              value={newIncomeCategoryDesc}
              onChange={(e) => setNewIncomeCategoryDesc(e.target.value)}
              className="modal-textarea"
            />
            <div className="modal-buttons">
              <button
                onClick={() => setIsIncomeModalVisible(false)}
                className="modal-btn cancel-btn"
              >
                {t("modals.cancel")}
              </button>
              <button
                onClick={() => {
                  addCategory("INCOME");
                  setIsIncomeModalVisible(false);
                }}
                className="modal-btn add-btn"
              >
                {t("modals.add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetingPage;
