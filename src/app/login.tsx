import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Mail,
  ArrowRight,
  Edit3,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
  X,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../context/AuthContext';
import { sendOtp } from '../services';

type AuthStep = 'email' | 'otp' | 'register' | 'password_login';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 12;
  const { loginWithOtp, loginWithPassword, registerUser } = useAuth();

  // Step state
  const [step, setStep] = useState<AuthStep>('email');

  // Input fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & loaders
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Welcome Back!');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Refs
  const otpInputRef = useRef<TextInput>(null);

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

  const animateToStep = (nextStep: AuthStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -15,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      setErrorMessage(null);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async () => {
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email format (e.g. name@domain.com).');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      await sendOtp(cleanEmail);
      setIsLoading(false);
      setResendSeconds(30);
      setOtp('');
      animateToStep('otp');
    } catch (err: any) {
      setIsLoading(false);
      const rawMsg = err.message || '';
      const msg = rawMsg.toLowerCase();

      // If backend reports no existing account with this email, seamlessly transition to registration
      if (
        msg.includes('no account found') ||
        msg.includes('user not found') ||
        msg.includes('not registered') ||
        msg.includes('does not exist')
      ) {
        animateToStep('register');
      } else {
        setErrorMessage(rawMsg || 'Failed to send verification code. Please check your email.');
      }
    }
  };

  // Step 2: Verify OTP and Branch
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const finalOtp = (codeToVerify || otp).trim();
    setErrorMessage(null);

    if (finalOtp.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const result = await loginWithOtp(email.trim().toLowerCase(), finalOtp);

      setIsLoading(false);

      if (result.isNewUser) {
        // User is NEW -> Redirect to Step 3 (Registration)
        animateToStep('register');
      } else {
        // User ALREADY EXISTS -> Redirect to Home
        setSuccessMessage(`Welcome Back, ${result.user?.fullName || 'Member'}!`);
        setIsSuccess(true);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 600);
      }
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.message || '';
      // If backend reports user doesn't exist, transition to registration
      if (
        msg.toLowerCase().includes('not registered') ||
        msg.toLowerCase().includes('user not found') ||
        msg.toLowerCase().includes('register')
      ) {
        animateToStep('register');
      } else {
        setErrorMessage(msg || 'Verification failed. Please check the code and try again.');
      }
    }
  };

  // Step 3: Complete Registration for New User
  const handleCompleteRegistration = async () => {
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      await registerUser({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setIsLoading(false);
      setSuccessMessage(`Welcome to PayU, ${fullName.trim()}!`);
      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  // Optional: Direct Password Login
  const handlePasswordLogin = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      await loginWithPassword(email.trim().toLowerCase(), password);
      setIsLoading(false);
      setSuccessMessage('Signed in successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 600);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Invalid email or password.');
    }
  };

  const handlePasteOtp = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      const clean = text.replace(/[^0-9]/g, '').slice(0, 6);
      if (clean.length === 6) {
        setOtp(clean);
        handleVerifyOtp(clean);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadge}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.brandName}>PayU</Text>
            <Text style={styles.brandSubtitle}>Fast • Secure • Daily Rewards</Text>
          </View>

          {/* Stepper Indicator */}
          {step !== 'password_login' && (
            <View style={styles.stepperContainer}>
              <View
                style={[
                  styles.stepPill,
                  step === 'email' ? styles.stepPillActive : styles.stepPillDone,
                ]}
              >
                {step !== 'email' ? (
                  <CheckCircle2 size={13} color="#10B981" />
                ) : (
                  <View style={styles.stepNumDot} />
                )}
                <Text
                  style={[
                    styles.stepPillText,
                    step === 'email' ? styles.stepTextActive : styles.stepTextDone,
                  ]}
                >
                  1. Email
                </Text>
              </View>

              <View style={styles.stepLine} />

              <View
                style={[
                  styles.stepPill,
                  step !== 'email' ? styles.stepPillActive : styles.stepPillInactive,
                ]}
              >
                <View
                  style={[
                    styles.stepNumDot,
                    step === 'email' && { backgroundColor: '#CBD5E1' },
                  ]}
                />
                <Text
                  style={[
                    styles.stepPillText,
                    step !== 'email' ? styles.stepTextActive : styles.stepTextInactive,
                  ]}
                >
                  {step === 'register' ? '2. Create Profile' : '2. Verify OTP'}
                </Text>
              </View>
            </View>
          )}

          {/* Main Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* SUCCESS STATE */}
            {isSuccess ? (
              <View style={styles.successWrapper}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={52} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>{successMessage}</Text>
                <Text style={styles.successSub}>Redirecting to your dashboard...</Text>
                <ActivityIndicator color="#7C3AED" style={{ marginTop: 20 }} />
              </View>
            ) : step === 'email' ? (
              /* ================= STEP 1: ENTER EMAIL ================= */
              <View>
                <Text style={styles.cardTitle}>Welcome</Text>
                <Text style={styles.cardSubtitle}>
                  Enter your email address to sign in or create an account.
                </Text>

                {/* Email Input Field */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconBox}>
                    <Mail size={19} color="#7C3AED" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="name@example.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                  />
                  {email.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setEmail('')}
                      style={styles.clearBtn}
                    >
                      <X size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Error Banner */}
                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                {/* Submit: Send OTP */}
                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && { opacity: 0.6 }]}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtnGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.primaryBtnText}>Continue with Email</Text>
                        <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Optional: Sign in with Password toggle */}
                <TouchableOpacity
                  style={styles.secondaryToggle}
                  onPress={() => animateToStep('password_login')}
                  activeOpacity={0.7}
                >
                  <KeyRound size={15} color="#7C3AED" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryToggleText}>Sign in with Password instead</Text>
                </TouchableOpacity>
              </View>
            ) : step === 'otp' ? (
              /* ================= STEP 2: VERIFY OTP ================= */
              <View>
                <Text style={styles.cardTitle}>Verify Code</Text>
                <Text style={styles.cardSubtitle}>
                  We've sent a 6-digit verification code to:
                </Text>

                {/* Email Badge with Change Option */}
                <View style={styles.emailBadgeRow}>
                  <Text style={styles.emailBadgeText} numberOfLines={1}>
                    {email}
                  </Text>
                  <TouchableOpacity
                    style={styles.changeEmailBtn}
                    onPress={() => animateToStep('email')}
                    activeOpacity={0.7}
                  >
                    <Edit3 size={13} color="#7C3AED" style={{ marginRight: 3 }} />
                    <Text style={styles.changeEmailText}>Change</Text>
                  </TouchableOpacity>
                </View>

                {/* 6 Digit Cells Visual Display */}
                <TouchableOpacity
                  style={styles.otpGrid}
                  activeOpacity={1}
                  onPress={() => otpInputRef.current?.focus()}
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = otp[index] || '';
                    const isCurrent = otp.length === index;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.otpCell,
                          digit ? styles.otpCellFilled : null,
                          isCurrent ? styles.otpCellActive : null,
                        ]}
                      >
                        <Text style={styles.otpDigitText}>{digit}</Text>
                      </View>
                    );
                  })}
                </TouchableOpacity>

                {/* Invisible input capturing keystrokes */}
                <TextInput
                  ref={otpInputRef}
                  value={otp}
                  onChangeText={(val) => {
                    const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
                    setOtp(clean);
                    if (errorMessage) setErrorMessage(null);
                    if (clean.length === 6) {
                      handleVerifyOtp(clean);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.hiddenInput}
                  autoFocus
                />

                {/* Helper Row: Paste & Resend */}
                <View style={styles.otpHelperRow}>
                  <TouchableOpacity
                    style={styles.pasteBtn}
                    onPress={handlePasteOtp}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pasteBtnText}>Paste Code</Text>
                  </TouchableOpacity>

                  {resendSeconds > 0 ? (
                    <Text style={styles.resendTimerText}>
                      Resend in <Text style={{ color: '#7C3AED', fontWeight: '700' }}>{resendSeconds}s</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendOtp} activeOpacity={0.7}>
                      <Text style={styles.resendActiveText}>Resend Code</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Error Banner */}
                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                {/* Verify Button */}
                <TouchableOpacity
                  style={[styles.primaryBtn, (otp.length < 6 || isLoading) && { opacity: 0.6 }]}
                  onPress={() => handleVerifyOtp()}
                  disabled={otp.length < 6 || isLoading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtnGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                        <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : step === 'register' ? (
              /* ================= STEP 3: COMPLETE REGISTRATION (NEW USER) ================= */
              <View>
                <View style={styles.newMemberBadge}>
                  <Sparkles size={14} color="#7C3AED" />
                  <Text style={styles.newMemberBadgeText}>New Member Account Setup</Text>
                </View>

                <Text style={styles.cardTitle}>Create Account</Text>
                <Text style={styles.cardSubtitle}>
                  No existing account found. Enter your details below to activate your account.
                </Text>

                {/* Email Banner with Change button */}
                <View style={styles.verifiedEmailBox}>
                  <Mail size={18} color="#7C3AED" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.verifiedEmailLabel}>Account Email</Text>
                    <Text style={styles.verifiedEmailVal}>{email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.changeEmailBtn}
                    onPress={() => animateToStep('email')}
                    activeOpacity={0.7}
                  >
                    <Edit3 size={13} color="#7C3AED" style={{ marginRight: 3 }} />
                    <Text style={styles.changeEmailText}>Change</Text>
                  </TouchableOpacity>
                </View>

                {/* Field 1: Full Name */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Full Legal Name</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconBox}>
                      <User size={18} color="#7C3AED" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={(val) => {
                        setFullName(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="e.g. Rahul Sharma"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Field 2: Phone Number */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Mobile Number</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconBox}>
                      <Phone size={18} color="#7C3AED" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={phoneNumber}
                      onChangeText={(val) => {
                        setPhoneNumber(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="e.g. 9876543210"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Field 3: Create Password */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Create Password</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconBox}>
                      <Lock size={18} color="#7C3AED" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={password}
                      onChangeText={(val) => {
                        setPassword(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.clearBtn}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color="#64748B" />
                      ) : (
                        <Eye size={18} color="#64748B" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error Banner */}
                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                {/* Register & Enter Button */}
                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && { opacity: 0.6 }]}
                  onPress={handleCompleteRegistration}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtnGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.primaryBtnText}>Create Account & Sign In</Text>
                        <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Return to Sign In */}
                <TouchableOpacity
                  style={styles.secondaryToggle}
                  onPress={() => animateToStep('email')}
                  activeOpacity={0.7}
                >
                  <RotateCcw size={15} color="#7C3AED" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryToggleText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* ================= OPTIONAL: PASSWORD LOGIN ================= */
              <View>
                <Text style={styles.cardTitle}>Sign In</Text>
                <Text style={styles.cardSubtitle}>
                  Enter your email and account password to sign in.
                </Text>

                {/* Email Field */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconBox}>
                    <Mail size={19} color="#7C3AED" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Field */}
                <View style={[styles.inputContainer, { marginTop: 12 }]}>
                  <View style={styles.inputIconBox}>
                    <Lock size={19} color="#7C3AED" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.clearBtn}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#64748B" />
                    ) : (
                      <Eye size={18} color="#64748B" />
                    )}
                  </TouchableOpacity>
                </View>

                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                {/* Sign In Button */}
                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && { opacity: 0.6 }]}
                  onPress={handlePasswordLogin}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtnGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.primaryBtnText}>Sign In</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Return to OTP login */}
                <TouchableOpacity
                  style={styles.secondaryToggle}
                  onPress={() => animateToStep('email')}
                  activeOpacity={0.7}
                >
                  <RotateCcw size={15} color="#7C3AED" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryToggleText}>Sign in with Email OTP instead</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          {/* Trust Footer */}
          <View style={styles.trustFooter}>
            <ShieldCheck size={16} color="#10B981" />
            <Text style={styles.trustFooterText}>Bank-grade 256-bit encryption • NPCI compliant</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Brand Header
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },

  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  stepPillActive: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  stepPillDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  stepPillInactive: {
    opacity: 0.6,
  },
  stepNumDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
  stepPillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  stepTextDone: {
    color: '#15803D',
    fontWeight: '700',
  },
  stepTextInactive: {
    color: '#94A3B8',
  },
  stepLine: {
    width: 14,
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },

  // Card Container
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 20,
  },

  // Inputs
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIconBox: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    height: '100%',
  },
  clearBtn: {
    padding: 6,
  },

  // Buttons
  primaryBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 18,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  secondaryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 6,
  },
  secondaryToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },

  // Error Banner
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
  },

  // Step 2 OTP Specifics
  emailBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  emailBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
    flex: 1,
    marginRight: 8,
  },
  changeEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeEmailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpCell: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCellActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
  otpCellFilled: {
    borderColor: '#DDD6FE',
    backgroundColor: '#FFFFFF',
  },
  otpDigitText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpHelperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  pasteBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  pasteBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  resendTimerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  resendActiveText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '700',
  },

  // Step 3 Register Specifics
  newMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
    marginBottom: 8,
  },
  newMemberBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#7C3AED',
  },
  verifiedEmailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  verifiedEmailLabel: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '500',
  },
  verifiedEmailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  verifiedTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  fieldWrapper: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  // Success Celebration
  successWrapper: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
  },

  // Trust Footer
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  trustFooterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});
