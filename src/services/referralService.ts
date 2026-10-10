import apiClient from './api';

export interface TeamMemberItem {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
  phone?: string;
  level?: string | number;
  levelBadge?: string;
  createdAt?: string;
  registrationDate?: string;
  totalDeposit?: number;
  deposit?: number;
}

export interface ReferralStatsData {
  totalCommission?: number;
  todayCommission?: number;
  yesterdayCommission?: number;
  totalMembers?: number;
  level1Count?: number;
  level2Count?: number;
  totalTeamDeposit?: number;
  referralCode?: string;
  referralLink?: string;
  teamMembers?: TeamMemberItem[];
}

export interface ReferralStatsResponse {
  success?: boolean;
  message?: string;
  data?: ReferralStatsData;
  totalCommission?: number;
  todayCommission?: number;
  yesterdayCommission?: number;
  totalMembers?: number;
  level1Count?: number;
  level2Count?: number;
  totalTeamDeposit?: number;
  referralCode?: string;
  referralLink?: string;
  teamMembers?: TeamMemberItem[];
}

export const getReferralStats = async (): Promise<ReferralStatsData> => {
  try {
    const response = await apiClient.get<ReferralStatsResponse>('/referral/stats');
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return (response.data as ReferralStatsData) || {};
  } catch (error) {
    console.warn('Failed to fetch referral stats:', error);
    return {
      totalCommission: 0,
      todayCommission: 0,
      yesterdayCommission: 0,
      totalMembers: 0,
      level1Count: 0,
      level2Count: 0,
      totalTeamDeposit: 0,
      teamMembers: [],
    };
  }
};
