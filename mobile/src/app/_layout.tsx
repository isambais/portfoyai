import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="oneri/[id]"
        options={{
          headerShown: true,
          title: 'Öneri detayı',
          headerBackTitle: 'Geri',
          headerTintColor: colors.text.primary,
        }}
      />
    </Stack>
  );
}