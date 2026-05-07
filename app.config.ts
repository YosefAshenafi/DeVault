import fs from 'fs';
import path from 'path';
import type { ExpoConfig } from 'expo/config';

/**
 * Load `.env` without the `dotenv` package (works with `expo prebuild --no-install` and plain Node).
 * Does not override variables already set (e.g. EAS or your shell).
 */
function loadEnvFile(): void {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile();

/** Baked into the native app (expo-constants). Set in `.env` locally or in EAS env for cloud builds. */
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? '';

const config: ExpoConfig = {
  name: 'DeVault',
  slug: 'DeVault',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/app-icon.png',
  scheme: 'devault',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/app-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.jossyfreelancer.devault',
  },
  android: {
    package: 'com.jossyfreelancer.devault',
    adaptiveIcon: {
      foregroundImage: './assets/app-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/app-icon.png',
  },
  extra: {
    eas: {
      projectId: '4f804be8-4202-43f7-9621-d5961c042108',
    },
    clerkPublishableKey,
  },
  plugins: [
    'expo-secure-store',
    'expo-web-browser',
    'expo-sqlite',
    'expo-font',
    [
      'expo-share-intent',
      {
        iosActivationRules: {
          NSExtensionActivationSupportsWebURLWithMaxCount: 1,
          NSExtensionActivationSupportsWebPageWithMaxCount: 1,
          NSExtensionActivationSupportsText: true,
          NSExtensionActivationSupportsMovieWithMaxCount: 1,
        },
        androidIntentFilters: ['text/*', 'video/*'],
        androidMultiIntentFilters: ['video/*', 'image/*'],
      },
    ],
  ],
};

export default config;
