import React from 'react';
import { ShareIntentProvider as NativeShareIntentProvider } from 'expo-share-intent';
import AppNavigator from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ResourceProvider } from './src/context/ResourceContext';
import { ShareIntentProvider } from './src/context/ShareIntentContext';

export default function App() {
  return (
    <NativeShareIntentProvider>
      <ThemeProvider>
        <ResourceProvider>
          <FavoritesProvider>
            <ShareIntentProvider>
              <AppNavigator />
            </ShareIntentProvider>
          </FavoritesProvider>
        </ResourceProvider>
      </ThemeProvider>
    </NativeShareIntentProvider>
  );
}
