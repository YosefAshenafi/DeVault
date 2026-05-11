import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { AppFooter } from '../components/AppFooter';
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
  const { colors, spacing, radii } = useTheme();
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
  const [description, setDescription] = useState<string | null>(null);
  const [siteName, setSiteName] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
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
        setDescription(existing.description);
        setSiteName(existing.siteName);
        setFavicon(existing.favicon);
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
        if (meta.description) {
          setDescription((prev) => prev ?? meta.description ?? null);
        }
        if (meta.siteName) {
          setSiteName(meta.siteName ?? null);
        }
        if (meta.favicon) {
          setFavicon(meta.favicon ?? null);
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
      description,
      siteName,
      favicon,
    }),
    [title, url, note, tags, thumbnailUrl, description, siteName, favicon],
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
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl + 96 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            marginBottom: spacing.md,
            gap: spacing.xs,
          }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
          <ThemedText color="primary" style={{ fontSize: 17 }}>
            Back
          </ThemedText>
        </Pressable>

        <ThemedText variant="title" style={{ marginBottom: spacing.md }}>
          {editId ? 'Edit resource' : sharePayload ? 'Add from share' : 'Add resource'}
        </ThemedText>
        <ThemedText color="secondary" style={{ marginBottom: spacing.md }}>
          Save a snippet or link to your vault.
        </ThemedText>

        <View
          style={{
            backgroundColor: colors.surfaceElevated,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}
        >
          <ThemedText variant="label" color="secondary" style={{ marginBottom: spacing.sm }}>
            Preview
          </ThemedText>
          <ThumbnailPreview thumbnailUrl={thumbnailUrl} title={title || 'New'} url={url} height={180} />
        </View>
        {metaLoading ? (
          <View style={{ alignItems: 'center', marginVertical: spacing.sm }}>
            <ActivityIndicator color={colors.primary} />
            <ThemedText variant="caption" color="secondary">
              Fetching preview…
            </ThemedText>
          </View>
        ) : null}

        <View
          style={{
            backgroundColor: colors.surfaceElevated,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.md,
          }}
        >
          <AppTextInput
            label={requireUrl ? 'Source URL' : 'Source URL (optional)'}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            editable={!editId || true}
          />
          <AppTextInput label="Resource title" value={title} onChangeText={setTitle} />
          <AppTextInput
            label="Tags"
            value={tags}
            onChangeText={setTags}
            placeholder="android, ui, career"
          />
          <AppTextInput label="Quick notes" value={note} onChangeText={setNote} multiline numberOfLines={4} />
        </View>

        {error ? (
          <ThemedText color="danger" style={{ marginBottom: spacing.md }}>
            {error}
          </ThemedText>
        ) : null}

        <AppButton title={editId ? 'Save changes' : 'Save resource'} onPress={onSave} loading={saving} />
        <View style={{ height: spacing.sm }} />
        <AppButton title="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <AppFooter current="AddEdit" />
      </View>
    </SafeAreaView>
  );
}
