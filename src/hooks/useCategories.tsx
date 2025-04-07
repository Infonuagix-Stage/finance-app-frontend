import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCategoriesForUser, createCategoryForUser } from "../services/categoryService";
import { getCategoryTotal } from "../services/totalService";

interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "EXPENSE" | "INCOME";
}

type TotalsMap = Record<string, number>;

function useCategories(userId: string, currentDate: Date) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const { getAccessTokenSilently } = useAuth0();

  const [categories, setCategories] = useState<Category[]>([]);
  const [totalsMap, setTotalsMap] = useState<TotalsMap>({});

  const [newExpenseCategoryName, setNewExpenseCategoryName] = useState("");
  const [newExpenseCategoryDesc, setNewExpenseCategoryDesc] = useState("");
  const [newIncomeCategoryName, setNewIncomeCategoryName] = useState("");
  const [newIncomeCategoryDesc, setNewIncomeCategoryDesc] = useState("");

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  // ---- fetchCategories ----
  // Exportée pour pouvoir recharger dynamiquement sans reload la page
  const fetchCategories = async () => {
    try {
      const token = await getAccessTokenSilently();
      const fetchedCategories = await getCategoriesForUser(userId, token);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ---- useEffect initial ----
  // Charge les catégories au montage, quand userId ou date changent
  useEffect(() => {
    if (!userId || !currentYear || !currentMonth) return;
    fetchCategories();
  }, [userId, currentYear, currentMonth, getAccessTokenSilently]);

  // ---- fetchTotals ----
  // Calcule les totaux pour chaque catégorie
  const fetchTotals = async (updatedCategories: Category[]) => {
    try {
      const token = await getAccessTokenSilently();
      const newTotalsMap: TotalsMap = {};

      await Promise.all(
        updatedCategories.map(async (cat) => {
          try {
            const total = await getCategoryTotal(
              {
                userId,
                categoryId: cat.categoryId,
                type: cat.type,
                year: currentYear,
                month: currentMonth,
              },
              token
            );
            newTotalsMap[cat.categoryId] = total;
          } catch {
            newTotalsMap[cat.categoryId] = 0;
          }
        })
      );

      setTotalsMap(newTotalsMap);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  // ---- useEffect pour mettre à jour les totaux quand les catégories changent ----
  useEffect(() => {
    if (!userId || categories.length === 0 || !currentYear || !currentMonth) return;
    fetchTotals(categories);
  }, [userId, categories, currentYear, currentMonth]);

  // ---- addCategory ----
  // Ajoute une nouvelle catégorie (INCOME ou EXPENSE)
  const addCategory = async (type: "EXPENSE" | "INCOME") => {
    const name = type === "EXPENSE" ? newExpenseCategoryName : newIncomeCategoryName;
    const desc = type === "EXPENSE" ? newExpenseCategoryDesc : newIncomeCategoryDesc;

    if (!name.trim()) return;

    try {
      const token = await getAccessTokenSilently();
      const categoryData = { name, description: desc, type };
      const created = await createCategoryForUser(userId, categoryData, token);

      // On l'insère dans le tableau existant
      setCategories((prev) => [...prev, created]);

      // Reset du formulaire
      if (type === "EXPENSE") {
        setNewExpenseCategoryName("");
        setNewExpenseCategoryDesc("");
      } else {
        setNewIncomeCategoryName("");
        setNewIncomeCategoryDesc("");
      }
    } catch (error) {
      console.error(`Error adding ${type} category:`, error);
    }
  };

  return {
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

    isExpenseModalVisible,
    setIsExpenseModalVisible,
    isIncomeModalVisible,
    setIsIncomeModalVisible,

    addCategory,
    // On expose aussi la méthode fetchCategories pour rafraîchir manuellement
    fetchCategories,
  };
}

export default useCategories;
