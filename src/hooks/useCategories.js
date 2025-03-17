// hooks/useCategories.js
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getCategoriesForUser,
  createCategoryForUser,
} from "../services/categoryService";
import { getCategoryTotal } from "../services/totalService";

const useCategories = () => {
  const { user, getAccessTokenSilently } = useAuth0(); 
  const [categories, setCategories] = useState([]);
  const [totalsMap, setTotalsMap] = useState({});
  const [newExpenseCategoryName, setNewExpenseCategoryName] = useState("");
  const [newExpenseCategoryDesc, setNewExpenseCategoryDesc] = useState("");
  const [newIncomeCategoryName, setNewIncomeCategoryName] = useState("");
  const [newIncomeCategoryDesc, setNewIncomeCategoryDesc] = useState("");
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const addCategory = async (type) => {
    const name =
      type === "EXPENSE" ? newExpenseCategoryName : newIncomeCategoryName;
    const desc =
      type === "EXPENSE" ? newExpenseCategoryDesc : newIncomeCategoryDesc;

    if (name.trim() === "") return;

    try {
      const token = await getAccessTokenSilently(); 
      const categoryData = { name, description: desc, type};
      const created = await createCategoryForUser(user.sub, categoryData, token);
      setCategories((prev) => [...prev, created]); // Functional update for safety

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
        const fetchedCategories = await getCategoriesForUser(user.sub, token);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [user, getAccessTokenSilently]);

  // Calculate totals
  useEffect(() => {
    if (!user.sub || categories.length === 0) return;
    const fetchTotals = async () => {
      const newTotalsMap = {};
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const total = await getCategoryTotal(
              user.sub,
              cat.categoryId,
              cat.type
            );
            newTotalsMap[cat.categoryId] = total;
          } catch {
            newTotalsMap[cat.categoryId] = 0;
          }
        })
      );
      setTotalsMap(newTotalsMap);
    };
    fetchTotals();
  }, [categories, user.sub]);

  return {
    // Expose only what's needed
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
