import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { TagChip } from '../components/TagChip';
import { ThemedText } from '../components/ThemedText';
import { ThumbnailPreview } from '../components/ThumbnailPreview';
import { useAuthUser } from '../hooks/useAuthUser';
import { getResource } from '../data/resourceRepository';
import type { MainStackParamList } from '../navigation/types';
import type { Resource } from '../types/resource';
import { useTheme } from '../theme/ThemeContext';
import { useResourcesContext } from '../context/ResourcesContext';

export function DetailScreen() {
  const { colors, spacing, radii } = useTheme();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { userId } = useAuthUser();
  const { removeResource } = useResourcesContext();
  const { id } = route.params as { id: string };

  const [resource, setResource] = useState<Resource | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const r = await getResource(userId, id);
    setResource(r);
  }, [userId, id]);

  useEffect(() => {
    void load();
  }, [load]);

  const onOpenLink = useCallback(() => {
    if (resource?.url) void Linking.openURL(resource.url);
  }, [resource?.url]);

  const onDelete = useCallback(() => {
    Alert.alert('Delete resource', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await removeResource(id);
            navigation.popToTop();
          })();
        },
      },
    ]);
  }, [id, navigation, removeResource]);

  if (!resource) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ThemedText style={{ padding: spacing.lg }}>Resource not found.</ThemedText>
      </SafeAreaView>
    );
  }

  const tags = resource.tags
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const created = new Date(resource.createdAt).toLocaleString();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={{ marginBottom: spacing.md }}>
            <ThemedText color="primary">← Back</ThemedText>
          </Pressable>
          <ThumbnailPreview
            thumbnailUrl={resource.thumbnailUrl}
            title={resource.title}
            url={resource.url}
            height={200}
          />
          <ThemedText variant="title" style={{ marginTop: spacing.lg }}>
            {resource.title}
          </ThemedText>
          {resource.url ? (
            <Pressable onPress={onOpenLink} style={{ marginTop: spacing.sm }}>
              <ThemedText color="primary" numberOfLines={2}>
                {resource.url}
              </ThemedText>
            </Pressable>
          ) : null}
          <ThemedText variant="caption" color="muted" style={{ marginTop: spacing.md }}>
            Added {created}
          </ThemedText>
          <ThemedText style={{ marginTop: spacing.lg, lineHeight: 22 }}>{resource.note || '—'}</ThemedText>
          {tags.length > 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.lg }}>
              {tags.map((t) => (
                <TagChip key={t} label={t} readOnly />
              ))}
            </View>
          ) : null}
          <View style={{ marginTop: spacing.xl }}>
            {resource.url ? (
              <AppButton title="Open link" onPress={onOpenLink} />
            ) : null}
            <View style={{ height: resource.url ? spacing.sm : 0 }} />
            <AppButton title="Edit" variant="secondary" onPress={() => navigation.navigate('AddEdit', { id })} />
            <View style={{ height: spacing.sm }} />
            <AppButton title="Delete" variant="danger" onPress={onDelete} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
