import { Ionicons } from '@expo/vector-icons';
import { isClerkAPIResponseError } from '@clerk/clerk-expo';
import { useSSO, useSignIn, useSignUp } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { AppLogo } from '../components/AppLogo';
import { AppTextInput } from '../components/AppTextInput';
import { ThemedText } from '../components/ThemedText';
import type { AuthScreenProps } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

const GOOGLE_G_BLUE = '#4285F4';

export function SignInScreen({ route, navigation }: AuthScreenProps<'SignIn'>) {
  const { colors, spacing } = useTheme();
  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [busy, setBusy] = useState(false);
  const [emailFormVisible, setEmailFormVisible] = useState(() => route.params?.startGoogle !== true);
  const didAutoGoogleAttempt = useRef(false);

  const startGoogle = route.params?.startGoogle === true;

  useEffect(() => {
    setEmailFormVisible(route.params?.startGoogle !== true);
    if (route.params?.startGoogle !== true) {
      didAutoGoogleAttempt.current = false;
    }
  }, [route.params?.startGoogle]);

  useEffect(() => {
    if (!startGoogle || !signInLoaded || didAutoGoogleAttempt.current) return;
    let cancelled = false;
    void (async () => {
      didAutoGoogleAttempt.current = true;
      navigation.setParams({ startGoogle: false });
      setBusy(true);
      try {
        const redirect = Linking.createURL('oauth-callback', { scheme: 'devault' });
        const { createdSessionId, setActive: sa } = await startSSOFlow({
          strategy: 'oauth_google',
          redirectUrl: redirect,
        });
        if (cancelled) return;
        if (createdSessionId && sa) {
          await sa({ session: createdSessionId });
        }
      } catch (e) {
        if (!cancelled) {
          setEmailFormVisible(true);
          didAutoGoogleAttempt.current = false;
          const msg = e instanceof Error ? e.message : 'Google sign-in failed';
          Alert.alert('Sign in', msg);
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigation, startGoogle, signInLoaded, startSSOFlow]);

  const onGoogle = async () => {
    setBusy(true);
    try {
      const redirect = Linking.createURL('oauth-callback', { scheme: 'devault' });
      const { createdSessionId, setActive: sa } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: redirect,
      });
      if (createdSessionId && sa) {
        await sa({ session: createdSessionId });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Google sign-in failed';
      Alert.alert('Sign in', msg);
    } finally {
      setBusy(false);
    }
  };

  const onSignIn = async () => {
    if (!signInLoaded || !signIn || !setActive) return;
    setBusy(true);
    try {
      const attempt = await signIn.create({
        identifier: email.trim(),
        password,
      });
      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        return;
      }
      Alert.alert('Sign in', 'Additional verification required. Try resetting password in Clerk or use Google.');
    } catch (e) {
      const msg = isClerkAPIResponseError(e)
        ? e.errors[0]?.longMessage ?? e.errors[0]?.message
        : e instanceof Error
          ? e.message
          : 'Sign in failed';
      Alert.alert('Sign in', msg);
    } finally {
      setBusy(false);
    }
  };

  const onSignUp = async () => {
    if (!signUpLoaded || !signUp) return;
    setBusy(true);
    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (e) {
      const msg = isClerkAPIResponseError(e)
        ? e.errors[0]?.longMessage ?? e.errors[0]?.message
        : e instanceof Error
          ? e.message
          : 'Sign up failed';
      Alert.alert('Sign up', msg);
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async () => {
    if (!signUpLoaded || !signUp || !setActiveSignUp) return;
    setBusy(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActiveSignUp({ session: attempt.createdSessionId });
        return;
      }
      Alert.alert('Verify', 'Could not complete verification.');
    } catch (e) {
      const msg = isClerkAPIResponseError(e)
        ? e.errors[0]?.longMessage ?? e.errors[0]?.message
        : e instanceof Error
          ? e.message
          : 'Verification failed';
      Alert.alert('Verify', msg);
    } finally {
      setBusy(false);
    }
  };

  if (!emailFormVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.xl,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="logo-google" size={44} color={GOOGLE_G_BLUE} />
          </View>
          <AppLogo size={64} style={{ marginBottom: spacing.md }} />
          <ThemedText variant="title" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
            Sign in with Google
          </ThemedText>
          <ThemedText color="secondary" style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            Continuing in your browser…
          </ThemedText>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!signInLoaded || !signUpLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <AppLogo size={80} />
            <ThemedText variant="subtitle" style={{ marginTop: spacing.sm }}>
              DevVault
            </ThemedText>
          </View>
          <View
            style={{
              backgroundColor: colors.surfaceElevated,
              borderRadius: 24,
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <ThemedText variant="title" style={{ marginBottom: spacing.sm, textAlign: 'center', fontSize: 30, lineHeight: 36 }}>
              {pendingVerification ? 'Check your email' : mode === 'signIn' ? 'Welcome back.' : 'Create account'}
            </ThemedText>
            <ThemedText color="secondary" style={{ marginBottom: spacing.lg, textAlign: 'center' }}>
              {pendingVerification
                ? 'Enter the code we sent to your email.'
                : 'Sign in to your workspace.'}
            </ThemedText>

            {pendingVerification ? (
              <>
                <AppTextInput label="Verification code" value={code} onChangeText={setCode} autoCapitalize="none" />
                <AppButton title="Verify & continue" onPress={onVerify} loading={busy} />
              </>
            ) : (
              <>
                <AppButton
                  title="Continue with Google"
                  variant="google"
                  leftIcon={<Ionicons name="logo-google" size={22} color={GOOGLE_G_BLUE} />}
                  onPress={onGoogle}
                  loading={busy}
                />
                <View style={{ height: spacing.md }} />
                <ThemedText color="muted" style={{ textAlign: 'center', marginBottom: spacing.md }}>
                  or email
                </ThemedText>
                <AppTextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <AppTextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {mode === 'signIn' ? (
                  <Pressable onPress={() => Alert.alert('Reset password', 'Use "Create Account" if you need a new login, or reset password from Clerk dashboard.')}>
                    <ThemedText color="primary" style={{ textAlign: 'right', marginTop: -spacing.xs, marginBottom: spacing.md }}>
                      Forgot?
                    </ThemedText>
                  </Pressable>
                ) : null}
                <AppButton
                  title={mode === 'signIn' ? 'Sign In' : 'Create Account'}
                  leftIcon={<Ionicons name="mail-outline" size={22} color={colors.primaryText} />}
                  onPress={mode === 'signIn' ? onSignIn : onSignUp}
                  loading={busy}
                />
                <View style={{ height: spacing.md }} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <ThemedText color="secondary">
                    {mode === 'signIn' ? "Don't have an account? " : 'Have an account? '}
                  </ThemedText>
                  <Pressable
                    onPress={() => {
                      setMode(mode === 'signIn' ? 'signUp' : 'signIn');
                      setPendingVerification(false);
                    }}
                  >
                    <ThemedText color="primary">
                      {mode === 'signIn' ? 'Create Account' : 'Sign In'}
                    </ThemedText>
                  </Pressable>
                </View>
              </>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.md, marginTop: spacing.lg }}>
            <ThemedText variant="caption" color="muted">Terms</ThemedText>
            <ThemedText variant="caption" color="muted">Privacy</ThemedText>
            <ThemedText variant="caption" color="muted">Help</ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
