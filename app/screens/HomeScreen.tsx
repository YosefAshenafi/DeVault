import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from '../components/AppLogo';
import { ResourceCard } from '../components/ResourceCard';
import { TagChip } from '../components/TagChip';
import { ThemedText } from '../components/ThemedText';
import { useResourcesContext } from '../context/ResourcesContext';
import type { MainStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

export function HomeScreen() {
  const { colors, spacing, radii } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {
    resources,
    topTags,
    loading,
    search,
    setSearch,
    activeTag,
    setActiveTag,
    refresh,
  } = useResourcesContext();

  const onOpen = useCallback(
    (id: string) => {
      navigation.navigate('Detail', { id });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <AppLogo size={40} style={{ marginRight: spacing.sm }} />
          <ThemedText variant="title" style={{ flex: 1 }}>
            DeVault
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Settings')}
            hitSlop={12}
          >
            <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            backgroundColor: colors.surface,
            marginBottom: spacing.md,
          }}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search title, notes, tags…"
            placeholderTextColor={colors.textMuted}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.sm,
              color: colors.text,
              fontSize: 16,
            }}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
          <TagChip label="All" selected={!activeTag} onPress={() => setActiveTag(undefined)} />
          {topTags.map((t) => (
            <TagChip
              key={t.tag}
              label={t.tag}
              count={t.count}
              selected={activeTag === t.tag}
              onPress={() => setActiveTag(activeTag === t.tag ? undefined : t.tag)}
            />
          ))}
        </ScrollView>
      </View>

      {loading && resources.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: 120,
          }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
          ListEmptyComponent={
            <ThemedText color="secondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
              No resources yet. Tap + to add one.
            </ThemedText>
          }
          renderItem={({ item }) => (
            <ResourceCard resource={item} onPress={() => onOpen(item.id)} />
          )}
        />
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('AddEdit', { requireUrl: false })}
        style={{
          position: 'absolute',
          right: spacing.xl,
          bottom: spacing.xl + spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={28} color={colors.primaryText} />
      </Pressable>
    </SafeAreaView>
  );
}
