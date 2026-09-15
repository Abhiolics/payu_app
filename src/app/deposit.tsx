import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Image,
  Platform,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Upload,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon,
  Wallet
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

const DARK_BG = '#050505';
const CARD_BG = '#111111';
const TEXT_MUTED = '#8B93A5';
const MINT = '#00D09C';
const MINT_GRADIENT = ['#00E5AE', '#00D09C', '#00A67D'] as const;

export default function DepositScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;

  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [hasScreenshot, setHasScreenshot] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCopyId = async () => {
    try {
      await Clipboard.setStringAsync('chetan202004@fam');
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('chetan202004@fam');
      }
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleUploadScreenshot = () => {
    // In a real app we'd use expo-image-picker here
    setHasScreenshot(true);
  };

  // Validation: Both UTR and Screenshot are required
  const isFormValid = utr.trim().length > 5 && hasScreenshot;

  const handleSubmit = () => {
    if (!isFormValid) return;
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)/wallet');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.safeArea} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit Funds</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Step 1: Payment Details Card */}
        <View style={styles.stepHeaderRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Scan & Pay</Text>
        </View>

        <View style={styles.paymentCard}>
          <LinearGradient
            colors={['rgba(0, 208, 156, 0.1)', 'rgba(0, 208, 156, 0.02)']}
            style={styles.paymentCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount to pay</Text>
              <Text style={styles.amountValue}>₹2,740<Text style={styles.amountDecimal}>.00</Text></Text>
            </View>

            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                <Image 
                  source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=chetan202004@fam&pn=Chetan&cu=INR' }} 
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.scanText}>Use any UPI app to scan and pay</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.upiRow}>
              <View style={styles.upiDetails}>
                <Text style={styles.upiLabel}>UPI ID</Text>
                <Text style={styles.upiValue}>chetan202004@fam</Text>
              </View>
              <TouchableOpacity 
                style={[styles.copyButton, copied && styles.copyButtonSuccess]} 
                onPress={handleCopyId}
                activeOpacity={0.7}
              >
                {copied ? (
                  <Check size={16} color={MINT} />
                ) : (
                  <Copy size={16} color="#FFFFFF" />
                )}
                <Text style={[styles.copyButtonText, copied && { color: MINT }]}>
                  {copied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Step 2: Verification */}
        <View style={styles.stepHeaderRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Submit Verification</Text>
        </View>

        <View style={styles.verificationContainer}>
          
          {/* Information Banner */}
          <View style={styles.infoBanner}>
            <AlertCircle size={16} color={MINT} />
            <Text style={styles.infoBannerText}>
              Ensure you input the exact 12-digit UTR and a clear screenshot to prevent delays.
            </Text>
          </View>

          {/* UTR Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>12-Digit UTR Number <Text style={styles.requiredAsterisk}>*</Text></Text>
            <View style={[styles.inputContainer, utr.length > 5 && styles.inputContainerActive]}>
              <TextInput
                style={styles.input}
                placeholder="e.g. 324510XXXXXX"
                placeholderTextColor="#555560"
                value={utr}
                onChangeText={setUtr}
                keyboardType="number-pad"
                maxLength={12}
              />
              {utr.length > 5 && (
                <View style={styles.inputCheck}>
                  <Check size={16} color={MINT} />
                </View>
              )}
            </View>
          </View>

          {/* Screenshot Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Payment Screenshot <Text style={styles.requiredAsterisk}>*</Text></Text>
            <TouchableOpacity 
              style={[styles.uploadBox, hasScreenshot && styles.uploadBoxSuccess]}
              onPress={handleUploadScreenshot}
              activeOpacity={0.8}
            >
              {hasScreenshot ? (
                <View style={styles.uploadContent}>
                  <View style={styles.uploadIconCircleSuccess}>
                    <ImageIcon size={20} color={MINT} />
                  </View>
                  <View style={styles.uploadTexts}>
                    <Text style={styles.uploadTitleSuccess}>Screenshot.jpg</Text>
                    <Text style={styles.uploadSubtitleSuccess}>Successfully attached</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeUploadBtn} 
                    onPress={() => setHasScreenshot(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.removeUploadText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadContent}>
                  <View style={styles.uploadIconCircle}>
                    <Upload size={20} color={TEXT_MUTED} />
                  </View>
                  <View style={styles.uploadTexts}>
                    <Text style={styles.uploadTitle}>Upload Screenshot</Text>
                    <Text style={styles.uploadSubtitle}>JPG, PNG up to 5MB</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>

      {/* Sticky Confirm Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.confirmWrapper, !isFormValid && styles.confirmWrapperDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!isFormValid}
        >
          <LinearGradient
            colors={!isFormValid ? ['#2A2A2A', '#2A2A2A', '#2A2A2A'] : MINT_GRADIENT}
            style={styles.confirmGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ShieldCheck size={20} color={!isFormValid ? '#666' : '#000'} style={styles.btnIcon} />
            <Text style={[styles.confirmText, !isFormValid && styles.confirmTextDisabled]}>
              Confirm Payment
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconCircle}>
              <Wallet size={32} color={MINT} strokeWidth={2} />
              <View style={styles.modalCheckBadge}>
                <Check size={14} color="#000" strokeWidth={3} />
              </View>
            </View>
            <Text style={styles.modalTitle}>Processing Deposit</Text>
            <Text style={styles.modalSubtitle}>
              Your verification details have been received. The funds will be credited to your wallet momentarily.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal} activeOpacity={0.8}>
              <LinearGradient
                colors={MINT_GRADIENT}
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonText}>View Wallet</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120, // Space for bottom bar
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 208, 156, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.3)',
  },
  stepBadgeText: {
    color: MINT,
    fontSize: 14,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  paymentCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.2)',
    marginBottom: 32,
    backgroundColor: CARD_BG,
  },
  paymentCardGradient: {
    padding: 24,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 38,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  amountDecimal: {
    fontSize: 24,
    color: TEXT_MUTED,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: MINT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  scanText: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 20,
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upiDetails: {
    flex: 1,
  },
  upiLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 4,
  },
  upiValue: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  copyButtonSuccess: {
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    borderColor: 'rgba(0, 208, 156, 0.3)',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  verificationContainer: {
    gap: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.08)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.2)',
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    color: MINT,
    fontSize: 12,
    lineHeight: 18,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerActive: {
    borderColor: MINT,
    backgroundColor: 'rgba(0, 208, 156, 0.03)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
    letterSpacing: 1,
  },
  inputCheck: {
    marginLeft: 12,
  },
  uploadBox: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    padding: 20,
  },
  uploadBoxSuccess: {
    borderColor: MINT,
    borderStyle: 'solid',
    backgroundColor: 'rgba(0, 208, 156, 0.05)',
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconCircleSuccess: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 208, 156, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  uploadTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadSubtitle: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  uploadTitleSuccess: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadSubtitleSuccess: {
    color: MINT,
    fontSize: 12,
    fontWeight: '500',
  },
  removeUploadBtn: {
    padding: 8,
  },
  removeUploadText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: DARK_BG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  confirmWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmWrapperDisabled: {
    opacity: 0.6,
  },
  confirmGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnIcon: {
    marginTop: -1,
  },
  confirmText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  confirmTextDisabled: {
    color: '#666',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.2)',
    position: 'relative',
  },
  modalCheckBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: MINT,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: CARD_BG,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  modalButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
