import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ThemedText } from './ThemedText';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function AppTextInput({ label, error, style, ...rest }: Props) {
  const { colors, radii, spacing } = useTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <ThemedText variant="label" color="secondary" style={{ marginBottom: spacing.xs }}>
          {label}
        </ThemedText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          {
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            color: colors.text,
            backgroundColor: colors.surfaceElevated,
            fontSize: 17,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <ThemedText variant="caption" color="danger" style={{ marginTop: spacing.xs }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
