import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import useCategories from "../../hooks/useCategories";
import { useTranslation } from "react-i18next";
import { updateCategoryForUser, deleteCategoryForUser } from "../../services/categoryService";
import styles from "./BudgetingPage.module.css";

interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "INCOME" | "EXPENSE";
}

const BudgetingPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
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

  // Navigation du mois
  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const formattedMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Récupère les catégories via le hook
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

  // État pour le modal d’édition
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setEditName("");
    setEditDesc("");
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !user) return;
    const token = await getAccessTokenSilently();
    if (!user.sub) return;

    await updateCategoryForUser(
      user.sub,
      editingCategory.categoryId,
      { name: editName, description: editDesc },
      token
    );
    closeEditModal();
    await fetchCategories(); // rafraîchit la liste
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!user) return;
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette catégorie ?");
    if (!confirmed) return;

    const token = await getAccessTokenSilently();
    if (!user.sub) throw new Error("User ID is undefined");

    await deleteCategoryForUser(user.sub, cat.categoryId, token);
    await fetchCategories(); // rafraîchit la liste
  };

  // Calcul des totaux
  const totalIncome = categories.reduce(
    (acc, cat) => (cat.type === "INCOME" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );
  const totalExpense = categories.reduce(
    (acc, cat) => (cat.type === "EXPENSE" ? acc + (totalsMap[cat.categoryId] || 0) : acc),
    0
  );
  const globalBalance = totalIncome - totalExpense;

  // Mise à jour du contexte Budget
  useEffect(() => {
    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
    setGlobalBalance(globalBalance);
  }, [totalIncome, totalExpense, globalBalance, setTotalIncome, setTotalExpense, setGlobalBalance]);

  // GESTION DU MENU 3 POINTS
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  // Ferme le menu si on clique ailleurs
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenFor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (catId: string) => {
    setMenuOpenFor((prev) => (prev === catId ? null : catId));
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view this page.</div>;

  return (
    <div className={styles.budgetingContainer}>
      {/* Sélecteur de mois */}
      <div className={styles.monthSelector}>
        <button onClick={previousMonth} className={styles.monthButton}>
          {"<"}
        </button>
        <span className={styles.monthText}>{formattedMonth}</span>
        <button onClick={nextMonth} className={styles.monthButton}>
          {">"}
        </button>
      </div>

      {/* Header principal */}
      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>{t("header.title")}</h1>
        <div className={styles.headerStats}>
          <p className={styles.headerIncomeExpenses}>
            <span className={styles.income}>
              {t("header.income")}: ${totalIncome.toFixed(2)}
            </span>
            {" | "}
            <span className={styles.expenses}>
              {t("header.expenses")}: ${totalExpense.toFixed(2)}
            </span>
          </p>
          <p
            className={`${styles.balance} ${
              globalBalance >= 0 ? styles.positive : styles.negative
            }`}
          >
            {t("header.balance")}: ${globalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Liste des catégories */}
      <div className={styles.categoriesContainer}>
        {/* PARTIE DÉPENSES */}
        <div>
          <h2 className={`${styles.categoryTitle} ${styles.expensesTitle}`}>
            {t("categories.expenses")}
          </h2>
          <div className={styles.categoryList}>
            {categories
              .filter((cat) => cat.type === "EXPENSE")
              .map((cat) => (
                <div key={cat.categoryId} className={styles.categoryCard}>
                  <Link
                    to={`/category/${encodeURIComponent(cat.name)}`}
                    state={{
                      categoryName: cat.name,
                      categoryId: cat.categoryId,
                      categoryType: cat.type,
                      year: currentDate.getFullYear(),
                      month: currentDate.getMonth() + 1,
                    }}
                  >
                    <h4 className={styles.categoryName}>{cat.name}</h4>
                    <p className={styles.categoryTotal}>
                      {t("categories.total")}: ${totalsMap[cat.categoryId] || 0}
                    </p>
                  </Link>

                  {/* Bouton triple-points + menu */}
                  <div className={styles.categoryCardActions} ref={menuRef}>
                    <button
                      onClick={() => toggleMenu(cat.categoryId)}
                      className={styles.threeDotButton}
                    >
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                    </button>
                    {menuOpenFor === cat.categoryId && (
                      <div className={styles.threeDotMenu}>
                        <button
                          className={styles.menuItem}
                          onClick={() => {
                            setMenuOpenFor(null);
                            openEditModal(cat);
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          className={`${styles.menuItem} ${styles.deleteItem}`}
                          onClick={() => {
                            setMenuOpenFor(null);
                            handleDeleteCategory(cat);
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <button
              onClick={() => setIsExpenseModalVisible(true)}
              className={styles.addCategoryButton}
            >
              <span className={styles.addIcon}>+</span>
            </button>
          </div>
        </div>

        {/* PARTIE REVENUS */}
        <div>
          <h2 className={`${styles.categoryTitle} ${styles.incomeTitle}`}>
            {t("categories.income")}
          </h2>
          <div className={styles.categoryList}>
            {categories
              .filter((cat) => cat.type === "INCOME")
              .map((cat) => (
                <div key={cat.categoryId} className={styles.categoryCard}>
                  <Link
                    to={`/category/${encodeURIComponent(cat.name)}`}
                    state={{
                      categoryName: cat.name,
                      categoryId: cat.categoryId,
                      categoryType: cat.type,
                      year: currentDate.getFullYear(),
                      month: currentDate.getMonth() + 1,
                    }}
                  >
                    <h4 className={styles.categoryName}>{cat.name}</h4>
                    <p className={styles.categoryTotal}>
                      {t("categories.total")}: ${totalsMap[cat.categoryId] || 0}
                    </p>
                  </Link>

                  {/* Bouton triple-points + menu */}
                  <div className={styles.categoryCardActions} ref={menuRef}>
                    <button
                      onClick={() => toggleMenu(cat.categoryId)}
                      className={styles.threeDotButton}
                    >
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                    </button>
                    {menuOpenFor === cat.categoryId && (
                      <div className={styles.threeDotMenu}>
                        <button
                          className={styles.menuItem}
                          onClick={() => {
                            setMenuOpenFor(null);
                            openEditModal(cat);
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          className={`${styles.menuItem} ${styles.deleteItem}`}
                          onClick={() => {
                            setMenuOpenFor(null);
                            handleDeleteCategory(cat);
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <button
              onClick={() => setIsIncomeModalVisible(true)}
              className={styles.addCategoryButton}
            >
              <span className={styles.addIcon}>+</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL : Ajouter dépense */}
      {isExpenseModalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>{t("modals.addExpense")}</h3>
            <input
              type="text"
              placeholder={t("modals.name") || "Name"}
              value={newExpenseCategoryName}
              onChange={(e) => setNewExpenseCategoryName(e.target.value)}
              className={styles.modalInput}
            />
            <textarea
              placeholder={t("modals.description") || "Description"}
              value={newExpenseCategoryDesc}
              onChange={(e) => setNewExpenseCategoryDesc(e.target.value)}
              className={styles.modalTextarea}
            />
            <div className={styles.modalButtons}>
              <button
                onClick={() => setIsExpenseModalVisible(false)}
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
              >
                {t("modals.cancel")}
              </button>
              <button
                onClick={() => {
                  addCategory("EXPENSE");
                  setIsExpenseModalVisible(false);
                }}
                className={`${styles.modalBtn} ${styles.addBtn}`}
              >
                {t("modals.add")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Ajouter revenu */}
      {isIncomeModalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>{t("modals.addIncome")}</h3>
            <input
              type="text"
              placeholder={t("modals.name") || "Name"}
              value={newIncomeCategoryName}
              onChange={(e) => setNewIncomeCategoryName(e.target.value)}
              className={styles.modalInput}
            />
            <textarea
              placeholder={t("modals.description") || "Description"}
              value={newIncomeCategoryDesc}
              onChange={(e) => setNewIncomeCategoryDesc(e.target.value)}
              className={styles.modalTextarea}
            />
            <div className={styles.modalButtons}>
              <button
                onClick={() => setIsIncomeModalVisible(false)}
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
              >
                {t("modals.cancel")}
              </button>
              <button
                onClick={() => {
                  addCategory("INCOME");
                  setIsIncomeModalVisible(false);
                }}
                className={`${styles.modalBtn} ${styles.addBtn}`}
              >
                {t("modals.add")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Éditer catégorie */}
      {editingCategory && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>{t("modals.editCategory")}</h3>
            <input
              type="text"
              placeholder={t("modals.name") || "Name"}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className={styles.modalInput}
            />
            <textarea
              placeholder={t("modals.description") || "Description"}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className={styles.modalTextarea}
            />
            <div className={styles.modalButtons}>
              <button
                onClick={closeEditModal}
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
              >
                {t("modals.cancel")}
              </button>
              <button onClick={handleSaveEdit} className={`${styles.modalBtn} ${styles.addBtn}`}>
                {t("modals.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetingPage;
