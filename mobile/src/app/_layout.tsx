import { Stack } from 'expo-router';

// Uygulamanın en dış katmanı.
// Stack = ekranların üst üste açıldığı yapı (geri tuşuyla bir öncekine dönülür).
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Alt menülü ana bölüm */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}