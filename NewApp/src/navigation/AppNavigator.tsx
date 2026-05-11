import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Library, Heart, Settings as SettingsIcon, Plus } from 'lucide-react-native';

// expo-share-intent — available in development builds
import { useShareIntentContext } from 'expo-share-intent';

import { lightColors, darkColors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useShareIntent } from '../context/ShareIntentContext';

import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import FavoritedScreen from '../screens/FavoritedScreen';
import AddResourceScreen from '../screens/AddResourceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ResourceDetailScreen from '../screens/ResourceDetailScreen';
import SourceResourcesScreen from '../screens/SourceResourcesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const FavoritedStack = createNativeStackNavigator();
const CollectionsStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
    </HomeStack.Navigator>
  );
}

function CollectionsStackScreen() {
  return (
    <CollectionsStack.Navigator screenOptions={{ headerShown: false }}>
      <CollectionsStack.Screen name="CollectionsMain" component={CollectionsScreen} />
      <CollectionsStack.Screen name="SourceResources" component={SourceResourcesScreen} />
      <CollectionsStack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
    </CollectionsStack.Navigator>
  );
}

function FavoritedStackScreen() {
  return (
    <FavoritedStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritedStack.Screen name="FavoritedMain" component={FavoritedScreen} />
      <FavoritedStack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
    </FavoritedStack.Navigator>
  );
}

const CustomAddButton = ({ onPress, theme, styles }: any) => (
  <TouchableOpacity
    style={styles.addButtonContainer}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={[styles.addButton, { backgroundColor: theme.primary }]}>
      <Plus color="#FFFFFF" size={28} strokeWidth={2.5} />
    </View>
  </TouchableOpacity>
);

function TabNavigator() {
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 12;

  const styles = StyleSheet.create({
    addButtonContainer: {
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 10,
        },
      }),
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.outlineVariant,
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={22} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="CollectionsTab"
        component={CollectionsStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Library color={color} size={22} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={AddResourceScreen}
        options={{
          tabBarButton: (props) => <CustomAddButton {...props} theme={theme} styles={styles} />,
        }}
      />
      <Tab.Screen
        name="FavoritedTab"
        component={FavoritedStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Heart color={color} size={22} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={22} strokeWidth={2} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Utility: extract metadata from a shared URL/text
function extractMetadataFromShare(shareData: any): {
  url: string;
  text: string;
  title: string;
  source: string;
  sourceLogo: string;
} {
  const url = shareData?.url || shareData?.webUrl || '';
  const text = shareData?.text || '';
  
  // Try to extract URL from text if no direct URL
  let extractedUrl = url;
  if (!extractedUrl && text) {
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      extractedUrl = urlMatch[0];
    }
  }

  // Detect source from URL
  let source = 'Web';
  let sourceLogo = 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png';
  
  const lowerUrl = (extractedUrl || text).toLowerCase();

  if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('vm.tiktok.com')) {
    source = 'TikTok';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png';
  } else if (lowerUrl.includes('github.com')) {
    source = 'GitHub';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/25/25231.png';
  } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    source = 'YouTube';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png';
  } else if (lowerUrl.includes('linkedin.com')) {
    source = 'LinkedIn';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/174/174857.png';
  } else if (lowerUrl.includes('instagram.com')) {
    source = 'Instagram';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/174/174855.png';
  } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    source = 'X (Twitter)';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/5968/5968958.png';
  } else if (lowerUrl.includes('reddit.com')) {
    source = 'Reddit';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/1384/1384072.png';
  } else if (lowerUrl.includes('medium.com')) {
    source = 'Medium';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png';
  } else if (lowerUrl.includes('stackoverflow.com')) {
    source = 'StackOverflow';
    sourceLogo = 'https://cdn-icons-png.flaticon.com/512/2111/2111628.png';
  }

  // Try to extract a title from the text (often shared as "Title - URL" or "Title\nURL")
  let title = '';
  if (text && text !== extractedUrl) {
    title = text.replace(extractedUrl, '').replace(/\n/g, ' ').trim();
    // Remove trailing dashes/pipes common in share text
    title = title.replace(/[\s\-\|]+$/, '').trim();
  }

  return {
    url: extractedUrl,
    text: text,
    title: title,
    source,
    sourceLogo,
  };
}

export default function AppNavigator() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const { setSharedContent } = useShareIntent();
  
  // Listen for share intents from the native share sheet
  // Only works in development builds, not Expo Go
  const shareIntentData = useShareIntentContext ? useShareIntentContext() : null;
  const shareIntentAvailable = shareIntentData?.hasShareIntent || false;

  useEffect(() => {
    if (shareIntentAvailable && shareIntentData?.shareIntent) {
      const metadata = extractMetadataFromShare(shareIntentData.shareIntent);
      
      setSharedContent({
        url: metadata.url,
        text: metadata.text,
        title: metadata.title,
        source: metadata.source,
        sourceLogo: metadata.sourceLogo,
      });

      // Navigate to the Add tab after a brief delay to allow navigation to be ready
      setTimeout(() => {
        if (navigationRef.current) {
          navigationRef.current.navigate('Main', { screen: 'AddTab' });
        }
      }, 500);

      // Reset the share intent so it doesn't trigger again
      if (shareIntentData?.resetShareIntent) {
        shareIntentData.resetShareIntent();
      }
    }
  }, [shareIntentAvailable]);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
