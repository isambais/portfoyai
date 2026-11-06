import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Variant = 'danger' | 'warning' | 'info';
type IconName = ComponentProps<typeof Ionicons>['name'];

const VARIANTS: Record<Variant, { text: string; bg: string; icon: IconName }> = {
  danger:  { text: colors.negative.text, bg: colors.negative.background, icon: 'alert-circle-outline' },
  warning: { text: colors.warning.text, bg: colors.warning.background, icon: 'warning-outline' },
  info:    { text: colors.accent.default, bg: colors.accent.light, icon: 'information-circle-outline' },
};

// Uyarı / bilgi şeridi. actionLabel verilirse sağda bir buton çıkar.
export function Notice({
  message,
  variant,
  actionLabel,
  onAction,
}: {
  message: string;
  variant: Variant;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const v = VARIANTS[variant];
  return (
    <View style={[styles.box, { backgroundColor: v.bg }]}>
      <Ionicons name={v.icon} size={20} color={v.text} />
      <Text style={[styles.message, { color: v.text }]}>{message}</Text>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[styles.action, { color: v.text }]}>{actionLabel} →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  message: { ...typography.caption, flex: 1 },
  action: { ...typography.caption, fontWeight: '700' },
});