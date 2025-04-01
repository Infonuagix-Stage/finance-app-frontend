import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import useCategories from "../../hooks/useCategories";
import { useTranslation } from "react-i18next";
import './BudgetingPage.css';

// Define the structure of a category
interface Category {
  categoryId: string;
  name: string;
  type: "INCOME" | "EXPENSE";
}

const BudgetingPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { setTotalIncome, setTotalExpense, setGlobalBalance } = useBudgetContext();
  const { t } = useTranslation("budgeting");

  const userId = user?.sub ?? ""; // Ensure userId is always a string

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
  } = useCategories();

  const totalIncome = categories.reduce(
    (acc: number, cat: Category) => (cat.type === "INCOME" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );
  const totalExpense = categories.reduce(
    (acc: number, cat: Category) => (cat.type === "EXPENSE" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );
  const globalBalance = totalIncome - totalExpense;

  useEffect(() => {
    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
    setGlobalBalance(globalBalance);
  }, [totalIncome, totalExpense, globalBalance, setTotalIncome, setTotalExpense, setGlobalBalance]);

  if (isLoading) {
    return <div>{t("messages.loading")}</div>;
  }

  if (!isAuthenticated) {
    return <div>{t("messages.loginRequired")}</div>;
  }

  return (
    <div className="budgeting-container">
      {/* Header */}
      <div className="header-container">
        <h1 className="header-title">{t("header.title")}</h1>
        <div className="header-stats">
          <p className="header-income-expenses">
            <span className="income">{t("header.income")}: ${totalIncome.toFixed(2)}</span> |{" "}
            <span className="expenses">{t("header.expenses")}: ${totalExpense.toFixed(2)}</span>
          </p>
          <p className={`balance ${globalBalance >= 0 ? "positive" : "negative"}`}>
            {t("header.balance")}: ${globalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-container">
        {/* Expenses */}
        <div>
          <h2 className="category-title expenses-title">{t("categories.expenses")}</h2>
          <div className="category-list">
            {categories
              .filter((cat) => cat.type === "EXPENSE")
              .map((cat) => (
                <Link
                  key={cat.categoryId}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{ categoryName: cat.name, categoryId: cat.categoryId, categoryType: cat.type }}
                  className="category-card"
                >
                  <h4 className="category-name">{cat.name}</h4>
                  <p className="category-total">{t("categories.total")}: ${totalsMap[cat.categoryId] || 0}</p>
                </Link>
              ))}
            <button
              onClick={() => setIsExpenseModalVisible(true)}
              className="add-category-button"
            >
              <span className="add-icon">+</span>
            </button>
          </div>
        </div>

        {/* Income */}
        <div>
          <h2 className="category-title income-title">{t("categories.income")}</h2>
          <div className="category-list">
            {categories
              .filter((cat) => cat.type === "INCOME")
              .map((cat) => (
                <Link
                  key={cat.categoryId}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{ categoryName: cat.name, categoryId: cat.categoryId, categoryType: cat.type }}
                  className="category-card"
                >
                  <h4 className="category-name">{cat.name}</h4>
                  <p className="category-total">{t("categories.total")}: ${totalsMap[cat.categoryId] || 0}</p>
                </Link>
              ))}
            <button
              onClick={() => setIsIncomeModalVisible(true)}
              className="add-category-button"
            >
              <span className="add-icon">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetingPage;
