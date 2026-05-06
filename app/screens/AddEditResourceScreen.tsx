import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { AppTextInput } from '../components/AppTextInput';
import { ThemedText } from '../components/ThemedText';
import { ThumbnailPreview } from '../components/ThumbnailPreview';
import { useAuthUser } from '../hooks/useAuthUser';
import { getResource } from '../data/resourceRepository';
import type { MainStackParamList } from '../navigation/types';
import type { ResourceInput } from '../types/resource';
import { useTheme } from '../theme/ThemeContext';
import { useResourcesContext } from '../context/ResourcesContext';
import { fetchPageMetadata } from '../utils/fetchMetadata';

export function AddEditResourceScreen() {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = useAuthUser();
  const { addResource, saveResource } = useResourcesContext();

  const params = route.params as MainStackParamList['AddEdit'];
  const editId = params?.id;
  const sharePayload = params?.sharePayload;
  const requireUrl = params?.requireUrl ?? Boolean(sharePayload);

  const [title, setTitle] = useState(sharePayload?.titleGuess ?? '');
  const [url, setUrl] = useState(sharePayload?.url ?? '');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !editId) return;
    void (async () => {
      const existing = await getResource(userId, editId);
      if (existing) {
        setTitle(existing.title);
        setUrl(existing.url ?? '');
        setNote(existing.note);
        setTags(existing.tags);
        setThumbnailUrl(existing.thumbnailUrl);
      }
    })();
  }, [userId, editId]);

  useEffect(() => {
    const u = url.trim();
    if (!u || editId) return;
    let cancelled = false;
    setMetaLoading(true);
    void (async () => {
      try {
        const meta = await fetchPageMetadata(u);
        if (cancelled) return;
        if (meta.title && !sharePayload?.titleGuess) {
          setTitle((prev) => (prev.trim() ? prev : meta.title ?? prev));
        } else if (meta.title) {
          setTitle((prev) => (prev.trim() === (sharePayload?.titleGuess ?? '').trim() ? meta.title ?? prev : prev));
        }
        if (meta.thumbnailUrl) {
          setThumbnailUrl((prev) => prev ?? meta.thumbnailUrl ?? null);
        }
      } catch {
        /* keep user fields */
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url, editId, sharePayload?.titleGuess]);

  const input: ResourceInput = useMemo(
    () => ({
      title: title.trim(),
      url: url.trim() ? url.trim() : null,
      note: note.trim(),
      tags: tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', '),
      thumbnailUrl,
    }),
    [title, url, note, tags, thumbnailUrl],
  );

  const onSave = useCallback(async () => {
    setError(null);
    if (!input.title) {
      setError('Title is required.');
      return;
    }
    if (requireUrl && !input.url) {
      setError('URL is required for shared entries.');
      return;
    }
    if (!userId) {
      setError('Not signed in.');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await saveResource(editId, input);
      } else {
        await addResource(input);
      }
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [addResource, editId, input, navigation, requireUrl, saveResource, userId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText variant="title" style={{ marginBottom: spacing.md }}>
          {editId ? 'Edit resource' : sharePayload ? 'Add from share' : 'Add resource'}
        </ThemedText>

        <ThumbnailPreview thumbnailUrl={thumbnailUrl} title={title || 'New'} url={url} height={180} />
        {metaLoading ? (
          <View style={{ alignItems: 'center', marginVertical: spacing.sm }}>
            <ActivityIndicator color={colors.primary} />
            <ThemedText variant="caption" color="secondary">
              Fetching preview…
            </ThemedText>
          </View>
        ) : null}

        <AppTextInput label="Title" value={title} onChangeText={setTitle} />
        <AppTextInput
          label={requireUrl ? 'URL' : 'URL (optional)'}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          editable={!editId || true}
        />
        <AppTextInput label="Note" value={note} onChangeText={setNote} multiline numberOfLines={4} />
        <AppTextInput
          label="Tags (comma-separated)"
          value={tags}
          onChangeText={setTags}
          placeholder="android, ui, career"
        />

        {error ? (
          <ThemedText color="danger" style={{ marginBottom: spacing.md }}>
            {error}
          </ThemedText>
        ) : null}

        <AppButton title={editId ? 'Save changes' : 'Save'} onPress={onSave} loading={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}
