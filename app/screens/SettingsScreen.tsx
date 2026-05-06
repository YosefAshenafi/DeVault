import { useClerk, useUser } from '@clerk/clerk-expo';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { ThemedText } from '../components/ThemedText';
import { exportResourcesToJson, importResourcesFromJson } from '../data/exportImport';
import { useResourcesContext } from '../context/ResourcesContext';
import { useAuthUser } from '../hooks/useAuthUser';
import type { ThemePreference } from '../theme/ThemeContext';
import { useTheme } from '../theme/ThemeContext';

export function SettingsScreen() {
  const { colors, spacing, radii, preference, setPreference } = useTheme();
  const { user } = useUser();
  const { userId } = useAuthUser();
  const { signOut } = useClerk();
  const { refresh, reloadTags } = useResourcesContext();
  const [busy, setBusy] = useState(false);

  const onExport = async () => {
    if (!userId) return;
    setBusy(true);
    try {
      const json = await exportResourcesToJson(userId);
      const path = `${FileSystem.cacheDirectory ?? ''}devault-export-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
      const can = await Sharing.isAvailableAsync();
      if (can) {
        await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Export DeVault data' });
      } else {
        Alert.alert('Export', `Saved to cache:\n${path}`);
      }
    } catch (e) {
      Alert.alert('Export', e instanceof Error ? e.message : 'Export failed');
    } finally {
      setBusy(false);
    }
  };

  const onImport = async () => {
    if (!userId) return;
    setBusy(true);
    try {
      const pick = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      if (pick.canceled || !pick.assets?.[0]?.uri) {
        setBusy(false);
        return;
      }
      const uri = pick.assets[0].uri;
      const text = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
      const result = await importResourcesFromJson(userId, text);
      await refresh();
      await reloadTags();
      Alert.alert(
        'Import complete',
        `Imported: ${result.imported}, updated: ${result.updated}, skipped: ${result.skipped}`,
      );
    } catch (e) {
      Alert.alert('Import', e instanceof Error ? e.message : 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  const cycleTheme = () => {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    const i = order.indexOf(preference);
    setPreference(order[(i + 1) % order.length]);
  };

  const themeLabel =
    preference === 'system' ? 'Follow system' : preference === 'light' ? 'Light' : 'Dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <ThemedText variant="title" style={{ marginBottom: spacing.lg }}>
          Settings
        </ThemedText>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.xl,
            backgroundColor: colors.surface,
            padding: spacing.lg,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              style={{ width: 56, height: 56, borderRadius: 28, marginRight: spacing.md }}
            />
          ) : null}
          <View style={{ flex: 1 }}>
            <ThemedText variant="subtitle">{user?.fullName || user?.username || 'Account'}</ThemedText>
            <ThemedText variant="caption" color="secondary" style={{ marginTop: spacing.xs }}>
              {user?.primaryEmailAddress?.emailAddress ?? '—'}
            </ThemedText>
          </View>
        </View>

        <AppButton title="Export data" variant="secondary" onPress={onExport} loading={busy} />
        <View style={{ height: spacing.sm }} />
        <AppButton title="Import data" variant="secondary" onPress={onImport} loading={busy} />
        <View style={{ height: spacing.lg }} />

        <Pressable
          onPress={cycleTheme}
          style={{
            padding: spacing.lg,
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: spacing.lg,
          }}
        >
          <ThemedText variant="label" color="secondary">
            Theme
          </ThemedText>
          <ThemedText style={{ marginTop: spacing.xs }}>{themeLabel}</ThemedText>
          <ThemedText variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
            Tap to cycle: system → light → dark
          </ThemedText>
        </Pressable>

        <AppButton
          title="Sign out"
          variant="danger"
          onPress={() => {
            void signOut();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
