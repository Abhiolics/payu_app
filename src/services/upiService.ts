import apiClient from './api';

export interface UpiRecord {
  _id: string;
  userId?: string;
  upiId: string;
  accountHolderName: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch the logged-in user's registered UPI accounts from backend
 */
export const getMyUpis = async (): Promise<UpiRecord[]> => {
  const response = await apiClient.get<{
    success: boolean;
    count: number;
    data: UpiRecord[];
  }>('/upi/my');
  return response.data?.data || [];
};

/**
 * Register / add a new UPI account on the backend
 * This persists to MongoDB and makes the UPI visible to Admin immediately
 */
export const createUpiRecord = async (payload: {
  upiId: string;
  accountHolderName: string;
  isPrimary?: boolean;
}): Promise<UpiRecord> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: UpiRecord;
  }>('/upi', {
    upiId: payload.upiId.trim(),
    accountHolderName: payload.accountHolderName.trim(),
    isPrimary: payload.isPrimary ?? false,
  });
  return response.data?.data;
};

/**
 * Update a UPI record (e.g. set as primary or update holder name)
 */
export const updateUpiRecord = async (
  id: string,
  payload: {
    upiId?: string;
    accountHolderName?: string;
    isPrimary?: boolean;
  }
): Promise<UpiRecord> => {
  const response = await apiClient.put<{
    success: boolean;
    message: string;
    data: UpiRecord;
  }>(`/upi/${id}`, payload);
  return response.data?.data;
};

/**
 * Delete a registered UPI account on the backend
 */
export const deleteUpiRecord = async (id: string): Promise<void> => {
  await apiClient.delete(`/upi/${id}`);
};
