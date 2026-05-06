import { useAuth } from '@clerk/clerk-expo';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useShareIntentContext } from '../share/ShareIntentContext';
import { useTheme } from '../theme/ThemeContext';
import { AuthNavigator } from './AuthNavigator';
import { linking } from './linking';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const rootNavigationRef = createNavigationContainerRef<RootStackParamList>();

export function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const { colors } = useTheme();
  const { payload, consumePayload } = useShareIntentContext();
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !payload || !navReady || !rootNavigationRef.isReady()) return;
    rootNavigationRef.navigate('Main', {
      screen: 'AddEdit',
      params: { sharePayload: payload, requireUrl: true },
    });
    consumePayload();
  }, [isSignedIn, payload, navReady, consumePayload]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={rootNavigationRef}
      linking={linking}
      onReady={() => setNavReady(true)}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
