import type { ExpoConfig } from 'expo/config';

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
  },
  android: {
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
