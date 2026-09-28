import apiClient from './api';

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const response = await apiClient.get<{
    success: boolean;
    count: number;
    data: NotificationItem[];
  }>('/notifications');
  return response.data.data || [];
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await apiClient.get<{ success: boolean; unreadCount: number }>('/notifications/unread-count');
  return response.data.unreadCount || 0;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};
