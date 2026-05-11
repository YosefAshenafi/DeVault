import { Ionicons } from '@expo/vector-icons';
import { StackActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MainStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type FooterTab = 'Home' | 'Discover' | 'Saved' | 'AddEdit' | 'Settings';

type Props = {
  current: FooterTab;
};

export function AppFooter({ current }: Props) {
  const { colors, spacing, radii } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const iconColor = colors.textMuted;
  const activeColor = colors.primary;

  const goToTab = (route: Extract<FooterTab, 'Home' | 'Discover' | 'Saved' | 'Settings'>) => {
    if (current === route) return;
    navigation.dispatch(StackActions.replace(route));
  };

  const tabs = [
    {
      key: 'Home' as const,
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
      onPress: () => goToTab('Home'),
    },
    {
      key: 'Discover' as const,
      icon: 'compass-outline' as const,
      activeIcon: 'compass' as const,
      onPress: () => goToTab('Discover'),
    },
    {
      key: 'Saved' as const,
      icon: 'bookmark-outline' as const,
      activeIcon: 'bookmark' as const,
      onPress: () => goToTab('Saved'),
    },
    {
      key: 'Settings' as const,
      icon: 'settings-outline' as const,
      activeIcon: 'settings' as const,
      onPress: () => goToTab('Settings'),
    },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
      <View
        style={{
          marginHorizontal: spacing.sm,
          backgroundColor: colors.surfaceElevated,
          borderRadius: 26,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
          paddingHorizontal: spacing.md,
          position: 'relative',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.14,
          shadowRadius: 14,
          elevation: 14,
          borderTopWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {tabs.slice(0, 2).map((tab) => {
            const isActive = current === tab.key;
            const iconName = isActive ? tab.activeIcon : tab.icon;
            return (
              <Pressable
                key={tab.key}
                onPress={tab.onPress}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: radii.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? `${activeColor}18` : 'transparent',
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.84 : 1,
                })}
              >
                <Ionicons name={iconName} size={24} color={isActive ? activeColor : iconColor} />
              </Pressable>
            );
          })}

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing.xs + 2,
            }}
          />

          {tabs.slice(2).map((tab) => {
            const isActive = current === tab.key;
            const iconName = isActive ? tab.activeIcon : tab.icon;
            return (
              <Pressable
                key={tab.key}
                onPress={tab.onPress}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: radii.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? `${activeColor}18` : 'transparent',
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.84 : 1,
                })}
              >
                <Ionicons name={iconName} size={24} color={isActive ? activeColor : iconColor} />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => navigation.navigate('AddEdit', { requireUrl: false })}
          style={({ pressed }) => ({
            position: 'absolute',
            top: -26,
            alignSelf: 'center',
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: activeColor,
            borderWidth: 4,
            borderColor: colors.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: activeColor,
            shadowOffset: { width: 0, height: 9 },
            shadowOpacity: 0.35,
            shadowRadius: 14,
            elevation: 18,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <Ionicons name="add" size={31} color={colors.primaryText} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
