import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Variant = 'positive' | 'negative' | 'warning' | 'info';

// Her tür için: [yazı rengi, arka plan rengi]
const VARIANTS: Record<Variant, [string, string]> = {
  positive: [colors.positive.text, colors.positive.background],
  negative: [colors.negative.text, colors.negative.background],
  warning:  [colors.warning.text,  colors.warning.background],
  info:     [colors.accent.default, colors.accent.light],
};

// Küçük renkli etiket: "▲ %1,24", "Güven: 4/5 model" gibi.
export function Badge({ label, variant }: { label: string; variant: Variant }) {
  const [textColor, bgColor] = VARIANTS[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',          // ekran boyu uzamasın, yazı kadar olsun
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,        // 999 → hap şekli
  },
  text: { ...typography.caption, fontWeight: '600' },
});