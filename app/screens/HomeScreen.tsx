import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppFooter } from '../components/AppFooter';
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
  const dashboardTags = topTags.slice(0, 6).map((t) => t.tag);
  const quickCategories =
    dashboardTags.length > 0
      ? ['All Resources', ...dashboardTags]
      : ['All Resources', 'React Native', 'AI', 'UI/UX', 'Cloud'];
  const tutorials = resources.filter((r) => Boolean(r.url)).slice(0, 4);
  const notes = resources.filter((r) => r.note.trim().length > 0).slice(0, 4);
  const articles = resources.filter((r) => !tutorials.includes(r) && !notes.includes(r)).slice(0, 4);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.md,
            backgroundColor: colors.surfaceElevated,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <AppLogo size={48} style={{ marginRight: spacing.sm }} />
          <ThemedText variant="title" style={{ flex: 1 }}>
            DeVault
          </ThemedText>
        </View>
        <ThemedText variant="caption" color="secondary" style={{ marginBottom: spacing.md }}>
          Developer Resource Dashboard
        </ThemedText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radii.lg,
            paddingHorizontal: spacing.md,
            backgroundColor: colors.surfaceElevated,
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
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 6,
              paddingVertical: 2,
              backgroundColor: colors.background,
            }}
          >
            <ThemedText variant="caption" color="muted">
              ⌘K
            </ThemedText>
          </View>
        </View>
        {dashboardTags.length > 0 ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
              {quickCategories.map((label) => (
                <View
                  key={label}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radii.full,
                    paddingHorizontal: spacing.md,
                    paddingVertical: 6,
                    marginRight: spacing.sm,
                    backgroundColor: label === 'All Resources' ? colors.surface : colors.background,
                  }}
                >
                  <ThemedText variant="caption" color={label === 'All Resources' ? 'text' : 'secondary'}>
                    {label}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
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
          </>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: 140,
        }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        {loading && resources.length === 0 ? (
          <View style={{ justifyContent: 'center', paddingTop: spacing.xl }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}

        {tutorials.length > 0 ? (
          <View style={{ marginBottom: spacing.lg, backgroundColor: colors.surfaceElevated, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <ThemedText variant="subtitle">Recent Tutorials</ThemedText>
              <ThemedText variant="caption" color="primary">View all</ThemedText>
            </View>
            {tutorials.map((item) => <ResourceCard key={item.id} resource={item} onPress={() => onOpen(item.id)} />)}
          </View>
        ) : null}

        {notes.length > 0 ? (
          <View style={{ marginBottom: spacing.lg, backgroundColor: colors.surfaceElevated, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <ThemedText variant="subtitle">Notes & Snippets</ThemedText>
              <ThemedText variant="caption" color="primary">View all</ThemedText>
            </View>
            {notes.map((item) => <ResourceCard key={`note-${item.id}`} resource={item} onPress={() => onOpen(item.id)} />)}
          </View>
        ) : null}

        {articles.length > 0 ? (
          <View style={{ marginBottom: spacing.lg, backgroundColor: colors.surfaceElevated, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <ThemedText variant="subtitle">Articles & News</ThemedText>
              <ThemedText variant="caption" color="primary">View all</ThemedText>
            </View>
            {articles.map((item) => <ResourceCard key={`article-${item.id}`} resource={item} onPress={() => onOpen(item.id)} />)}
          </View>
        ) : null}
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <AppFooter current="Home" />
      </View>
    </SafeAreaView>
  );
}
