import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';

// Henüz tasarlanmamış ekranlar için geçici şablon.
export function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>Bu ekran yakında tasarlanacak.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.screen },
  container: { flex: 1, padding: spacing.md, gap: spacing.sm },
  title: { ...typography.h1, color: colors.text.primary },
  caption: { ...typography.caption, color: colors.text.secondary },
});