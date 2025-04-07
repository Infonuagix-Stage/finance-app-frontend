import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getDebtsForUser,
  createDebtForUser,
  updateDebtForUser,
  deleteDebtForUser,
  Debt,
} from "../services/debtService";

interface DebtData {
  creditor: string;
  amountOwed: number;
  amountPaid: number;
  dueDate: string;
  monthlyPayment: number;
  status: string;
}

export const useDebts = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(async () => {
    if (!isAuthenticated || !user?.sub) return;

    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const fetchedDebts = await getDebtsForUser(user.sub, token);
      setDebts(fetchedDebts);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.sub, getAccessTokenSilently]);

  const createDebt = async (debtData: DebtData): Promise<Debt> => {
    try {
      const token = await getAccessTokenSilently();
      const newDebt = await createDebtForUser(user?.sub || "", debtData, token);
      setDebts((prev) => [...prev, newDebt]);
      return newDebt;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const updateDebt = async (
    debtId: string,
    debtData: Partial<DebtData>
  ): Promise<Debt> => {
    try {
      const token = await getAccessTokenSilently();
      const updated = await updateDebtForUser(
        user?.sub || "",
        debtId,
        debtData,
        token
      );
      setDebts((prev) => prev.map((d) => (d.debtId === debtId ? updated : d)));
      return updated;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const deleteDebt = async (debtId: string): Promise<void> => {
    try {
      const token = await getAccessTokenSilently();
      await deleteDebtForUser(user?.sub || "", debtId, token);
      setDebts((prev) => prev.filter((d) => d.debtId !== debtId));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDebts();
    }
  }, [fetchDebts, isAuthenticated]);

  return {
    debts,
    loading,
    error,
    fetchDebts,
    createDebt,
    updateDebt,
    deleteDebt,
  };
};
