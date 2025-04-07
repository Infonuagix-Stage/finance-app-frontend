import axios from "axios";

export interface Debt {
  id: number;
  debtId: string;
  creditor: string;
  amountOwed: number;
  amountPaid: number;
  dueDate: string;
  monthlyPayment: number;
  status: string;
  createdAt: string;
  auth0UserId: string;
}

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDebtsForUser = async (
  userId: string,
  token: string
): Promise<Debt[]> => {
  const response = await api.get<Debt[]>(`/users/${userId}/debts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createDebtForUser = async (
  userId: string,
  debtData: Omit<Debt, "id" | "debtId" | "createdAt" | "auth0UserId">,
  token: string
): Promise<Debt> => {
  const response = await api.post<Debt>(`/users/${userId}/debts`, debtData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateDebtForUser = async (
  userId: string,
  debtId: string,
  updatedData: Partial<Omit<Debt, "id" | "auth0UserId">>,
  token: string
): Promise<Debt> => {
  const response = await api.put<Debt>(
    `/users/${userId}/debts/${debtId}`,
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteDebtForUser = async (
  userId: string,
  debtId: string,
  token: string
): Promise<void> => {
  await api.delete(`/users/${userId}/debts/${debtId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
