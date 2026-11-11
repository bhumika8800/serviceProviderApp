import { View, Text, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type IconName =
  | 'home'
  | 'grid'
  | 'calendar'
  | 'user'
  | 'bell'
  | 'search'
  | 'close'
  | 'plus'
  | 'check'
  | 'star'
  | 'clock'
  | 'pin'
  | 'sparkles'
  | 'camera'
  | 'card'
  | 'alert'
  | 'settings'
  | 'logout'
  | 'arrow-right'
  | 'message'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export function Icon({
  name,
  size = 24,
  color = '#241C17',
  strokeWidth = 2,
  style,
}: IconProps) {
  const k = size / 24;
  const u = (value: number) => value * k;
  const bw = Math.max(1, strokeWidth * k);
  const bar = (width: number, height: number, left: number, top: number, rotate?: string): ViewStyle => ({
    position: 'absolute',
    left: u(left),
    top: u(top),
    width: u(width),
    height: u(height),
    borderRadius: u(1),
    backgroundColor: color,
    transform: rotate ? [{ rotate }] : undefined,
  });

  let content: ReactNode = null;

  switch (name) {
    case 'home':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(5.5),
              top: u(6),
              width: u(13),
              height: u(13),
              borderTopWidth: bw,
              borderLeftWidth: bw,
              borderColor: color,
              borderTopLeftRadius: u(3),
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(5),
              bottom: u(3),
              width: u(14),
              height: u(9),
              borderLeftWidth: bw,
              borderRightWidth: bw,
              borderBottomWidth: bw,
              borderColor: color,
              borderBottomLeftRadius: u(3),
              borderBottomRightRadius: u(3),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(10),
              bottom: u(3),
              width: u(4),
              height: u(6),
              borderLeftWidth: bw,
              borderRightWidth: bw,
              borderTopWidth: bw,
              borderColor: color,
              borderTopLeftRadius: u(2),
              borderTopRightRadius: u(2),
            }}
          />
        </>
      );
      break;
    case 'grid':
      content = (
        <>
          {[
            [2.5, 2.5],
            [13.25, 2.5],
            [2.5, 13.25],
            [13.25, 13.25],
          ].map(([left, top]) => (
            <View
              key={`${left}-${top}`}
              style={{
                position: 'absolute',
                left: u(left),
                top: u(top),
                width: u(8.25),
                height: u(8.25),
                borderWidth: bw,
                borderColor: color,
                borderRadius: u(2.5),
              }}
            />
          ))}
        </>
      );
      break;
    case 'calendar':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(3),
              top: u(4.5),
              width: u(18),
              height: u(16.5),
              borderWidth: bw,
              borderColor: color,
              borderRadius: u(3),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(3),
              top: u(9),
              width: u(18),
              height: bw,
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(7.5),
              top: u(2.5),
              width: u(2),
              height: u(4),
              borderRadius: u(1),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(14.5),
              top: u(2.5),
              width: u(2),
              height: u(4),
              borderRadius: u(1),
              backgroundColor: color,
            }}
          />
          {[7, 11.5, 16].map((left) => (
            <View
              key={left}
              style={{
                position: 'absolute',
                left: u(left),
                top: u(12.5),
                width: u(2.5),
                height: u(2.5),
                borderRadius: u(1),
                backgroundColor: color,
              }}
            />
          ))}
        </>
      );
      break;
    case 'user':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(8.5),
              top: u(3.5),
              width: u(7),
              height: u(7),
              borderRadius: u(3.5),
              borderWidth: bw,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(5),
              top: u(13.5),
              width: u(14),
              height: u(8),
              borderWidth: bw,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: u(7),
              borderTopRightRadius: u(7),
            }}
          />
        </>
      );
      break;
    case 'bell':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(5.5),
              top: u(4),
              width: u(13),
              height: u(12),
              borderWidth: bw,
              borderColor: color,
              borderTopLeftRadius: u(6.5),
              borderTopRightRadius: u(6.5),
              borderBottomLeftRadius: u(3),
              borderBottomRightRadius: u(3),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(3.5),
              top: u(15),
              width: u(17),
              height: bw,
              borderRadius: u(1),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(10),
              top: u(17.5),
              width: u(4),
              height: u(3),
              borderWidth: bw,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: u(2),
              borderBottomRightRadius: u(2),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(11),
              top: u(2),
              width: u(2),
              height: u(2),
              borderRadius: u(1),
              backgroundColor: color,
            }}
          />
        </>
      );
      break;
    case 'search':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(3.5),
              top: u(3.5),
              width: u(13),
              height: u(13),
              borderRadius: u(6.5),
              borderWidth: bw,
              borderColor: color,
            }}
          />
          <View style={bar(7, strokeWidth, 14, 14.5, '45deg')} />
        </>
      );
      break;
    case 'close':
      content = (
        <>
          <View style={bar(16, strokeWidth, 4, 11, '45deg')} />
          <View style={bar(16, strokeWidth, 4, 11, '-45deg')} />
        </>
      );
      break;
    case 'plus':
      content = (
        <>
          <View style={bar(16, strokeWidth, 4, 11.5)} />
          <View style={bar(strokeWidth, 16, 11.5, 4)} />
        </>
      );
      break;
    case 'check':
      content = (
        <>
          <View style={bar(7.2, strokeWidth, 3.9, 13.5, '45deg')} />
          <View style={bar(13.4, strokeWidth, 7.8, 11, '-45deg')} />
        </>
      );
      break;
    case 'star':
      content = (
        <Text style={[styles.glyph, { color, fontSize: size * 0.92, lineHeight: size }]}>★</Text>
      );
      break;
    case 'sparkles':
      content = (
        <Text style={[styles.glyph, { color, fontSize: size * 0.9, lineHeight: size }]}>✦</Text>
      );
      break;
    case 'clock':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(3.5),
              top: u(3.5),
              width: u(17),
              height: u(17),
              borderRadius: u(8.5),
              borderWidth: bw,
              borderColor: color,
            }}
          />
          <View style={bar(strokeWidth, 5, 11.5, 7.5)} />
          <View style={bar(4, strokeWidth, 12, 11.5)} />
        </>
      );
      break;
    case 'pin':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(6.5),
              top: u(3),
              width: u(11),
              height: u(11),
              borderRadius: u(5.5),
              borderWidth: bw,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(10.25),
              top: u(6.75),
              width: u(3.5),
              height: u(3.5),
              borderRadius: u(1.75),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(7.5),
              top: u(13),
              width: 0,
              height: 0,
              borderLeftWidth: u(4.5),
              borderRightWidth: u(4.5),
              borderTopWidth: u(6),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color,
            }}
          />
        </>
      );
      break;
    case 'camera':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(3),
              top: u(6.5),
              width: u(18),
              height: u(13),
              borderWidth: bw,
              borderColor: color,
              borderRadius: u(3),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(8.5),
              top: u(4),
              width: u(7),
              height: u(3),
              borderWidth: bw,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: u(2),
              borderTopRightRadius: u(2),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(8.5),
              top: u(9.5),
              width: u(7),
              height: u(7),
              borderRadius: u(3.5),
              borderWidth: bw,
              borderColor: color,
            }}
          />
        </>
      );
      break;
    case 'card':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(3),
              top: u(5),
              width: u(18),
              height: u(14),
              borderWidth: bw,
              borderColor: color,
              borderRadius: u(3),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(3),
              top: u(9),
              width: u(18),
              height: u(2.5),
              backgroundColor: color,
            }}
          />
        </>
      );
      break;
    case 'alert':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(3),
              top: u(3),
              width: 0,
              height: 0,
              borderLeftWidth: u(9),
              borderRightWidth: u(9),
              borderBottomWidth: u(16),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(11.1),
              top: u(8.5),
              width: u(1.8),
              height: u(6),
              borderRadius: u(1),
              backgroundColor: '#FFFFFF',
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(11.1),
              top: u(15.5),
              width: u(1.8),
              height: u(1.8),
              borderRadius: u(0.9),
              backgroundColor: '#FFFFFF',
            }}
          />
        </>
      );
      break;
    case 'settings':
      content = (
        <>
          {[7, 12, 17].map((top) => (
            <View
              key={top}
              style={{
                position: 'absolute',
                left: u(4),
                top: u(top),
                width: u(16),
                height: bw,
                borderRadius: u(1),
                backgroundColor: color,
              }}
            />
          ))}
          <View
            style={{
              position: 'absolute',
              left: u(13),
              top: u(5.25),
              width: u(3.5),
              height: u(3.5),
              borderRadius: u(1.75),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(7),
              top: u(10.25),
              width: u(3.5),
              height: u(3.5),
              borderRadius: u(1.75),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(11),
              top: u(15.25),
              width: u(3.5),
              height: u(3.5),
              borderRadius: u(1.75),
              backgroundColor: color,
            }}
          />
        </>
      );
      break;
    case 'logout':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(4),
              top: u(3.5),
              width: u(9),
              height: u(17),
              borderTopWidth: bw,
              borderLeftWidth: bw,
              borderBottomWidth: bw,
              borderColor: color,
              borderTopLeftRadius: u(2),
              borderBottomLeftRadius: u(2),
            }}
          />
          <View style={bar(8, strokeWidth, 13, 11.5)} />
          <View style={bar(5, strokeWidth, 16.5, 9, '45deg')} />
          <View style={bar(5, strokeWidth, 16.5, 15, '135deg')} />
        </>
      );
      break;
    case 'arrow-right':
      content = (
        <>
          <View style={bar(17, strokeWidth, 3, 11.5)} />
          <View style={bar(6, strokeWidth, 14, 7.5, '45deg')} />
          <View style={bar(6, strokeWidth, 14, 13.5, '135deg')} />
        </>
      );
      break;
    case 'message':
      content = (
        <>
          <View
            style={{
              position: 'absolute',
              left: u(3),
              top: u(4),
              width: u(18),
              height: u(13),
              borderWidth: bw,
              borderColor: color,
              borderRadius: u(4),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: u(6.5),
              top: u(14),
              width: u(5),
              height: u(5),
              borderLeftWidth: bw,
              borderBottomWidth: bw,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </>
      );
      break;
    case 'chevron-right':
      content = (
        <>
          <View style={bar(8.5, strokeWidth, 7.75, 8, '45deg')} />
          <View style={bar(8.5, strokeWidth, 7.75, 14, '135deg')} />
        </>
      );
      break;
    case 'chevron-left':
      content = (
        <>
          <View style={bar(8.5, strokeWidth, 7.75, 8, '135deg')} />
          <View style={bar(8.5, strokeWidth, 7.75, 14, '45deg')} />
        </>
      );
      break;
    case 'chevron-down':
      content = (
        <>
          <View style={bar(8.5, strokeWidth, 4.75, 10, '45deg')} />
          <View style={bar(8.5, strokeWidth, 10.75, 10, '-45deg')} />
        </>
      );
      break;
    default:
      content = (
        <View
          style={{
            width: u(4),
            height: u(4),
            borderRadius: u(2),
            backgroundColor: color,
          }}
        />
      );
  }

  return <View style={[styles.container, { width: size, height: size }, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
