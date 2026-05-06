import { Pressable, View } from 'react-native';
import type { Resource } from '../types/resource';
import { useTheme } from '../theme/ThemeContext';
import { ThemedText } from './ThemedText';
import { ThumbnailPreview } from './ThumbnailPreview';

function secondaryLine(r: Resource): string {
  if (r.url) {
    try {
      return new URL(r.url).hostname.replace(/^www\./, '');
    } catch {
      return r.url;
    }
  }
  const line = r.note.trim().split(/\r?\n/)[0] ?? '';
  return line.length > 80 ? `${line.slice(0, 77)}…` : line || 'No description';
}

type Props = {
  resource: Resource;
  onPress: () => void;
};

export function ResourceCard({ resource, onPress }: Props) {
  const { colors, radii, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', padding: spacing.md, gap: spacing.md }}>
        <View style={{ width: 96 }}>
          <ThumbnailPreview
            thumbnailUrl={resource.thumbnailUrl}
            title={resource.title}
            url={resource.url}
            height={96}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ThemedText variant="subtitle" numberOfLines={2}>
            {resource.title}
          </ThemedText>
          <ThemedText variant="caption" color="secondary" numberOfLines={2} style={{ marginTop: spacing.xs }}>
            {secondaryLine(resource)}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}
