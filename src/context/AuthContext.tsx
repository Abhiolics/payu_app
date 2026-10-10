import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  WalletData,
  AppSettings,
  WalletTotals,
  getStoredAuthToken,
  getMe,
  getWalletBalance,
  getWalletTotals,
  getUnreadNotificationCount,
  getAppSettings,
  login,
  register,
  verifyOtp,
  updateProfile,
  logout,
} from '../services';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  wallet: WalletData | null;
  totals: WalletTotals;
  unreadCount: number;
  appSettings: AppSettings | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithOtp: (email: string, otp: string) => Promise<{ isNewUser: boolean; user?: UserProfile }>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  registerUser: (payload: {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
    referralCode?: string;
  }) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  refreshTotals: () => Promise<WalletTotals>;
  refreshUnreadCount: () => Promise<void>;
  updateUserProfile: (payload: { fullName?: string; phoneNumber?: string }) => Promise<UserProfile>;
  checkAppSettings: () => Promise<AppSettings | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [totals, setTotals] = useState<WalletTotals>({
    totalDeposit: 0,
    totalWithdrawal: 0,
    pendingDeposit: 0,
    pendingWithdrawal: 0,
  });
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check app settings & maintenance mode
  const checkAppSettings = useCallback(async () => {
    try {
      const settings = await getAppSettings();
      setAppSettings(settings);
      return settings;
    } catch (error) {
      console.warn('Failed to load app settings:', error);
      return null;
    }
  }, []);

  // Refresh totals (deposits & withdrawals)
  const refreshTotals = useCallback(async (): Promise<WalletTotals> => {
    try {
      const data = await getWalletTotals();
      setTotals(data);
      return data;
    } catch (error) {
      console.warn('Failed to fetch wallet totals:', error);
      return { totalDeposit: 0, totalWithdrawal: 0, pendingDeposit: 0, pendingWithdrawal: 0 };
    }
  }, []);

  // Refresh wallet balance
  const refreshWallet = useCallback(async () => {
    try {
      const walletData = await getWalletBalance();
      setWallet(walletData);
    } catch (error) {
      // Wallet may not be initialized or unauthenticated
      console.warn('Failed to fetch wallet:', error);
    } finally {
      await refreshTotals();
    }
  }, [refreshTotals]);

  // Refresh unread notifications count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      // Ignore
    }
  }, []);

  // Refresh complete user profile
  const refreshUserData = useCallback(async () => {
    try {
      const profile = await getMe();
      setUser(profile);
      if (profile.wallet) {
        setWallet({
          balance: profile.wallet.balance,
          pendingBalance: profile.wallet.pendingBalance,
        });
      }
      await Promise.allSettled([refreshWallet(), refreshUnreadCount(), refreshTotals()]);
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
    }
  }, [refreshWallet, refreshUnreadCount, refreshTotals]);

  // Initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAppSettings();
        const storedToken = await getStoredAuthToken();
        if (storedToken) {
          setToken(storedToken);
          try {
            const profile = await getMe();
            setUser(profile);
            if (profile.wallet) {
              setWallet({
                balance: profile.wallet.balance,
                pendingBalance: profile.wallet.pendingBalance,
              });
            }
            await Promise.allSettled([refreshWallet(), refreshUnreadCount(), refreshTotals()]);
          } catch (profileError) {
            console.warn('Stored token may be invalid, clearing:', profileError);
            await logout();
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [checkAppSettings, refreshWallet, refreshUnreadCount, refreshTotals]);

  const loginWithOtp = async (email: string, otp: string): Promise<{ isNewUser: boolean; user?: UserProfile }> => {
    const result = await verifyOtp(email, otp);
    const profile = result.data || result.user;
    if (result.token) {
      setToken(result.token);
      if (profile) {
        setUser(profile);
      }
      await refreshUserData();
    }
    const isNew = Boolean(result.isNewUser || !profile?.fullName);
    return { isNewUser: isNew, user: profile };
  };

  const loginWithPassword = async (email: string, password: string) => {
    const result = await login({ email, password });
    if (result.token) {
      setToken(result.token);
      await refreshUserData();
    }
  };

  const registerUser = async (payload: {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
    referralCode?: string;
  }) => {
    const result = await register(payload);
    if (result.token) {
      setToken(result.token);
      await refreshUserData();
    }
  };

  const logoutUser = async () => {
    await logout();
    setToken(null);
    setUser(null);
    setWallet(null);
    setTotals({
      totalDeposit: 0,
      totalWithdrawal: 0,
      pendingDeposit: 0,
      pendingWithdrawal: 0,
    });
    setUnreadCount(0);
  };

  const updateUserProfile = async (payload: { fullName?: string; phoneNumber?: string }) => {
    const updated = await updateProfile(payload);
    setUser((prev) => (prev ? { ...prev, ...updated } : updated));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        wallet,
        totals,
        unreadCount,
        appSettings,
        isAuthenticated: Boolean(token && user),
        isLoading,
        loginWithOtp,
        loginWithPassword,
        registerUser,
        logoutUser,
        refreshUserData,
        refreshWallet,
        refreshTotals,
        refreshUnreadCount,
        updateUserProfile,
        checkAppSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
