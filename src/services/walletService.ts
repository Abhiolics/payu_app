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
