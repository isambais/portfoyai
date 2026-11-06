import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';

// Gri arka planlı, köşeleri yuvarlak kutu. Bütün ekranlarda tekrar kullanılır.
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card, // #F1F5F9 açık gri
    borderRadius: radius.lg,                 // 16 → yuvarlak köşe
    padding: spacing.md,                     // 16 → içerik kenara yapışmasın
    gap: spacing.sm,                         // 8  → içerideki satırlar arası boşluk
  },
});