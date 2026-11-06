import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { colors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index',     title: 'Ana Sayfa', icon: 'home-outline' },
  { name: 'portfoy',   title: 'Portföy',   icon: 'briefcase-outline' },
  { name: 'simulator', title: 'Simülatör', icon: 'flask-outline' },
  { name: 'ogren',     title: 'Öğren',     icon: 'book-outline' },
  { name: 'profil',    title: 'Profil',    icon: 'person-outline' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent.default,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: { backgroundColor: colors.background.screen },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} color={color as string} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}