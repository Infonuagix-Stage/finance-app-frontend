import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCategoriesForUser, createCategoryForUser } from "../services/categoryService";
import { getCategoryTotal } from "../services/totalService";

// Define types
interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "EXPENSE" | "INCOME";
}

type TotalsMap = Record<string, number>;

const useCategories = (userId: string, currentDate: Date) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const { user, getAccessTokenSilently } = useAuth0();

  const [categories, setCategories] = useState<Category[]>([]);
  const [totalsMap, setTotalsMap] = useState<TotalsMap>({});
  const [newExpenseCategoryName, setNewExpenseCategoryName] = useState<string>("");
  const [newExpenseCategoryDesc, setNewExpenseCategoryDesc] = useState<string>("");
  const [newIncomeCategoryName, setNewIncomeCategoryName] = useState<string>("");
  const [newIncomeCategoryDesc, setNewIncomeCategoryDesc] = useState<string>("");
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState<boolean>(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState<boolean>(false);

  const addCategory = async (type: "EXPENSE" | "INCOME") => {
    const name = type === "EXPENSE" ? newExpenseCategoryName : newIncomeCategoryName;
    const desc = type === "EXPENSE" ? newExpenseCategoryDesc : newIncomeCategoryDesc;

    if (!name.trim()) return;

    try {
      const token = await getAccessTokenSilently();
      const categoryData = { name, description: desc, type };
      const created = await createCategoryForUser(userId, categoryData, token);
      setCategories((prev) => [...prev, created]);

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

  // Fetch categories
  useEffect(() => {
    if (!userId || !currentYear || !currentMonth) return;

    const fetchCategories = async () => {
      try {
        const token = await getAccessTokenSilently();
        const fetchedCategories = await getCategoriesForUser(userId, token);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [userId, currentYear, currentMonth, getAccessTokenSilently]);

  // Fetch totals for each category
  useEffect(() => {
    if (!userId || categories.length === 0 || !currentYear || !currentMonth) return;

    const fetchTotals = async () => {
      const newTotalsMap: TotalsMap = {};
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const total = await getCategoryTotal({ userId, categoryId: cat.categoryId }); // Pass the correct parameter object
            newTotalsMap[cat.categoryId] = total.total; // Ensure 'amount' is correctly referenced
          } catch {
            newTotalsMap[cat.categoryId] = 0;
          }
        })
      );
      setTotalsMap(newTotalsMap);
    };

    fetchTotals();
  }, [userId, categories, currentYear, currentMonth]);

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
  };
};

export default useCategories;
