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
    variant === 'title' ? 22 : variant === 'subtitle' ? 17 : variant === 'caption' ? 12 : variant === 'label' ? 13 : 15;
  const fontWeight =
    variant === 'title' || variant === 'subtitle' || variant === 'label' ? '600' : '400';

  return (
    <Text
      style={[{ color: colorVal, fontSize, fontWeight: fontWeight as '400' | '600' }, style]}
      {...rest}
    />
  );
}
