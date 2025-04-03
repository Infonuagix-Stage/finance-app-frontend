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

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userId || !categoryId || !categoryType || !year || !month) return;

      const response = await api.get<Record[]>(
        `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}?year=${year}&month=${month}`
      );

      setRecords(response.data);
      const total = response.data.reduce((sum, rec) => sum + Number(rec.amount), 0);
      setCurrentTotal(total);
    };

    fetchRecords();
  }, [userId, categoryId, categoryType, year, month]);

  const addRecord = async (recordData: Omit<Record, "incomeId" | "expenseId">) => {
    const response = await api.post<Record>(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}`,
      recordData
    );

    setRecords((prev) => [...prev, response.data]);
    setCurrentTotal((prev) => prev + Number(response.data.amount));
  };

  const handleDeleteRecord = async (recordUuid: string) => {
    await api.delete(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordUuid}`
    );

    setRecords((prev) =>
      prev.filter((rec) =>
        (categoryType === "INCOME" ? rec.incomeId : rec.expenseId) !== recordUuid
      )
    );
  };

  const handleEditRecord = async (recordUuid: string, updatedData: Partial<Record>) => {
    const response = await api.put<Record>(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordUuid}`,
      updatedData
    );

    const updatedRecord = response.data;

    setRecords((prevRecords) =>
      prevRecords.map((rec) =>
        (categoryType === "INCOME" ? rec.incomeId : rec.expenseId) === recordUuid
          ? updatedRecord
          : rec
      )
    );
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
