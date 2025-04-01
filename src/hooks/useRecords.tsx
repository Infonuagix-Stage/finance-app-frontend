import { useState, useEffect } from "react";
import useAxiosAuth from "./useAxiosAuth";

// Define the types for the records
interface Record {
  id: string;
  amount: number;
  description?: string;
  date?: string;
  [key: string]: any; // Allow additional fields
}

interface RecordData {
  amount: number;
  description?: string;
  date?: string;
  [key: string]: any;
}

const useRecords = (userId?: string, categoryId?: string, categoryType?: "INCOME" | "EXPENSE") => {
  const api = useAxiosAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [currentTotal, setCurrentTotal] = useState<number>(0);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userId || !categoryId || !categoryType) return;
      try {
        const response = await api.get<Record[]>(
          `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}`
        );
        setRecords(response.data);
        const total = response.data.reduce((sum, rec) => sum + Number(rec.amount), 0);
        setCurrentTotal(total);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, [userId, categoryId, categoryType]);

  const addRecord = async (recordData: RecordData) => {
    if (!userId || !categoryId || !categoryType) return;
    try {
      const response = await api.post<Record>(
        `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}`,
        recordData
      );
      setRecords((prev) => [...prev, response.data]);
      setCurrentTotal((prev) => Number(prev) + Number(response.data.amount));
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!userId || !categoryId || !categoryType) return;
    try {
      await api.delete(
        `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordId}`
      );
      setRecords((prev) => prev.filter((rec) => rec.id !== recordId));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleEditRecord = async (recordId: string, updatedData: RecordData) => {
    if (!userId || !categoryId || !categoryType) return;
    try {
      const response = await api.put<Record>(
        `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordId}`,
        updatedData
      );
      setRecords((prevRecords) =>
        prevRecords.map((rec) => (rec.id === response.data.id ? response.data : rec))
      );
    } catch (error) {
      console.error("Error updating record:", error);
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
