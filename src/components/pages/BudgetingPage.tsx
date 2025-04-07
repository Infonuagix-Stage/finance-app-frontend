import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import useCategories from "../../hooks/useCategories";
import { useTranslation } from "react-i18next";
import { updateCategoryForUser, deleteCategoryForUser } from "../../services/categoryService";
import "./BudgetingPage.css";

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
    fetchCategories
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


  // =========
  // GESTION DU MENU 3 POINTS
  // =========
  // State pour savoir quel categoryId est en train d'ouvrir le menu
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

      {/* Liste des catégories */}
      <div className="categories-container">
        {/* PARTIE DÉPENSES */}
        <div>
          <h2 className="category-title expenses-title">{t("categories.expenses")}</h2>
          <div className="category-list">
            {categories
              .filter((cat) => cat.type === "EXPENSE")
              .map((cat) => (
                <div key={cat.categoryId} className="category-card">
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
                    <h4 className="category-name">{cat.name}</h4>
                    <p className="category-total">
                      {t("categories.total")}: ${totalsMap[cat.categoryId] || 0}
                    </p>
                  </Link>

                  {/* Bouton triple-points + menu */}
                  <div className="category-card-actions" ref={menuRef}>
                    <button
                      onClick={() => toggleMenu(cat.categoryId)}
                      className="three-dot-button"
                    >
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </button>
                    {menuOpenFor === cat.categoryId && (
                      <div className="three-dot-menu">
                        <button
                          className="menu-item"
                          onClick={() => {
                            setMenuOpenFor(null);
                            openEditModal(cat);
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          className="menu-item delete-item"
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
              className="add-category-button"
            >
              <span className="add-icon">+</span>
            </button>
          </div>
        </div>

        {/* PARTIE REVENUS */}
        <div>
          <h2 className="category-title income-title">{t("categories.income")}</h2>
          <div className="category-list">
            {categories
              .filter((cat) => cat.type === "INCOME")
              .map((cat) => (
                <div key={cat.categoryId} className="category-card">
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
                    <h4 className="category-name">{cat.name}</h4>
                    <p className="category-total">
                      {t("categories.total")}: ${totalsMap[cat.categoryId] || 0}
                    </p>
                  </Link>

                  {/* Bouton triple-points + menu */}
                  <div className="category-card-actions" ref={menuRef}>
                    <button
                      onClick={() => toggleMenu(cat.categoryId)}
                      className="three-dot-button"
                    >
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </button>
                    {menuOpenFor === cat.categoryId && (
                      <div className="three-dot-menu">
                        <button
                          className="menu-item"
                          onClick={() => {
                            setMenuOpenFor(null);
                            openEditModal(cat);
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          className="menu-item delete-item"
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
              className="add-category-button"
            >
              <span className="add-icon">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL : Ajouter dépense */}
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

      {/* MODAL : Ajouter revenu */}
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

      {/* MODAL : Éditer catégorie */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{t("modals.editCategory")}</h3>
            <input
              type="text"
              placeholder={t("modals.name") || "Name"}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="modal-input"
            />
            <textarea
              placeholder={t("modals.description") || "Description"}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="modal-textarea"
            />
            <div className="modal-buttons">
              <button onClick={closeEditModal} className="modal-btn cancel-btn">
                {t("modals.cancel")}
              </button>
              <button onClick={handleSaveEdit} className="modal-btn add-btn">
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
