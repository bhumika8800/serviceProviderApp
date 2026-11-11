# Theme Specification

## Design Philosophy

Warm, friendly, mobile-first UI built around a terracotta-and-gold palette. Card-based
layouts, generous rounded corners, soft warm shadows, and clear typographic hierarchy make
the app feel approachable and trustworthy. Icons are drawn with a lightweight custom
`View`-based icon set (no icon-font or SVG dependency).

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#D9532B` | Brand color, primary buttons, active tab, links |
| `primaryLight` | `#F07A52` | Hover/pressed highlights |
| `primaryDark` | `#B8431F` | Active/pressed button states |
| `primaryBg` | `#FDEEE7` | Tinted background for primary containers |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#F2B705` | Promotional banners, badges, rating stars, highlights |
| `accentLight` | `#FBD34D` | Hover state for accent elements |
| `accentDark` | `#C98A00` | Active/pressed accent state, icon tint on accent |
| `accentBg` | `#FFF6DA` | Tinted background for accent containers |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `white` | `#FFFFFF` | Card backgrounds, screen backgrounds |
| `background` | `#FBF7F1` | Main screen background (warm off-white) |
| `surface` | `#FFFFFF` | Card, modal, bottom sheet surfaces |
| `surfaceAlt` | `#F7F0E8` | Alternate cards, subtle inputs, skeletons |
| `border` | `#EFE3D7` | Card borders, dividers, input borders |
| `borderLight` | `#F6EDE4` | Subtle dividers |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `textPrimary` | `#241C17` | Primary content, headings (warm near-black) |
| `textSecondary` | `#6B5E54` | Body text, descriptions |
| `textTertiary` | `#A3968A` | Placeholder text, captions, timestamps |
| `textWhite` | `#FFFFFF` | Text on dark/primary backgrounds |
| `textLink` | `#D9532B` | Clickable links |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#2E7D4F` | Booking confirmed, payment successful, active status |
| `successBg` | `#EAF6EE` | Light success background |
| `warning` | `#B26A00` | Pending status, in-progress state |
| `warningBg` | `#FFF4DB` | Light warning background |
| `error` | `#C0392B` | Cancelled status, payment failed, validation errors |
| `errorBg` | `#FDECEA` | Light error background |
| `info` | `#D9532B` | Informational badges, notifications |

---

## Typography

### Font Families

Display text (headings and button labels) uses **Playfair Display** (SIL Open Font
License, bundled in `assets/fonts/`). All other text uses the platform system sans-serif
font for readability.

| Role | Font | Constant | Platform |
|------|------|----------|----------|
| Display Regular | Playfair Display | `fonts.displayRegular` | iOS / Android |
| Display SemiBold | Playfair Display SemiBold | `fonts.displaySemiBold` | iOS / Android |
| Display Bold | Playfair Display Bold | `fonts.displayBold` | iOS / Android |
| Body / UI | `System` (SF Pro / Roboto) | — | iOS / Android |

Font files are copied to `android/app/src/main/assets/fonts/` and registered on iOS via
`UIAppFonts` in `Info.plist`. The `_bold` variants in the Android folder satisfy
`fontWeight: '700'` overrides on display styles. If the fonts are replaced, keep the
PostScript names in sync with the constants above.

### Type Scale

| Token | Font | Size (px) | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-----------|-------------|--------|----------------|-------|
| `h1` | Playfair Display | 28 | 34 | 700 (Bold) | -0.4 | Screen titles, large headers |
| `h2` | Playfair Display | 22 | 28 | 700 (Bold) | -0.3 | Section titles, card headers |
| `h3` | Playfair Display | 18 | 24 | 600 (SemiBold) | -0.2 | Card titles, modal headers |
| `h4` | Playfair Display | 16 | 22 | 600 (SemiBold) | 0 | Subsection headers |
| `bodyLarge` | System | 16 | 24 | 400 (Regular) | 0 | Primary body text |
| `body` | System | 14 | 20 | 400 (Regular) | 0 | Secondary body text, descriptions |
| `bodySmall` | System | 12 | 16 | 400 (Regular) | 0 | Captions, timestamps, metadata |
| `caption` | System | 11 | 14 | 400 (Regular) | 0 | Badge text, tiny labels |
| `button` | Playfair Display | 15 | 20 | 600 (SemiBold) | 0 | Button labels |
| `overline` | System | 10 | 12 | 600 (SemiBold) | 0.8 | Uppercase labels, section overlines |

---

## Spacing

| Token | Pixels | Usage |
|-------|--------|-------|
| `xxs` | 4 | Minimal gap between related elements |
| `xs` | 8 | Gap between icon and label |
| `sm` | 12 | Inner padding in compact cards |
| `md` | 16 | Standard padding, card content padding |
| `lg` | 20 | Section spacing, form field gaps |
| `xl` | 24 | Screen edge padding, card margins |
| `xxl` | 32 | Large section spacing |
| `xxxl` | 40 | Screen top/bottom spacing |

---

## Border Radius

| Token | Pixels | Usage |
|-------|--------|-------|
| `sm` | 8 | Input fields, small badges |
| `md` | 14 | Standard cards, buttons |
| `lg` | 18 | Featured cards, modals |
| `xl` | 24 | Bottom sheets, large containers |
| `full` | 9999 | Circular elements, avatars, pills |

---

## Shadows

Warm-tinted shadows using `#7A4E2D` as the shadow color.

| Level | iOS (shadow) | Android (elevation) | Usage |
|-------|-------------|---------------------|-------|
| `sm` | `{ color: #7A4E2D, offset: 0/1, opacity: 0.06, radius: 2 }` | 1 | Subtle cards, pressed states |
| `md` | `{ color: #7A4E2D, offset: 0/2, opacity: 0.08, radius: 6 }` | 3 | Default card elevation |
| `lg` | `{ color: #7A4E2D, offset: 0/6, opacity: 0.10, radius: 12 }` | 6 | Featured cards, modals |
| `xl` | `{ color: #7A4E2D, offset: 0/10, opacity: 0.14, radius: 20 }` | 9 | Bottom sheets, floating elements |

---

## Icon System

Icons are provided by `src/components/common/Icon.tsx`, a pure `View`-based set so the app
needs no native icon-font/SVG dependency. Import the component and use the `IconName` union
for type safety:

```tsx
import { Icon } from '../components/common/Icon';

<Icon name="calendar" size={20} color={colors.primary} strokeWidth={2} />
```

Available names: `home`, `grid`, `calendar`, `user`, `bell`, `search`, `close`, `plus`,
`check`, `star`, `clock`, `pin`, `sparkles`, `camera`, `card`, `alert`, `settings`, `logout`,
`arrow-right`, `message`, `chevron-right`, `chevron-left`, `chevron-down`.

Do not use emoji as UI icons in screens or modals.

---

## Component-Specific Tokens

### Buttons

| Variant | Background | Text Color | Border | Shadow |
|---------|-----------|------------|--------|--------|
| Primary (filled) | `primary` | `textWhite` | None | Yes (`md`) |
| Primary (pressed) | `primaryDark` | `textWhite` | None | — |
| Outline | Transparent | `primary` | `primary` | None |
| Ghost | Transparent | `primary` | None | None |
| Accent | `accent` | `textPrimary` | None | Yes (`md`) |
| Disabled | `border` | `textTertiary` | None | None |

### Input Fields

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `white` | `border` | `textPrimary` |
| Focused | `white` | `primary` | `textPrimary` |
| Error | `errorBg` | `error` | `textPrimary` |
| Disabled | `background` | `borderLight` | `textTertiary` |
| Placeholder | — | — | `textTertiary` |

### Status Badges

Rendered as a tinted pill with a status dot.

| Status | Background | Text / Dot |
|--------|-----------|------------|
| Pending | `warningBg` | `warning` |
| Confirmed | `primaryBg` | `primary` |
| In Progress | `warningBg` | `warning` |
| Completed | `successBg` | `success` |
| Cancelled | `errorBg` | `error` |

### Navigation

| Element | Active | Inactive |
|---------|--------|----------|
| Bottom tab icon + label | `primary` on `primaryBg` pill | `textTertiary` |
| Top bar background | `surface` | — |
| Top bar title | `textPrimary` | — |
| Badge count | `error` background, `textWhite` text | — |

---

## Dark Mode (Future)

Dark mode tokens are defined as overrides on the same semantic tokens:

| Light Token | Dark Override |
|-------------|---------------|
| `background` | `#1A1411` |
| `surface` | `#241C17` |
| `surfaceAlt` | `#2E241D` |
| `border` | `#3D3027` |
| `textPrimary` | `#FBF7F1` |
| `textSecondary` | `#D8CBBE` |
| `textTertiary` | `#A3968A` |

*Dark mode will reuse the same primary, accent, and semantic colors as light mode.*

---

## Theme Constants File

Source of truth: `src/utils/constants.ts`.

```typescript
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

export const typography = {
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const, letterSpacing: -0.2 },
  h4: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' as const },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
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
    shadowOpacity: 0.10,
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
```
