import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getCategoriesForUser,
  createCategoryForUser,
} from "../services/categoryService";
import { getCategoryTotal } from "../services/totalService";

// Define types
interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "EXPENSE" | "INCOME";
}

type TotalsMap = Record<string, number>;

const useCategories = () => {
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
      const created = await createCategoryForUser(user?.sub || "", categoryData, token);
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
    if (!user) return;
    const fetchCategories = async () => {
      try {
        const token = await getAccessTokenSilently();
        const fetchedCategories = await getCategoriesForUser(user?.sub || "", token);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [user, getAccessTokenSilently]);

  // Calculate totals
  useEffect(() => {
    if (!user?.sub || categories.length === 0) return;
    const fetchTotals = async () => {
      const newTotalsMap: TotalsMap = {};
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const total = await getCategoryTotal(user?.sub || "", cat.categoryId, cat.type);
            newTotalsMap[cat.categoryId] = total.amount; // Assuming 'amount' is the numeric property in CategoryTotal
          } catch {
            newTotalsMap[cat.categoryId] = 0;
          }
        })
      );
      setTotalsMap(newTotalsMap);
    };
    fetchTotals();
  }, [categories, user?.sub]);

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
