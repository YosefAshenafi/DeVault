// DevVault Design System Colors

export const lightColors = {
  primary: '#0085ff',
  primaryDark: '#0066cc',
  primaryLight: '#e6f3ff',
  onPrimary: '#ffffff',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceContainer: '#F1F5F9',
  surfaceContainerHigh: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  outline: '#CBD5E1',
  outlineVariant: '#E2E8F0',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  codeBg: '#0B1120',
  codeText: '#E2E8F0',
  gradientStart: '#0085ff',
  gradientEnd: '#00c6ff',
  shadow: 'rgba(0, 0, 0, 0.05)',
  shadowMd: 'rgba(0, 0, 0, 0.08)',
};

export const darkColors = {
  primary: '#38BDF8', // Lighter blue for better visibility on dark
  primaryDark: '#0EA5E9',
  primaryLight: '#1E293B',
  onPrimary: '#ffffff',
  background: '#020617', // Deeper black background
  surface: '#0F172A', // Surface slightly lighter than background
  surfaceContainer: '#1E293B',
  surfaceContainerHigh: '#334155',
  textPrimary: '#FFFFFF', // High contrast white for primary text
  textSecondary: '#E2E8F0', // Lighter gray for secondary text
  textTertiary: '#94A3B8', // Medium gray for tertiary
  outline: '#334155',
  outlineVariant: '#1E293B',
  error: '#FB7185',
  errorLight: '#450a0a',
  success: '#4ADE80',
  successLight: '#052e16',
  warning: '#FBBF24',
  codeBg: '#000000',
  codeText: '#F8FAFC',
  gradientStart: '#38BDF8',
  gradientEnd: '#818CF8',
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowMd: 'rgba(0, 0, 0, 0.7)',
};

// Default export for backward compatibility (will use light theme by default)
export const colors = lightColors;
