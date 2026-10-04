import apiClient from './api';
import { Platform } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface TaskItem {
  _id: string;
  title: string;
  description: string;
  rewardAmount: number;
  isActive: boolean;
  mySubmission?: {
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
  } | null;
  createdAt?: string;
}

export interface TaskSubmissionItem {
  _id: string;
  task: {
    _id: string;
    title: string;
    rewardAmount: number;
  } | string;
  rewardAmount: number;
  proof: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemark?: string;
  createdAt: string;
}

export const getTasks = async (): Promise<TaskItem[]> => {
  const response = await apiClient.get<{ success: boolean; count: number; data: TaskItem[] }>('/tasks');
  return response.data.data || [];
};

export const submitTaskProof = async (
  taskId: string,
  imageUri: string
): Promise<{ success: boolean; message: string; data: TaskSubmissionItem }> => {
  const formData = new FormData();
  formData.append('taskId', taskId);

  // 1. Compress and normalize the image to avoid 413 payload limits and memory issues
  let finalUri = imageUri;
  if (Platform.OS !== 'web' && !imageUri.startsWith('blob:') && !imageUri.startsWith('data:')) {
    try {
      const compressed = await manipulateAsync(
        imageUri,
        [{ resize: { width: 1280 } }],
        { compress: 0.6, format: SaveFormat.JPEG }
      );
      finalUri = compressed.uri;
    } catch (err) {
      console.warn('Task proof compression skipped:', err);
    }
  }

  const rawFilename = finalUri.split('/').pop()?.split('?')[0] || `task_proof_${Date.now()}.jpg`;
  const filename = rawFilename.includes('.') ? rawFilename : `${rawFilename}.jpg`;

  // 2. Append proof file properly for Web vs Native
  if (Platform.OS === 'web' || finalUri.startsWith('blob:') || finalUri.startsWith('data:')) {
    const res = await fetch(finalUri);
    const blob = await res.blob();
    formData.append('proof', blob, filename);
  } else {
    let cleanUri = finalUri;
    if (Platform.OS === 'android' && !cleanUri.startsWith('file://') && !cleanUri.startsWith('content://')) {
      cleanUri = `file://${cleanUri}`;
    }

    formData.append('proof', {
      uri: cleanUri,
      name: filename,
      type: 'image/jpeg',
    } as any);
  }

  // 3. Use axios via apiClient: React Native's raw fetch() rejects { uri, name, type }
  // objects with "Unsupported form data part" / "Unsupported FormDataPart implementation".
  // apiClient uses XMLHttpRequest (RCTNetworking) which natively handles file refs.
  const axiosResponse = await apiClient.post<{
    success: boolean;
    message: string;
    data: TaskSubmissionItem;
  }>(
    `/tasks/${taskId}/submit`,
    formData,
    {
      timeout: 45000,
      headers: {
        Accept: 'application/json',
        // Do NOT set Content-Type manually — axios/RCTNetworking sets boundary automatically
      },
      transformRequest: [(data) => data],
    }
  );

  const resJson = axiosResponse.data;

  if (!resJson.success) {
    throw new Error(resJson.message || 'Task submission failed');
  }

  return resJson;
};

export const getMySubmissions = async (): Promise<TaskSubmissionItem[]> => {
  const response = await apiClient.get<{
    success: boolean;
    count: number;
    data: TaskSubmissionItem[];
  }>('/tasks/submissions');
  return response.data.data || [];
};
