import apiClient from './api';

export interface AppSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  forceUpdate: boolean;
  updateMessage: string;
  currentVersion: string;
}

export interface PaymentMethods {
  qrCode: {
    imageUrl?: string;
    upiId?: string;
    enabled?: boolean;
  };
  bankAccount: {
    accountHolder?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    upiId?: string;
    enabled?: boolean;
  };
}

export interface ContactChannel {
  _id: string;
  type: 'whatsapp' | 'telegram' | 'email' | 'phone' | string;
  label: string;
  value: string;
  isActive: boolean;
}

export const getAppSettings = async (): Promise<AppSettings> => {
  const response = await apiClient.get<{ success: boolean; data: AppSettings }>('/app/settings');
  return response.data.data;
};

export const getPaymentMethods = async (): Promise<PaymentMethods> => {
  const response = await apiClient.get<{ success: boolean; data: PaymentMethods }>('/payment-methods');
  return response.data.data;
};

export const getContacts = async (): Promise<ContactChannel[]> => {
  const response = await apiClient.get<{ success: boolean; count: number; data: ContactChannel[] }>('/contacts');
  return response.data.data || [];
};
