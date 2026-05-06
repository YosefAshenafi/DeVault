import { ClerkProvider } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { tokenCache } from './app/clerk/tokenCache';
import { RootNavigator } from './app/navigation/RootNavigator';
import { ShareIntentProvider } from './app/share/ShareIntentContext';
import { ThemeProvider, useTheme } from './app/theme/ThemeContext';

WebBrowser.maybeCompleteAuthSession();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

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
        Create a `.env` file with EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY from your Clerk dashboard. See
        `.env.example`.
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
