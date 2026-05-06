import { Image, type ImageStyle, type StyleProp } from 'react-native';

const source = require('../../assets/app-icon.png');

type Props = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

/** App mark from `assets/app-icon.png` (squircle artwork). */
export function AppLogo({ size = 56, style }: Props) {
  return (
    <Image
      source={source}
      style={[{ width: size, height: size, borderRadius: size * 0.2237 }, style]}
      accessibilityRole="image"
      accessibilityLabel="DeVault"
    />
  );
}
