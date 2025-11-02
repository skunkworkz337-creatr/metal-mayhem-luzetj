
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import { CURRENT_USER, verifyEmail, verifyPhone, completeOnboarding } from '@/data/users';

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [phone, setPhone] = useState(CURRENT_USER.phone || '');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleSendEmailCode = () => {
    // In production, this would call an API to send verification email
    console.log('Sending email verification code to:', email);
    Alert.alert('Verification Code Sent', 'Check your email for the verification code');
  };

  const handleVerifyEmail = () => {
    if (emailCode.length === 6) {
      // In production, verify the code with backend
      const updatedUser = verifyEmail(CURRENT_USER, emailCode);
      setEmailVerified(true);
      Alert.alert('Success', 'Email verified successfully!');
      setStep(3);
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
    }
  };

  const handleSendPhoneCode = () => {
    // In production, this would call an API to send SMS verification
    console.log('Sending SMS verification code to:', phone);
    Alert.alert('Verification Code Sent', 'Check your phone for the verification code');
  };

  const handleVerifyPhone = () => {
    if (phoneCode.length === 6) {
      // In production, verify the code with backend
      const updatedUser = verifyPhone(CURRENT_USER, phoneCode);
      setPhoneVerified(true);
      Alert.alert('Success', 'Phone verified successfully!');
      setStep(4);
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
    }
  };

  const handleCompleteOnboarding = () => {
    if (emailVerified && phoneVerified) {
      const updatedUser = completeOnboarding(CURRENT_USER);
      Alert.alert(
        'Welcome to MetalMayhem!',
        'Your account is now verified. You&apos;ve earned the "Verified User" badge!',
        [
          {
            text: 'Get Started',
            onPress: () => router.replace('/(tabs)/metalTypes'),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Please verify both email and phone to complete onboarding');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <IconSymbol name="person.fill" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Welcome to MetalMayhem</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        Let&apos;s get your account set up. Complete verification to earn your first badge!
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.outline }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.outline }]}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.outline }]}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => setStep(2)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Continue</Text>
        <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <IconSymbol name="envelope.fill" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Verify Email</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        We&apos;ll send a verification code to {email}
      </Text>

      {!emailVerified && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSendEmailCode}
            activeOpacity={0.7}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Send Verification Code</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Verification Code</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.outline }]}
              value={emailCode}
              onChangeText={setEmailCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleVerifyEmail}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Verify Email</Text>
            <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}

      {emailVerified && (
        <View style={[styles.successBox, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
          <IconSymbol name="checkmark.circle.fill" size={32} color={colors.primary} />
          <Text style={[styles.successText, { color: colors.primary }]}>Email Verified!</Text>
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <IconSymbol name="phone.fill" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Verify Phone</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        We&apos;ll send a verification code to {phone}
      </Text>

      {!phoneVerified && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSendPhoneCode}
            activeOpacity={0.7}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Send Verification Code</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Verification Code</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.outline }]}
              value={phoneCode}
              onChangeText={setPhoneCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleVerifyPhone}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Verify Phone</Text>
            <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}

      {phoneVerified && (
        <View style={[styles.successBox, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
          <IconSymbol name="checkmark.circle.fill" size={32} color={colors.primary} />
          <Text style={[styles.successText, { color: colors.primary }]}>Phone Verified!</Text>
        </View>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <IconSymbol name="checkmark.seal.fill" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>All Set!</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        Your account is verified. Complete onboarding to earn your first badge!
      </Text>

      <View style={[styles.badgePreview, { backgroundColor: colors.card, borderColor: colors.outline }]}>
        <IconSymbol name="checkmark.seal.fill" size={64} color={colors.primary} />
        <Text style={[styles.badgeName, { color: colors.text }]}>Verified User</Text>
        <Text style={[styles.badgeDescription, { color: colors.textSecondary }]}>
          Completed onboarding with verified contact information
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleCompleteOnboarding}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Complete Onboarding</Text>
        <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor: s <= step ? colors.primary : colors.textSecondary,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.stepIndicator, { color: colors.textSecondary }]}>
          Step {step} of 4
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 12,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 20,
    width: '100%',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
  },
  badgePreview: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 24,
    width: '100%',
  },
  badgeName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  badgeDescription: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
});
