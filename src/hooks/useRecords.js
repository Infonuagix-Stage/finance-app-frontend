import { useState, useEffect } from "react";
import useAxiosAuth from "./useAxiosAuth";

const useRecords = (userId, categoryId, categoryType) => {
  const api = useAxiosAuth();
  const [records, setRecords] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userId || !categoryId || !categoryType) return;
      const response = await api.get(`/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}`);
      setRecords(response.data);
      const total = response.data.reduce((sum, rec) => sum + Number(rec.amount), 0);
      setCurrentTotal(total);
    };
    fetchRecords();
  }, [userId, categoryId, categoryType]);

  const addRecord = async (recordData) => {
    const response = await api.post(`/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}`, recordData);
    setRecords((prev) => [...prev, response.data]);
    setCurrentTotal((prev) => Number(prev) + Number(response.data.amount));
  };

  const handleDeleteRecord = async (recordId) => {
    await api.delete(`/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordId}`);
    setRecords((prev) => prev.filter((rec) => rec.id !== recordId));
  };

  const handleEditRecord = async (recordId, updatedData) => {
    const response = await api.put(`/users/${userId}/categories/${categoryId}/${categoryType === "INCOME" ? "incomes" : "expenses"}/${recordId}`, updatedData);
    setRecords((prev) => prev.map((rec) => (rec.id === recordId ? response.data : rec)));
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
