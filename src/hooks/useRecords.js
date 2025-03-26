import { useState, useEffect } from "react";
import useAxiosAuth from "./useAxiosAuth";

const useRecords = (userId, categoryId, categoryType, year, month) => {
  const api = useAxiosAuth();
  const [records, setRecords] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userId || !categoryId || !categoryType || !year || !month) return;

      const response = await api.get(
        `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}?year=${year}&month=${month}`
      );

      setRecords(response.data);
      const total = response.data.reduce((sum, rec) => sum + Number(rec.amount), 0);
      setCurrentTotal(total);
    };

    fetchRecords();
  }, [userId, categoryId, categoryType, year, month]);

  const addRecord = async (recordData) => {
    const response = await api.post(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}`,
      recordData
    );
    setRecords((prev) => [...prev, response.data]);
    setCurrentTotal((prev) => Number(prev) + Number(response.data.amount));
  };

  const handleDeleteRecord = async (recordUuid) => {
    await api.delete(
      `/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordUuid}`
    );

    setRecords((prev) =>
      prev.filter((rec) =>
        (categoryType === "INCOME" ? rec.incomeId : rec.expenseId) !== recordUuid
      )
    );
  };

  const handleEditRecord = async (recordUuid, updatedData) => {
    const response = await api.put(
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
