import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ThemedText } from './ThemedText';

type Props = {
  thumbnailUrl: string | null | undefined;
  title: string;
  url?: string | null;
  height?: number;
};

function initials(title: string, url: string | null | undefined): string {
  const t = title.trim();
  if (t.length > 0) return t.slice(0, 1).toUpperCase();
  if (url) {
    try {
      const h = new URL(url).hostname.replace(/^www\./, '');
      return h.slice(0, 1).toUpperCase();
    } catch {
      return 'D';
    }
  }
  return 'D';
}

export function ThumbnailPreview({ thumbnailUrl, title, url, height = 160 }: Props) {
  const { colors, radii } = useTheme();
  const letter = initials(title, url);

  if (thumbnailUrl) {
    return (
      <Image
        source={{ uri: thumbnailUrl }}
        style={{ width: '100%', height, borderRadius: radii.lg, backgroundColor: colors.border }}
        resizeMode="cover"
      />
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: '100%',
        height,
        borderRadius: radii.lg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="code-slash" size={36} color="rgba(255,255,255,0.9)" />
        <ThemedText style={{ fontSize: 40, fontWeight: '700', color: 'rgba(255,255,255,0.95)' }}>
          {letter}
        </ThemedText>
      </View>
    </LinearGradient>
  );
}
