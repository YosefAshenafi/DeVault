import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
    letterSpacing: -0.64,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 31,
    letterSpacing: -0.24,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  bodyLg: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
    color: colors.textSecondary,
  },
  bodyMd: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  bodySm: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: colors.textTertiary,
  },
  labelLg: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  labelMd: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.28,
    color: colors.textPrimary,
  },
  labelSm: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: colors.textSecondary,
  },
  code: {
    fontFamily: 'Menlo',
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.codeText,
  },
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
