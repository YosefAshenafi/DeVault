import { useRef, useState } from 'react';
import { Dimensions, FlatList, View, type ListRenderItem, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AuthScreenProps } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { AppLogo } from '../components/AppLogo';
import { ThemedText } from '../components/ThemedText';
import { useTheme } from '../theme/ThemeContext';

type Slide = { key: string; title: string; body: string; icon: keyof typeof Ionicons.glyphMap };

const SLIDES: Slide[] = [
  {
    key: '1',
    title: 'Save dev content from anywhere.',
    body: 'Send links from TikTok, YouTube, blogs, and more straight into your vault.',
    icon: 'share-social-outline',
  },
  {
    key: '2',
    title: 'Add your own notes and tags.',
    body: 'Capture why it matters with notes and comma-separated tags you can filter later.',
    icon: 'pricetags-outline',
  },
  {
    key: '3',
    title: 'Search your dev brain later.',
    body: 'Never lose great content—search titles, notes, and tags in one place.',
    icon: 'search-outline',
  },
];

export function OnboardingScreen({ navigation }: AuthScreenProps<'Onboarding'>) {
  const { colors, spacing, radii } = useTheme();
  const [index, setIndex] = useState(0);
  const width = Dimensions.get('window').width;
  const listRef = useRef<FlatList<Slide>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={{ width, paddingHorizontal: spacing.xl, justifyContent: 'center' }}>
      <View
        style={{
          alignSelf: 'center',
          width: 88,
          height: 88,
          borderRadius: radii.lg,
          backgroundColor: colors.surfaceElevated,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xl,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Ionicons name={item.icon} size={40} color={colors.primary} />
      </View>
      <ThemedText variant="title" style={{ textAlign: 'center', marginBottom: spacing.md }}>
        {item.title}
      </ThemedText>
      <ThemedText color="secondary" style={{ textAlign: 'center', lineHeight: 22 }}>
        {item.body}
      </ThemedText>
    </View>
  );

  const isLast = index === SLIDES.length - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
        <AppLogo size={64} />
      </View>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={renderItem}
      />
      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg }}>
          {SLIDES.map((s, i) => (
            <View
              key={s.key}
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: i === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
        {isLast ? (
          <>
            <AppButton
              title="Continue with Email"
              leftIcon={<Ionicons name="mail-outline" size={22} color={colors.primaryText} />}
              onPress={() => navigation.navigate('SignIn', {})}
            />
            <View style={{ height: spacing.sm }} />
            <AppButton
              title="Continue with Google"
              variant="google"
              leftIcon={<Ionicons name="logo-google" size={22} color="#4285F4" />}
              onPress={() => navigation.navigate('SignIn', { startGoogle: true })}
            />
          </>
        ) : (
          <AppButton
            title="Next"
            onPress={() => listRef.current?.scrollToOffset({ offset: width * (index + 1), animated: true })}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
