import type { TextProps } from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Variant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

export function ThemedText({
  variant = 'body',
  color = 'text',
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: 'text' | 'secondary' | 'muted' | 'primary' | 'danger' }) {
  const { colors } = useTheme();
  const colorVal =
    color === 'secondary'
      ? colors.textSecondary
      : color === 'muted'
        ? colors.textMuted
        : color === 'primary'
          ? colors.primary
          : color === 'danger'
            ? colors.danger
            : colors.text;

  const fontSize =
    variant === 'title' ? 32 : variant === 'subtitle' ? 21 : variant === 'caption' ? 13 : variant === 'label' ? 16 : 17;
  const fontWeight =
    variant === 'title' ? '700' : variant === 'subtitle' || variant === 'label' ? '600' : '400';
  const lineHeight =
    variant === 'title' ? 40 : variant === 'subtitle' ? 29 : variant === 'caption' ? 18 : variant === 'label' ? 22 : 25;

  return (
    <Text
      style={[
        {
          color: colorVal,
          fontSize,
          lineHeight,
          fontWeight: fontWeight as '400' | '600' | '700',
          letterSpacing: variant === 'title' ? -0.3 : 0,
        },
        style,
      ]}
      {...rest}
    />
  );
}
