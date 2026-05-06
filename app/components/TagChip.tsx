import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ThemedText } from './ThemedText';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
  readOnly?: boolean;
};

export function TagChip({ label, selected, onPress, count, readOnly }: Props) {
  const { colors, radii, spacing } = useTheme();
  const style = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: selected ? colors.chipBg : colors.surfaceElevated,
    borderWidth: 1,
    borderColor: selected ? colors.primary : colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  };
  const text = (
    <ThemedText variant="caption" style={{ color: selected ? colors.chipText : colors.textSecondary }}>
      {label}
      {count != null ? ` · ${count}` : ''}
    </ThemedText>
  );
  if (readOnly) {
    return <View style={style}>{text}</View>;
  }
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={style}>
      {text}
    </Pressable>
  );
}
