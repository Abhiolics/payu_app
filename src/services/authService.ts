import apiClient, { saveAuthToken, removeAuthToken } from './api';

export interface UserProfile {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  referralCode?: string;
  referralLink?: string;
  isBlocked?: boolean;
  isActive?: boolean;
  isEmailVerified?: boolean;
  plan?: {
    _id: string;
    name: string;
    amount: number;
    description?: string;
  } | null;
  wallet?: {
    balance: number;
    pendingBalance: number;
  };
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: UserProfile;
  user?: UserProfile;
  isNewUser?: boolean;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export const register = async (payload: {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  referralCode?: string;
}): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);
  if (response.data.token) {
    await saveAuthToken(response.data.token);
  }
  return response.data;
};

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  if (response.data.token) {
    await saveAuthToken(response.data.token);
  }
  return response.data;
};

export const sendOtp = async (email: string): Promise<SendOtpResponse> => {
  const response = await apiClient.post<SendOtpResponse>('/auth/send-otp', { email });
  return response.data;
};

export const verifyOtp = async (email: string, otp: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/verify-otp', { email, otp });
  if (response.data.token) {
    await saveAuthToken(response.data.token);
  }
  return response.data;
};

export const getMe = async (): Promise<UserProfile> => {
  const response = await apiClient.get<{ success: boolean; data: UserProfile }>('/auth/me');
  return response.data.data;
};

export const updateProfile = async (payload: {
  fullName?: string;
  phoneNumber?: string;
}): Promise<UserProfile> => {
  const response = await apiClient.put<{ success: boolean; message: string; data: UserProfile }>(
    '/auth/update-profile',
    payload
  );
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await removeAuthToken();
};
