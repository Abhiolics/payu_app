import apiClient from './api';
import { Platform } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface DepositItem {
  _id: string;
  user?: string;
  amount: number;
  transactionRef: string;
  paymentProof?: string;
  status: 'pending' | 'approved' | 'rejected';
  plan?: {
    _id: string;
    name: string;
    amount: number;
  } | null;
  adminRemark?: string;
  createdAt: string;
}

export const submitDeposit = async (
  amount: number,
  transactionRef: string,
  imageUri: string,
  planId?: string
): Promise<{ success: boolean; message: string; data: DepositItem }> => {
  const formData = new FormData();
  formData.append('amount', String(amount));
  formData.append('transactionRef', transactionRef.trim());
  if (planId) {
    formData.append('planId', planId);
  }

  // Derive file extension and MIME type
  const rawFilename = imageUri.split('/').pop()?.split('?')[0] || `proof_${Date.now()}.jpg`;
  const cleanExt = rawFilename.split('.').pop()?.toLowerCase() || 'jpg';
  const ext = ['png', 'jpg', 'jpeg', 'webp'].includes(cleanExt) ? cleanExt : 'jpg';
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const filename = rawFilename.includes('.') ? rawFilename : `${rawFilename}.${ext}`;

  // --- Compress the image to avoid 413 Content Too Large ---
  // On native, use expo-image-manipulator to resize + compress to JPEG.
  // Skip on web (blob:/data: URIs) — browser fetch+blob handles those inline below.
  let finalUri = imageUri;
  if (Platform.OS !== 'web' && !imageUri.startsWith('blob:') && !imageUri.startsWith('data:')) {
    const compressed = await manipulateAsync(
      imageUri,
      [{ resize: { width: 1280 } }], // preserve aspect ratio, cap width at 1280px
      { compress: 0.55, format: SaveFormat.JPEG }
    );
    finalUri = compressed.uri;
  }

  // Handle Web (Browser / Expo Web) vs Native Mobile (iOS / Android)

  if (Platform.OS === 'web' || imageUri.startsWith('blob:') || imageUri.startsWith('data:')) {
    // In Web browsers, FormData expects a Blob or File object.
    // Passing a plain { uri, name, type } object causes the browser to convert it to "[object Object]"!
    const res = await fetch(imageUri);
    const blob = await res.blob();
    formData.append('paymentProof', blob, filename);
  } else {
    // On React Native Mobile (iOS / Android), FormData expects an object with uri, name, and type.
    // Use finalUri (compressed JPEG) — always image/jpeg after manipulateAsync.
    let cleanUri = finalUri;
    if (Platform.OS === 'android' && !cleanUri.startsWith('file://') && !cleanUri.startsWith('content://')) {
      cleanUri = `file://${cleanUri}`;
    }

    formData.append('paymentProof', {
      uri: cleanUri,
      name: `proof_${Date.now()}.jpg`, // always .jpg since we compress to JPEG
      type: 'image/jpeg',
    } as any);
  }

  // Use axios via apiClient so the request interceptor attaches the token
  // and multipart FormData (with native file refs) is handled correctly on
  // React Native. Raw fetch() silently fails on Android/iOS with file objects.
  const axiosResponse = await apiClient.post<{ success: boolean; message: string; data: DepositItem }>(
    '/deposits',
    formData,
    {
      headers: {
        Accept: 'application/json',
        // Do NOT set Content-Type — axios will set it with the correct multipart boundary
      },
      // Prevent axios from JSON-serialising the FormData
      transformRequest: [(data) => data],
    }
  );

  const resJson = axiosResponse.data;

  if (!resJson.success) {
    throw new Error(resJson.message || 'Deposit submission failed');
  }

  return resJson;
};

export const getDeposits = async (): Promise<DepositItem[]> => {
  const response = await apiClient.get<{ success: boolean; count: number; data: DepositItem[] }>('/deposits');
  return response.data.data || [];
};
