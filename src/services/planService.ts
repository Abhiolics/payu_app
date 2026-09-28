import apiClient from './api';

export interface MembershipPlan {
  _id: string;
  name: string;
  amount: number;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getPlans = async (): Promise<MembershipPlan[]> => {
  const response = await apiClient.get<{ success: boolean; count: number; data: MembershipPlan[] }>('/plans');
  return response.data.data || [];
};
