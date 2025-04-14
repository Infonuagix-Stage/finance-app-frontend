import { useState, useEffect } from "react";
import useAxiosAuth from "./useAxiosAuth";

// Define the types for a record
interface Record {
  description: string;
  incomeDate: any;
  expenseDate: any;
  amount: number;
  incomeId?: string;
  expenseId?: string;
}

// Props for the hook
interface UseRecordsProps {
  userId: string;
  categoryId: string;
  categoryType: "INCOME" | "EXPENSE";
  year: number;
  month: number;
}

const useRecords = ({ userId, categoryId, categoryType, year, month }: UseRecordsProps) => {
  const api = useAxiosAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [currentTotal, setCurrentTotal] = useState<number>(0);

  // Fonction utilitaire pour recalculer le total
  const recalculateTotal = (recordsList: Record[]) => {
    const total = recordsList.reduce((sum, rec) => sum + Number(rec.amount), 0);
    setCurrentTotal(total);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userId || !categoryId || !categoryType || !year || !month) return;

      const response = await api.get<Record[]>(
        `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}?year=${year}&month=${month}`
      );

      setRecords(response.data);
      recalculateTotal(response.data);
    };

    fetchRecords();
  }, [userId, categoryId, categoryType, year, month]);

  const addRecord = async (recordData: Omit<Record, "incomeId" | "expenseId">) => {
    const response = await api.post<Record>(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}`,
      recordData
    );

    const newRecords = [...records, response.data];
    setRecords(newRecords);
    recalculateTotal(newRecords);
  };

  const handleDeleteRecord = async (recordUuid: string) => {
    await api.delete(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordUuid}`
    );

    const updatedRecords = records.filter((rec) =>
      (categoryType === "INCOME" ? rec.incomeId : rec.expenseId) !== recordUuid
    );
    
    setRecords(updatedRecords);
    recalculateTotal(updatedRecords);
  };

  const handleEditRecord = async (recordUuid: string, updatedData: Partial<Record>) => {
    const response = await api.put<Record>(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordUuid}`,
      {
        ...updatedData,
        categoryId, // <-- Ce champ est requis côté backend
      },
    );
  
    const updatedRecord = response.data;
  
    const updatedRecords = records.map((rec) =>
      (categoryType === "INCOME" ? rec.incomeId : rec.expenseId) === recordUuid
        ? updatedRecord
        : rec
    );
    
    setRecords(updatedRecords);
    recalculateTotal(updatedRecords);
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