// hooks/useRecords.js
import { useState, useEffect } from "react";
import {
  getExpensesForCategory,
  createExpenseForCategory,
  deleteExpenseForCategory,
  updateExpenseForCategory,
} from "../services/expenseService";
import {
  getIncomesForCategory,
  createIncomeForCategory,
  deleteIncomeForCategory,
  updateIncomeForCategory,
} from "../services/incomeService";

const useRecords = (userId, categoryId, categoryType) => {
  const [records, setRecords] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    if (!userId || !categoryId) return;
    const fetchRecords = async () => {
      try {
        let data;
        if (categoryType && categoryType.toUpperCase() === "INCOME") {
          data = await getIncomesForCategory(userId, categoryId);
        } else {
          data = await getExpensesForCategory(userId, categoryId);
        }
        setRecords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des records :", error);
      }
    };
    fetchRecords();
  }, [userId, categoryId, categoryType]);

  useEffect(() => {
    const total = records.reduce((acc, record) => {
      const value = parseFloat(record.amount || record.montant || 0);
      return acc + value;
    }, 0);
    setCurrentTotal(total);
  }, [records]);

  const addRecord = async (recordData) => {
    if (!recordData.description || !recordData.amount || !categoryId) {
      return;
    }

    recordData = {
      description: recordData.description,
      amount: recordData.amount,
      expenseDate: recordData.expenseDate,
      userId: userId,
      categoryId: categoryId,

      // userId and categoryId are already handled in the hook
    };

    console.log("userId:", userId);
    console.log("categoryId:", categoryId);
    console.log("categoryType:", categoryType);
    console.log("recordData:", recordData);

    try {
      let created;
      if (categoryType?.toUpperCase() === "INCOME") {
        // Ensure incomeDate is included in recordData
        created = await createIncomeForCategory(userId, categoryId, recordData);
      } else {
        // Ensure expenseDate is included in recordData
        created = await createExpenseForCategory(
          userId,
          categoryId,
          recordData
        );
      }
      setRecords([...records, created]);
    } catch (error) {
      console.error("Erreur lors de la création du record :", error);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      if (categoryType && categoryType.toUpperCase() === "INCOME") {
        await deleteIncomeForCategory(userId, categoryId, recordId);
      } else {
        await deleteExpenseForCategory(userId, categoryId, recordId);
      }
      setRecords((prev) => prev.filter((rec) => rec.id !== recordId));
    } catch (error) {
      console.error("Erreur lors de la suppression du record :", error);
    }
  };

  const handleEditRecord = async (recordId, updatedData) => {
    try {
      let updatedRecord;
      if (categoryType && categoryType.toUpperCase() === "INCOME") {
        updatedRecord = await updateIncomeForCategory(
          userId,
          categoryId,
          recordId,
          updatedData
        );
      } else {
        updatedRecord = await updateExpenseForCategory(
          userId,
          categoryId,
          recordId,
          updatedData
        );
      }
      setRecords((prev) =>
        prev.map((rec) => (rec.id === recordId ? updatedRecord : rec))
      );
    } catch (error) {
      console.error("Erreur lors de la modification du record :", error);
    }
  };

  return {
    records,
    currentTotal,
    addRecord,
    handleDeleteRecord,
    handleEditRecord,
  };
};

export default useRecords;
