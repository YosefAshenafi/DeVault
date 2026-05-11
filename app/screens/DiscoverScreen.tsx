import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppFooter } from '../components/AppFooter';
import { ResourceCard } from '../components/ResourceCard';
import { ThemedText } from '../components/ThemedText';
import { useResourcesContext } from '../context/ResourcesContext';
import type { MainStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

export function DiscoverScreen() {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { resources } = useResourcesContext();

  const discoverItems = resources.filter((r) => Boolean(r.url));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxl + 96,
          flexGrow: discoverItems.length === 0 ? 1 : 0,
        }}
      >
        <ThemedText variant="title">Discover</ThemedText>
        <ThemedText color="secondary" style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Explore your link-based resources.
        </ThemedText>

        {discoverItems.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ThemedText color="muted" style={{ textAlign: 'center' }}>
              No discover items yet. Add a resource with a URL to see it here.
            </ThemedText>
          </View>
        ) : (
          discoverItems.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
          ))
        )}
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <AppFooter current="Discover" />
      </View>
    </SafeAreaView>
  );
}
