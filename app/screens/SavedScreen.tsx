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

export function SavedScreen() {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { resources } = useResourcesContext();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxl + 96,
          flexGrow: resources.length === 0 ? 1 : 0,
        }}
      >
        <ThemedText variant="title">Saved</ThemedText>
        <ThemedText color="secondary" style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
          All resources saved in your vault.
        </ThemedText>

        {resources.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ThemedText color="muted" style={{ textAlign: 'center' }}>
              No saved resources yet. Tap the + button to add one.
            </ThemedText>
          </View>
        ) : (
          resources.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
          ))
        )}
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <AppFooter current="Saved" />
      </View>
    </SafeAreaView>
  );
}
