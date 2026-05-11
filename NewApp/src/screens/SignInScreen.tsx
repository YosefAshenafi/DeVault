import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Eye, EyeOff, Mail } from 'lucide-react-native';
import { lightColors, darkColors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const GoogleIcon = () => (
  <View style={styles.googleIconWrapper}>
    <Image 
      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
      style={styles.googleIconImage} 
      resizeMode="contain"
    />
  </View>
);

export default function SignInScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const theme = isDark ? darkColors : lightColors;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSignIn = () => {
    navigation.replace('Main');
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    brandVault: {
      fontSize: 34,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    mainHeadline: {
      fontSize: 38,
      fontWeight: '800',
      color: theme.textPrimary,
      textAlign: 'center',
      lineHeight: 46,
      marginBottom: 20,
    },
    mainSubheadline: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
    },
    actionSection: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.surface,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
      borderTopWidth: 1,
      borderTopColor: theme.outlineVariant,
    },
    googleActionButton: {
      width: '100%',
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? theme.surfaceContainer : '#FFFFFF', 
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    googleActionText: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    formHeadline: {
      fontSize: 32,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    formSubheadline: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 32,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textSecondary,
      marginLeft: 4,
    },
    textInput: {
      backgroundColor: theme.surfaceContainer,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: theme.textPrimary,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceContainer,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      borderRadius: 14,
      paddingRight: 16,
    },
    passwordTextInput: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: theme.textPrimary,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {!showEmailForm ? (
          <View style={styles.mainWrapper}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.landingScroll}
            >
              {/* Illustration Section */}
              <View style={styles.illustrationSection}>
                <Image 
                  source={{ uri: 'file:///Users/yosef/.gemini/antigravity/brain/eba173b1-bf61-4dd6-93d7-0a19a25f9780/clean_brain_illustration_png_1778269591918.png' }}
                  style={styles.brainIllustration}
                  resizeMode="contain"
                />
                <View style={styles.brandTitleWrapper}>
                  <Text style={styles.brandDev}>DEV</Text>
                  <Text style={dynamicStyles.brandVault}> VAULT</Text>
                </View>
              </View>

              {/* Text Content */}
              <View style={styles.copySection}>
                <Text style={dynamicStyles.mainHeadline}>Search your dev brain later.</Text>
                <Text style={dynamicStyles.mainSubheadline}>
                  Stop digging through browser history. Every snippet, note, and doc you save is instantly indexed and ready for deep discovery.
                </Text>
              </View>
            </ScrollView>

            {/* Bottom Actions Fixed at bottom */}
            <View style={dynamicStyles.actionSection}>
              <TouchableOpacity 
                style={[styles.primaryEmailButton, { backgroundColor: theme.primary }]} 
                onPress={() => setShowEmailForm(true)}
              >
                <View style={styles.buttonContent}>
                  <Mail color="#FFFFFF" size={20} style={styles.buttonIcon} />
                  <Text style={styles.primaryEmailButtonText}>Continue with Email</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={dynamicStyles.googleActionButton} onPress={handleSignIn}>
                <GoogleIcon />
                <Text style={dynamicStyles.googleActionText}>Continue with Google</Text>
              </TouchableOpacity>
              
              <View style={styles.privacyFooter}>
                <Text style={[styles.privacyText, { color: theme.textTertiary }]}>
                  By continuing, you agree to our Terms and Data Policy.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <TouchableOpacity 
              style={styles.backLink} 
              onPress={() => setShowEmailForm(false)}
            >
              <ChevronLeft color={theme.primary} size={24} />
              <Text style={[styles.backLinkLabel, { color: theme.primary }]}>Back</Text>
            </TouchableOpacity>

            <Text style={dynamicStyles.formHeadline}>Sign In</Text>
            <Text style={dynamicStyles.formSubheadline}>Access your saved resources</Text>

            <View style={styles.fieldsWrapper}>
              <View style={styles.inputBox}>
                <Text style={dynamicStyles.inputLabel}>Email</Text>
                <TextInput
                  style={dynamicStyles.textInput}
                  placeholder="email@example.com"
                  placeholderTextColor={theme.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={dynamicStyles.inputLabel}>Password</Text>
                <View style={dynamicStyles.passwordRow}>
                  <TextInput
                    style={dynamicStyles.passwordTextInput}
                    placeholder="••••••••"
                    placeholderTextColor={theme.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff color={theme.textTertiary} size={20} />
                    ) : (
                      <Eye color={theme.textTertiary} size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.authButton, { backgroundColor: theme.primary }]} 
                onPress={handleSignIn}
              >
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  landingScroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 220, 
  },
  illustrationSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brainIllustration: {
    width: width * 0.85,
    height: width * 0.75,
  },
  brandTitleWrapper: {
    flexDirection: 'row',
    marginTop: -10,
  },
  brandDev: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0085ff',
  },
  copySection: {
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  primaryEmailButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  primaryEmailButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  googleIconWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  googleIconImage: {
    width: 20,
    height: 20,
  },
  privacyFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 12,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginLeft: -4,
  },
  backLinkLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  fieldsWrapper: {
    gap: 20,
  },
  inputBox: {
    gap: 8,
  },
  authButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
