import apiClient from './api';

export interface GiftCodeRedeemResult {
  code: string;
  rewardAmount: number;
}

export const redeemGiftCode = async (code: string): Promise<{ success: boolean; message: string; data?: GiftCodeRedeemResult }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: GiftCodeRedeemResult;
  }>('/gift-codes/redeem', { code: code.trim().toUpperCase() });
  return response.data;
};
