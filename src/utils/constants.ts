export const colors = {
  primary: '#D9532B',
  primaryLight: '#F07A52',
  primaryDark: '#B8431F',
  primaryBg: '#FDEEE7',

  accent: '#F2B705',
  accentLight: '#FBD34D',
  accentDark: '#C98A00',
  accentBg: '#FFF6DA',

  white: '#FFFFFF',
  background: '#FBF7F1',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F0E8',
  border: '#EFE3D7',
  borderLight: '#F6EDE4',

  textPrimary: '#241C17',
  textSecondary: '#6B5E54',
  textTertiary: '#A3968A',
  textWhite: '#FFFFFF',
  textLink: '#D9532B',

  success: '#2E7D4F',
  successBg: '#EAF6EE',
  warning: '#B26A00',
  warningBg: '#FFF4DB',
  error: '#C0392B',
  errorBg: '#FDECEA',
  info: '#D9532B',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const borderRadius = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const fonts = {
  displayRegular: 'PlayfairDisplay-Regular',
  displaySemiBold: 'PlayfairDisplay-SemiBold',
  displayBold: 'PlayfairDisplay-Bold',
} as const;

export const typography = {
  h1: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' as const },
  button: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  overline: { fontSize: 10, lineHeight: 12, fontWeight: '600' as const, letterSpacing: 0.8 },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#7A4E2D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#7A4E2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#7A4E2D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#7A4E2D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 9,
  },
} as const;
