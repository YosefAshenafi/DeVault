import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ThemedText } from './ThemedText';

type Props = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'google';
  loading?: boolean;
  leftIcon?: ReactNode;
};

export function AppButton({
  title,
  variant = 'primary',
  loading,
  leftIcon,
  disabled,
  style,
  ...rest
}: Props) {
  const { colors, radii, spacing, resolved } = useTheme();
  const isPrimary = variant === 'primary';
  const isGoogle = variant === 'google';
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'danger'
        ? colors.danger
        : variant === 'google'
          ? resolved === 'dark'
            ? '#131314'
            : '#ffffff'
        : variant === 'secondary'
          ? colors.surfaceElevated
          : 'transparent';
  const borderColor =
    variant === 'secondary' || variant === 'google'
      ? resolved === 'dark'
        ? '#8e918f'
        : '#747775'
      : 'transparent';
  const textColor =
    variant === 'primary' || variant === 'danger'
      ? colors.primaryText
      : variant === 'google'
        ? resolved === 'dark'
          ? '#e3e3e3'
          : '#1f1f1f'
        : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={(state) => {
        const extra = typeof style === 'function' ? style(state) : style;
        return [
          styles.base,
          {
            backgroundColor: bg,
            borderRadius: radii.md,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderWidth: variant === 'secondary' || variant === 'google' ? 1 : 0,
            borderColor,
            opacity: state.pressed ? 0.85 : disabled ? 0.5 : 1,
          },
          extra,
        ];
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primaryText : isGoogle ? textColor : colors.primary} />
      ) : leftIcon ? (
        <View style={styles.row}>
          <View style={styles.iconSlot}>{leftIcon}</View>
          <ThemedText variant="label" style={{ color: textColor, textAlign: 'center', flex: 1 }}>
            {title}
          </ThemedText>
          <View style={styles.iconSlot} />
        </View>
      ) : (
        <ThemedText variant="label" style={{ color: textColor, textAlign: 'center' }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconSlot: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
