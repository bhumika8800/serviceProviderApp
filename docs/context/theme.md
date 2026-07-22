# Theme Specification

## Design Philosophy

Modern, clean, mobile-first UI with card-based layouts, rounded corners, and soft shadows. The design emphasizes clarity, trust, and approachability through a warm blue-and-yellow color scheme.

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#2563EB` | Brand color, primary buttons, active tab, links |
| `primaryLight` | `#3B82F6` | Hover/pressed states, highlights |
| `primaryDark` | `#1D4ED8` | Active/pressed button states |
| `primaryBg` | `#EFF6FF` | Light background for primary-colored containers |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#FACC15` | Promotional banners, badges, rating stars, highlights |
| `accentLight` | `#FDE047` | Hover state for accent elements |
| `accentDark` | `#EAB308` | Active/pressed accent state |
| `accentBg` | `#FEFCE8` | Light background for accent-colored containers |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `white` | `#FFFFFF` | Card backgrounds, screen backgrounds |
| `background` | `#F8FAFC` | Main screen background |
| `surface` | `#FFFFFF` | Card, modal, bottom sheet surfaces |
| `border` | `#E2E8F0` | Card borders, dividers, input borders |
| `borderLight` | `#F1F5F9` | Subtle dividers |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `textPrimary` | `#0F172A` | Primary content, headings |
| `textSecondary` | `#475569` | Body text, descriptions |
| `textTertiary` | `#94A3B8` | Placeholder text, captions, timestamps |
| `textWhite` | `#FFFFFF` | Text on dark/primary backgrounds |
| `textLink` | `#2563EB` | Clickable links |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#16A34A` | Booking confirmed, payment successful, active status |
| `successBg` | `#F0FDF4` | Light success background |
| `warning` | `#D97706` | Pending status, in-progress state |
| `warningBg` | `#FFFBEB` | Light warning background |
| `error` | `#DC2626` | Cancelled status, payment failed, validation errors |
| `errorBg` | `#FEF2F2` | Light error background |
| `info` | `#2563EB` | Informational badges, notifications |

---

  ## Typography

### Font Families

| Role | Platform | Value |
|------|----------|-------|
| Regular | iOS | `System` (SF Pro) |
| Regular | Android | `Roboto` |
| Medium | Both | `System` (medium weight) |
| Bold | Both | `System` (bold weight) |

*Custom fonts may replace system fonts if brand guidelines require. If used, include `Inter` or `SF Pro Display` as downloadable fonts.*

### Type Scale

| Token | Size (px) | Line Height | Weight | Usage |
|-------|-----------|-------------|--------|-------|
| `h1` | 28 | 34 | 700 (Bold) | Screen titles, large headers |
| `h2` | 22 | 28 | 700 (Bold) | Section titles, card headers |
| `h3` | 18 | 24 | 600 (SemiBold) | Card titles, modal headers |
| `h4` | 16 | 22 | 600 (SemiBold) | Subsection headers |
| `bodyLarge` | 16 | 24 | 400 (Regular) | Primary body text |
| `body` | 14 | 20 | 400 (Regular) | Secondary body text, descriptions |
| `bodySmall` | 12 | 16 | 400 (Regular) | Captions, timestamps, metadata |
| `caption` | 11 | 14 | 400 (Regular) | Badge text, tiny labels |
| `button` | 15 | 20 | 600 (SemiBold) | Button labels |
| `overline` | 10 | 12 | 600 (SemiBold) | Uppercase labels, section overlines |

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
| `sm` | 4 | Input fields, small badges |
| `md` | 8 | Standard cards, buttons |
| `lg` | 12 | Featured cards, modals |
| `xl` | 16 | Bottom sheets, large containers |
| `full` | 9999 | Circular elements, avatars, pills |

---

## Shadows

### Card Shadows (iOS / Android)

| Level | iOS (shadow) | Android (elevation) | Usage |
|-------|-------------|---------------------|-------|
| `sm` | `{ color: #000, offset: 0/1, opacity: 0.05, radius: 2 }` | 1 | Subtle cards, pressed states |
| `md` | `{ color: #000, offset: 0/2, opacity: 0.08, radius: 4 }` | 3 | Default card elevation |
| `lg` | `{ color: #000, offset: 0/4, opacity: 0.10, radius: 8 }` | 6 | Featured cards, modals |
| `xl` | `{ color: #000, offset: 0/6, opacity: 0.12, radius: 12 }` | 9 | Bottom sheets, floating elements |

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

| Status | Background | Text | Icon Color |
|--------|-----------|------|------------|
| Pending | `warningBg` | `warning` | `warning` |
| Confirmed | `primaryBg` | `primary` | `primary` |
| In Progress | `warningBg` | `warning` | `warning` |
| Completed | `successBg` | `success` | `success` |
| Cancelled | `errorBg` | `error` | `error` |

### Navigation

| Element | Active | Inactive |
|---------|--------|----------|
| Bottom tab icon + label | `primary` | `textTertiary` |
| Top bar background | `white` | — |
| Top bar title | `textPrimary` | — |
| Badge count | `error` background, `textWhite` text | — |

---

## Dark Mode (Future)

Dark mode tokens are defined as overrides on the same semantic tokens:

| Light Token | Dark Override |
|-------------|---------------|
| `background` | `#0F172A` |
| `surface` | `#1E293B` |
| `border` | `#334155` |
| `textPrimary` | `#F1F5F9` |
| `textSecondary` | `#CBD5E1` |
| `textTertiary` | `#64748B` |

*Dark mode will reuse the same primary, accent, and semantic colors as light mode.*

---

## Theme Constants File

### Frontend Implementation

```typescript
// src/utils/constants.ts

export const colors = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryBg: '#EFF6FF',

  accent: '#FACC15',
  accentLight: '#FDE047',
  accentDark: '#EAB308',
  accentBg: '#FEFCE8',

  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textWhite: '#FFFFFF',
  textLink: '#2563EB',

  success: '#16A34A',
  successBg: '#F0FDF4',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  info: '#2563EB',
} as const;

export const typography = {
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  h4: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' as const },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
  overline: { fontSize: 10, lineHeight: 12, fontWeight: '600' as const },
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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 9,
  },
} as const;
```
