import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AuthScreenProps } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { AppLogo } from '../components/AppLogo';
import { ThemedText } from '../components/ThemedText';
import { useTheme } from '../theme/ThemeContext';

export function OnboardingScreen({ navigation }: AuthScreenProps<'Onboarding'>) {
  const { colors, spacing, radii } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ alignItems: 'center', paddingTop: spacing.lg }}>
        <AppLogo size={68} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl }}>
        <View
          style={{
            alignSelf: 'center',
            width: 104,
            height: 104,
            borderRadius: radii.full,
            backgroundColor: colors.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="share-social-outline" size={44} color={colors.primary} />
        </View>
        <ThemedText
          variant="title"
          style={{ textAlign: 'center', marginBottom: spacing.md, fontSize: 36, lineHeight: 42 }}
        >
          Save dev content from anywhere.
        </ThemedText>
        <ThemedText color="secondary" style={{ textAlign: 'center', lineHeight: 22 }}>
          Your personal sanctuary for code snippets, articles, and tools you find across the web.
        </ThemedText>
      </View>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }}>
        <AppButton
          title="Next"
          leftIcon={<Ionicons name="arrow-forward" size={20} color={colors.primaryText} />}
          onPress={() => navigation.navigate('SignIn', {})}
        />
        <Pressable onPress={() => navigation.navigate('SignIn', {})} style={{ alignSelf: 'center', marginTop: spacing.md }}>
          <ThemedText color="secondary">Skip intro</ThemedText>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, gap: spacing.md }}>
          <Ionicons name="terminal-outline" size={20} color={colors.textMuted} />
          <Ionicons name="code-slash-outline" size={20} color={colors.textMuted} />
        </View>
      </View>
    </SafeAreaView>
  );
}
