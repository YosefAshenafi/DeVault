import { useClerk, useUser } from '@clerk/clerk-expo';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../components/AppButton';
import { AppFooter } from '../components/AppFooter';
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
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl + 96 }}>
        <ThemedText variant="title" style={{ marginBottom: spacing.sm }}>
          Settings
        </ThemedText>
        <ThemedText color="secondary" style={{ marginBottom: spacing.lg }}>
          Manage your account and vault preferences.
        </ThemedText>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.xl,
            backgroundColor: colors.surfaceElevated,
            padding: spacing.lg,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 5,
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

        <View
          style={{
            backgroundColor: colors.surfaceElevated,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: spacing.lg,
            overflow: 'hidden',
          }}
        >
          <Pressable
            onPress={cycleTheme}
            disabled={busy}
            style={({ pressed }) => ({
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: spacing.sm,
                }}
              >
                <Ionicons name="contrast-outline" size={18} color={colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">Theme mode</ThemedText>
                <ThemedText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  {themeLabel}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </Pressable>
          <Pressable
            onPress={onImport}
            disabled={busy}
            style={({ pressed }) => ({
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              opacity: busy ? 0.6 : pressed ? 0.8 : 1,
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: spacing.sm,
                }}
              >
                <Ionicons name="cloud-upload-outline" size={18} color={colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">Import vault</ThemedText>
                <ThemedText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  JSON files
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </Pressable>
          <Pressable
            onPress={onExport}
            disabled={busy}
            style={({ pressed }) => ({
              padding: spacing.lg,
              opacity: busy ? 0.6 : pressed ? 0.8 : 1,
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: spacing.sm,
                }}
              >
                <Ionicons name="cloud-download-outline" size={18} color={colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">Export vault</ThemedText>
                <ThemedText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  Download your resources
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </Pressable>
        </View>
        {busy ? (
          <ThemedText variant="caption" color="secondary" style={{ marginBottom: spacing.lg }}>
            Processing data operation...
          </ThemedText>
        ) : null}

        <Pressable
          onPress={() => {
            void signOut();
          }}
          style={({ pressed }) => ({
            backgroundColor: colors.surfaceElevated,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: spacing.md + 2,
            paddingHorizontal: spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.82 : 1,
          })}
        >
          <ThemedText variant="label" color="danger">
            Sign out
          </ThemedText>
        </Pressable>
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <AppFooter current="Settings" />
      </View>
    </SafeAreaView>
  );
}
