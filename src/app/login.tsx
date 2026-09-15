import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Edit3,
  X,
  Zap,
  Lock,
  CheckCircle2,
} from 'lucide-react-native';

const DARK_BG = '#050505';
const CARD_BG = '#111111';
const CARD_BG_LIGHT = '#161616';
const TEXT_MUTED = '#8B93A5';
const MINT = '#00D09C';
const MINT_GRADIENT = ['#00E5AE', '#00D09C', '#00A67D'] as const;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 16;

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [isSuccess, setIsSuccess] = useState(false);

  const otpInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && resendSeconds > 0) {
      timer = setInterval(() => {
        setResendSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendSeconds]);

  const switchStepAnimation = (nextStep: 'email' | 'otp') => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setStep(nextStep);
  };

  const handleSendOtp = () => {
    setErrorMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMessage('Please enter a valid email format (e.g. name@domain.com).');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    // Simulate secure OTP dispatch
    setTimeout(() => {
      setIsLoading(false);
      setResendSeconds(30);
      setOtp('');
      switchStepAnimation('otp');
    }, 900);
  };

  const handleVerifyOtp = () => {
    setErrorMessage(null);
    if (otp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 600);
    }, 1000);
  };

  const handleResendOtp = () => {
    if (resendSeconds > 0) return;
    setResendSeconds(30);
    setErrorMessage(null);
    setOtp('');
    // Brief haptic or feedback
  };

  const handleAutoFillEmail = () => {
    setEmail('katty2026@payu.io');
    setErrorMessage(null);
  };

  const handleAutoFillOtp = () => {
    setOtp('228013');
    setErrorMessage(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Ambient Top Glow */}
        <View style={styles.ambientGlow} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={[styles.contentContainer, { paddingTop: topPadding }]}>
            
            {/* Brand Logo & Header */}
            <View style={styles.headerSection}>
              {/* PayU Luxury Emblem */}
              <View style={styles.logoWrapper}>
                <LinearGradient
                  colors={MINT_GRADIENT}
                  style={styles.logoBorder}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.logoInner}>
                    <Text style={styles.logoText}>P</Text>
                    <View style={styles.logoDot} />
                  </View>
                </LinearGradient>
              </View>

              <Text style={styles.brandTitle}>PayU</Text>
             

              <Text style={styles.welcomeTitle}>
                {step === 'email' ? 'Sign In to Your Account' : 'Enter Verification Code'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {step === 'email'
                  ? ''
                  : `Enter the 6-digit authentication passcode sent to:`}
              </Text>

              {step === 'otp' && (
                <View style={styles.emailPillRow}>
                  <Text style={styles.targetEmailText}>{email}</Text>
                  <TouchableOpacity
                    onPress={() => switchStepAnimation('email')}
                    style={styles.editEmailBtn}
                    activeOpacity={0.7}
                  >
                    <Edit3 size={13} color={MINT} />
                    <Text style={styles.editEmailText}>Change</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Error Message */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Dynamic Step Content with Animation */}
            <Animated.View style={[styles.formSection, { opacity: fadeAnim }]}>
              {step === 'email' ? (
                /* STEP 1: EMAIL INPUT */
                <View style={styles.stepContainer}>
                  <Text style={styles.inputLabel}>Registered Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconBox}>
                      <Mail size={18} color={email ? MINT : TEXT_MUTED} />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. katty2026@payu.io"
                      placeholderTextColor="#5A5866"
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleSendOtp}
                    />
                    {email.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setEmail('')}
                        style={styles.clearBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <X size={15} color={TEXT_MUTED} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Quick One-Tap Demo Email Chip */}
                  <TouchableOpacity
                    onPress={handleAutoFillEmail}
                    style={styles.demoEmailChip}
                    activeOpacity={0.75}
                  >
                    <Zap size={13} color={MINT} />
                    <Text style={styles.demoEmailText}>
                      Auto-fill demo: <Text style={styles.demoEmailHighlight}>katty2026@payu.io</Text>
                    </Text>
                  </TouchableOpacity>

                  {/* Send OTP CTA */}
                  <TouchableOpacity
                    onPress={handleSendOtp}
                    disabled={isLoading}
                    style={styles.primaryBtnWrapper}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={MINT_GRADIENT}
                      style={styles.primaryBtnGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#000000" size="small" />
                      ) : (
                        <>
                          <Text style={styles.primaryBtnText}>Send OTP</Text>
                          <ArrowRight size={18} color="#000000" strokeWidth={2.2} />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                /* STEP 2: OTP VERIFICATION */
                <View style={styles.stepContainer}>
                  <Text style={styles.inputLabel}>6-Digit Security Passcode</Text>

                  {/* 6 Digit Visual Boxes */}
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => otpInputRef.current?.focus()}
                    style={styles.otpBoxesRow}
                  >
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const char = otp[index] || '';
                      const isFocused = otp.length === index;

                      return (
                        <View
                          key={index}
                          style={[
                            styles.otpBox,
                            isFocused && styles.otpBoxFocused,
                            char.length > 0 && styles.otpBoxFilled,
                          ]}
                        >
                          <Text style={styles.otpBoxChar}>{char}</Text>
                        </View>
                      );
                    })}
                  </TouchableOpacity>

                  {/* Hidden Real TextInput for Native Keyboard */}
                  <TextInput
                    ref={otpInputRef}
                    style={styles.hiddenInput}
                    value={otp}
                    onChangeText={(val) => {
                      const sanitized = val.replace(/[^0-9]/g, '').slice(0, 6);
                      setOtp(sanitized);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus={true}
                  />

                  {/* Quick Auto-fill OTP Chip */}
                  <TouchableOpacity
                    onPress={handleAutoFillOtp}
                    style={styles.demoEmailChip}
                    activeOpacity={0.75}
                  >
                    <Zap size={13} color={MINT} />
                    <Text style={styles.demoEmailText}>
                      Auto-fill OTP: <Text style={styles.demoEmailHighlight}>228013</Text>
                    </Text>
                  </TouchableOpacity>

                  {/* Resend Timer & Action */}
                  <View style={styles.resendRow}>
                    {resendSeconds > 0 ? (
                      <Text style={styles.resendTimerText}>
                        Resend code in <Text style={{ color: MINT, fontWeight: '700' }}>{resendSeconds}s</Text>
                      </Text>
                    ) : (
                      <TouchableOpacity
                        onPress={handleResendOtp}
                        style={styles.resendActionBtn}
                        activeOpacity={0.7}
                      >
                        <RotateCcw size={13} color={MINT} />
                        <Text style={styles.resendActionText}>Resend OTP</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Log In CTA Button */}
                  <TouchableOpacity
                    onPress={handleVerifyOtp}
                    disabled={isLoading || isSuccess}
                    style={styles.primaryBtnWrapper}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={MINT_GRADIENT}
                      style={styles.primaryBtnGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#000000" size="small" />
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 size={18} color="#000000" strokeWidth={2.5} />
                          <Text style={styles.primaryBtnText}>Authenticated</Text>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} color="#000000" strokeWidth={2.2} />
                          <Text style={styles.primaryBtnText}>Log In</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>

            {/* Footer Security Notice (No Sign-up links) */}
            <View style={styles.footerSection}>
              <View style={styles.securityBadgeRow}>
                <Lock size={12} color={TEXT_MUTED} />
                <Text style={styles.securityText}>
                  256-Bit Encrypted Session • Authorized Access Only
                </Text>
              </View>
              <Text style={styles.footerHelpText}>
                Need assistance? Contact your designated settlement desk.
              </Text>
            </View>

          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  ambientGlow: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 320,
    height: 240,
    borderRadius: 160,
    backgroundColor: 'rgba(0, 208, 156, 0.08)',
    transform: [{ scaleX: 1.5 }],
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoWrapper: {
    marginBottom: 12,
    shadowColor: MINT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoBorder: {
    width: 64,
    height: 64,
    borderRadius: 22,
    padding: 2,
  },
  logoInner: {
    flex: 1,
    backgroundColor: '#0D0C13',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoDot: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MINT,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  badgeContainer: {
    backgroundColor: 'rgba(0, 208, 156, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 208, 156, 0.3)',
    marginBottom: 16,
  },
  badgeText: {
    color: MINT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  emailPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.25)',
    marginTop: 10,
    gap: 8,
  },
  targetEmailText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  editEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 4,
  },
  editEmailText: {
    color: MINT,
    fontSize: 12,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  formSection: {
    marginTop: 16,
  },
  stepContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    height: 54,
  },
  inputIconBox: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  demoEmailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 208, 156, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 208, 156, 0.25)',
    marginTop: 10,
    gap: 6,
  },
  demoEmailText: {
    color: TEXT_MUTED,
    fontSize: 11,
  },
  demoEmailHighlight: {
    color: MINT,
    fontWeight: '600',
  },
  primaryBtnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: MINT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
  },
  primaryBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: MINT,
    backgroundColor: '#1E1B24',
    borderWidth: 1.5,
  },
  otpBoxFilled: {
    borderColor: 'rgba(0, 208, 156, 0.4)',
    backgroundColor: '#18161F',
  },
  otpBoxChar: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 12,
  },
  resendTimerText: {
    color: TEXT_MUTED,
    fontSize: 13,
  },
  resendActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resendActionText: {
    color: MINT,
    fontSize: 13,
    fontWeight: '600',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  securityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  footerHelpText: {
    fontSize: 11,
    color: '#555461',
    textAlign: 'center',
  },
});
