import apiClient from './api';

export interface WalletData {
  _id?: string;
  user?: string;
  balance: number;
  pendingBalance: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionType = 'credit' | 'debit';
export type TransactionCategory =
  | 'deposit'
  | 'withdrawal'
  | 'task_reward'
  | 'gift_code'
  | 'admin_adjustment';

export interface TransactionItem {
  _id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface TransactionFilterParams {
  page?: number;
  limit?: number;
  type?: 'credit' | 'debit';
  category?: TransactionCategory;
}

export const getWalletBalance = async (): Promise<WalletData> => {
  const response = await apiClient.get<{ success: boolean; data: WalletData }>('/wallet');
  return response.data.data;
};

export const getTransactions = async (
  params?: TransactionFilterParams
): Promise<{ count: number; total: number; data: TransactionItem[] }> => {
  const query: Record<string, any> = {};
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.type) query.type = params.type;
  if (params?.category) query.category = params.category;

  const response = await apiClient.get<{
    success: boolean;
    count: number;
    total: number;
    data: TransactionItem[];
  }>('/wallet/transactions', { params: query });

  return {
    count: response.data.count || 0,
    total: response.data.total || 0,
    data: response.data.data || [],
  };
};

export interface WalletTotals {
  totalDeposit: number;
  totalWithdrawal: number;
  pendingDeposit: number;
  pendingWithdrawal: number;
}

export const getWalletTotals = async (): Promise<WalletTotals> => {
  try {
    const { getDeposits } = await import('./depositService');
    const { getWithdrawals } = await import('./withdrawalService');

    const [depRes, withRes, txRes] = await Promise.allSettled([
      getDeposits(),
      getWithdrawals(),
      getTransactions({ limit: 100 }),
    ]);

    let totalDeposit = 0;
    let pendingDeposit = 0;
    let totalWithdrawal = 0;
    let pendingWithdrawal = 0;

    const depositKeys = new Set<string>();
    const withdrawalKeys = new Set<string>();

    if (depRes.status === 'fulfilled' && Array.isArray(depRes.value)) {
      depRes.value.forEach((d) => {
        if (d._id) depositKeys.add(String(d._id));
        if (d.transactionRef) depositKeys.add(String(d.transactionRef));
        const amt = Number(d.amount) || 0;
        const status = String(d.status || '').toLowerCase();
        if (status === 'approved' || status === 'completed' || status === 'success') {
          totalDeposit += amt;
        } else if (status === 'pending') {
          pendingDeposit += amt;
        }
      });
    }

    if (withRes.status === 'fulfilled' && Array.isArray(withRes.value)) {
      withRes.value.forEach((w) => {
        if (w._id) withdrawalKeys.add(String(w._id));
        const amt = Number(w.amount) || 0;
        const status = String(w.status || '').toLowerCase();
        if (status === 'approved' || status === 'completed' || status === 'success') {
          totalWithdrawal += amt;
        } else if (status === 'pending') {
          pendingWithdrawal += amt;
        }
      });
    }

    // Also check transactions in case any completed deposit/withdrawal exists in transaction ledger
    if (txRes.status === 'fulfilled' && Array.isArray(txRes.value?.data)) {
      txRes.value.data.forEach((tx) => {
        const amt = Number(tx.amount) || 0;
        const status = String(tx.status || '').toLowerCase();
        const isCompleted = status === 'completed' || status === 'approved' || status === 'success';
        const isPending = status === 'pending';

        const isKnownDeposit =
          (tx.referenceId && depositKeys.has(String(tx.referenceId))) ||
          (tx._id && depositKeys.has(String(tx._id)));

        const isKnownWithdrawal =
          (tx.referenceId && withdrawalKeys.has(String(tx.referenceId))) ||
          (tx._id && withdrawalKeys.has(String(tx._id)));

        if (tx.category === 'deposit' && !isKnownDeposit) {
          if (isCompleted) totalDeposit += amt;
          else if (isPending) pendingDeposit += amt;
        } else if (tx.category === 'withdrawal' && !isKnownWithdrawal) {
          if (isCompleted) totalWithdrawal += amt;
          else if (isPending) pendingWithdrawal += amt;
        }
      });
    }

    return {
      totalDeposit,
      totalWithdrawal,
      pendingDeposit,
      pendingWithdrawal,
    };
  } catch (error) {
    console.warn('Failed to calculate wallet totals:', error);
    return {
      totalDeposit: 0,
      totalWithdrawal: 0,
      pendingDeposit: 0,
      pendingWithdrawal: 0,
    };
  }
};
