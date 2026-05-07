import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { tokenCache } from './app/clerk/tokenCache';
import { RootNavigator } from './app/navigation/RootNavigator';
import { ShareIntentProvider } from './app/share/ShareIntentContext';
import { ThemeProvider, useTheme } from './app/theme/ThemeContext';

WebBrowser.maybeCompleteAuthSession();

type AppExtra = { clerkPublishableKey?: string };

const extra = Constants.expoConfig?.extra as AppExtra | undefined;
/** Prefer native `extra` (set at prebuild / EAS) so release APKs work without Metro env. */
const publishableKey = (
  extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  ''
).trim();

function ThemedChrome() {
  const { colors, resolved } = useTheme();
  return (
    <>
      <StatusBar
        style={resolved === 'dark' ? 'light' : 'dark'}
        backgroundColor={colors.background}
      />
      <RootNavigator />
    </>
  );
}

function MissingClerkKey() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Configure Clerk</Text>
      <Text style={styles.body}>
        Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY (Clerk publishable key, not a secret key) in `.env`, then
        run `npm run android:apk:release` so prebuild embeds it. For EAS cloud builds, add the same
        variable under your Expo project → Environment variables. See `.env.example`.
      </Text>
    </View>
  );
}

export default function App() {
  if (!publishableKey) {
    return (
      <SafeAreaProvider>
        <MissingClerkKey />
      </SafeAreaProvider>
    );
  }

  return (
    <ShareIntentProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ThemeProvider>
          <SafeAreaProvider>
            <ThemedChrome />
          </SafeAreaProvider>
        </ThemeProvider>
      </ClerkProvider>
    </ShareIntentProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  body: { fontSize: 15, color: '#444', lineHeight: 22 },
});
