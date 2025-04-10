import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useBudgetContext } from "../../context/BudgetContext";
import useCategories from "../../hooks/useCategories";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { updateCategoryForUser, deleteCategoryForUser } from "../../services/categoryService";
import styles from "./BudgetingPage.module.css";
import { FaChevronLeft, FaChevronRight, FaEllipsisV } from "react-icons/fa";

function chunkArray<T>(arr: T[], size: number): T[][] {
  if (!arr || arr.length === 0) {
    return [[]];
  }
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

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

  // Sauvegarder l'ordre des catégories lors du chargement initial ou quand de nouvelles catégories sont ajoutées
  useEffect(() => {
    // Mise à jour de l'ordre uniquement si nous avons de nouvelles catégories
    if (categories.length >= categoryOrder.length) {
      // Conserver l'ordre existant et ajouter les nouvelles catégories à la fin
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
      
      // Si une catégorie n'est pas dans l'ordre (nouvelle), la mettre à la fin
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

  // Pagination for expenses - using sorted categories to maintain order
  const expenseCategories = sortCategoriesByOrder(categories.filter((c) => c.type === "EXPENSE"));
  const expensePages = chunkArray(expenseCategories, 8);
  const [expensePageIndex, setExpensePageIndex] = useState(0);

  // Make sure the page index is valid when categories change
  useEffect(() => {
    if (expensePageIndex >= expensePages.length && expensePages.length > 0) {
      setExpensePageIndex(expensePages.length - 1);
    }
  }, [expenseCategories.length, expensePages.length, expensePageIndex]);

  const prevExpensePage = () => {
    if (expensePageIndex > 0) setExpensePageIndex(expensePageIndex - 1);
  };
  const nextExpensePage = () => {
    if (expensePageIndex < expensePages.length - 1) setExpensePageIndex(expensePageIndex + 1);
  };

  // Pagination for income - using sorted categories to maintain order
  const incomeCategories = sortCategoriesByOrder(categories.filter((c) => c.type === "INCOME"));
  const incomePages = chunkArray(incomeCategories, 8);
  const [incomePageIndex, setIncomePageIndex] = useState(0);

  // Make sure the page index is valid when categories change
  useEffect(() => {
    if (incomePageIndex >= incomePages.length && incomePages.length > 0) {
      setIncomePageIndex(incomePages.length - 1);
    }
  }, [incomeCategories.length, incomePages.length, incomePageIndex]);

  const prevIncomePage = () => {
    if (incomePageIndex > 0) setIncomePageIndex(incomePageIndex - 1);
  };
  const nextIncomePage = () => {
    if (incomePageIndex < incomePages.length - 1) setIncomePageIndex(incomePageIndex + 1);
  };

  // Edit/Delete functionality
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

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
    await fetchCategories();
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!user) return;
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette catégorie ?");
    if (!confirmed) return;

    const token = await getAccessTokenSilently();
    if (!user.sub) throw new Error("User ID is undefined");

    // Mettre à jour l'ordre des catégories en supprimant celle qui est supprimée
    const updatedOrder = categoryOrder.filter(id => id !== cat.categoryId);
    setCategoryOrder(updatedOrder);

    await deleteCategoryForUser(user.sub, cat.categoryId, token);
    await fetchCategories();
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view this page.</div>;

  return (
    <div className={styles.budgetingContainer}>
      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>{t("header.title")}</h1>

        <div className={styles.monthSelector}>
          <button onClick={previousMonth} className={styles.monthButton}>
            <FaChevronLeft />
          </button>
          <span className={styles.monthText}>{formattedMonth}</span>
          <button onClick={nextMonth} className={styles.monthButton}>
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.headerStats}>
          <p className={styles.headerIncomeExpenses}>
            <span className={styles.income}>${totalIncome.toFixed(2)}</span>
            <span className={styles.separator}>|</span>
            <span className={styles.expenses}>${totalExpense.toFixed(2)}</span>
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

      {/* Categories Container */}
      <div className={styles.categoriesContainer}>
        {/* Expenses Section */}
        <div>
          <h2 className={`${styles.categoryTitle} ${styles.expensesTitle}`}>
            {t("categories.expenses")}
          </h2>
          
          <div className={styles.carouselContainer}>
            <div className={styles.pageNavigationWrapper}>
              <button 
                onClick={prevExpensePage} 
                className={`${styles.arrowButton} ${expensePageIndex === 0 ? styles.disabled : ''}`}
                disabled={expensePageIndex === 0}
              >
                <FaChevronLeft />
              </button>
              
              <div className={styles.carouselWrapper}>
                <div className={styles.carouselTrack} style={{
                  transform: `translateX(-${expensePageIndex * 100}%)`
                }}>
                  {expensePages.map((page, pageIdx) => (
                    <div key={`expense-page-${pageIdx}`} className={styles.carouselPage}>
                      {page.map((cat) => (
                        <div key={cat.categoryId} className={styles.categoryCard}>
                          <div className={styles.cardContent}>
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
                          </div>

                          <div className={styles.cardMenu}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenFor(menuOpenFor === cat.categoryId ? null : cat.categoryId);
                              }}
                              className={styles.threeDotButton}
                            >
                              <FaEllipsisV />
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
                      
                      {/* Ajout du bouton "+" uniquement à la dernière page */}
                      {pageIdx === expensePages.length - 1 && (
                        <button
                          onClick={() => setIsExpenseModalVisible(true)}
                          className={styles.addCategoryButton}
                        >
                          <span className={styles.addIcon}>+</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={nextExpensePage} 
                className={`${styles.arrowButton} ${expensePageIndex >= expensePages.length - 1 ? styles.disabled : ''}`}
                disabled={expensePageIndex >= expensePages.length - 1}
              >
                <FaChevronRight />
              </button>
            </div>
            
            {expensePages.length > 1 && (
              <div className={styles.paginationDots}>
                {expensePages.map((_, idx) => (
                  <button
                    key={`expense-dot-${idx}`}
                    className={`${styles.paginationDot} ${expensePageIndex === idx ? styles.activeDot : ''}`}
                    onClick={() => setExpensePageIndex(idx)}
                    aria-label={`Page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Income Section */}
        <div>
          <h2 className={`${styles.categoryTitle} ${styles.incomeTitle}`}>
            {t("categories.income")}
          </h2>
          
          <div className={styles.carouselContainer}>
            <div className={styles.pageNavigationWrapper}>
              <button 
                onClick={prevIncomePage} 
                className={`${styles.arrowButton} ${incomePageIndex === 0 ? styles.disabled : ''}`}
                disabled={incomePageIndex === 0}
              >
                <FaChevronLeft />
              </button>
              
              <div className={styles.carouselWrapper}>
                <div className={styles.carouselTrack} style={{
                  transform: `translateX(-${incomePageIndex * 100}%)`
                }}>
                  {incomePages.map((page, pageIdx) => (
                    <div key={`income-page-${pageIdx}`} className={styles.carouselPage}>
                      {page.map((cat) => (
                        <div key={cat.categoryId} className={styles.categoryCard}>
                          <div className={styles.cardContent}>
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
                          </div>

                          <div className={styles.cardMenu}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenFor(menuOpenFor === cat.categoryId ? null : cat.categoryId);
                              }}
                              className={styles.threeDotButton}
                            >
                              <FaEllipsisV />
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
                      
                      {/* Ajout du bouton "+" uniquement à la dernière page */}
                      {pageIdx === incomePages.length - 1 && (
                        <button
                          onClick={() => setIsIncomeModalVisible(true)}
                          className={styles.addCategoryButton}
                        >
                          <span className={styles.addIcon}>+</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={nextIncomePage} 
                className={`${styles.arrowButton} ${incomePageIndex >= incomePages.length - 1 ? styles.disabled : ''}`}
                disabled={incomePageIndex >= incomePages.length - 1}
              >
                <FaChevronRight />
              </button>
            </div>
            
            {incomePages.length > 1 && (
              <div className={styles.paginationDots}>
                {incomePages.map((_, idx) => (
                  <button
                    key={`income-dot-${idx}`}
                    className={`${styles.paginationDot} ${incomePageIndex === idx ? styles.activeDot : ''}`}
                    onClick={() => setIncomePageIndex(idx)}
                    aria-label={`Page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
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
              <button
                onClick={handleSaveEdit}
                className={`${styles.modalBtn} ${styles.addBtn}`}
              >
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