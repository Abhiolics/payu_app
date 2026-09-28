import apiClient from './api';

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
}

export interface WithdrawalItem {
  _id: string;
  user?: string;
  amount: number;
  bankDetails: BankDetails;
  status: 'pending' | 'approved' | 'rejected';
  adminRemark?: string;
  createdAt: string;
}

export const requestWithdrawal = async (
  amount: number,
  bankDetails: BankDetails
): Promise<{ success: boolean; message: string; data: WithdrawalItem }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: WithdrawalItem;
  }>('/withdrawals', {
    amount,
    bankDetails: {
      accountHolder: bankDetails.accountHolder.trim(),
      accountNumber: bankDetails.accountNumber.trim(),
      ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
      upiId: bankDetails.upiId ? bankDetails.upiId.trim() : undefined,
    },
  });

  return response.data;
};

export const getWithdrawals = async (): Promise<WithdrawalItem[]> => {
  const response = await apiClient.get<{ success: boolean; count: number; data: WithdrawalItem[] }>('/withdrawals');
  return response.data.data || [];
};
