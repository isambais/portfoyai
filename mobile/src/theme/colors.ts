// Figma'daki renk stillerinin birebir karşılığı.
// Bir rengi değiştirmek için sadece burayı değiştirmek yeterli,
// bütün ekranlar otomatik güncellenir.
export const colors = {
  primary:    { default: '#1E293B', pressed: '#0F172A' },
  accent:     { default: '#4F46E5', light: '#EEF2FF' },
  background: { screen: '#FFFFFF', card: '#F1F5F9' },
  text:       { primary: '#1E293B', secondary: '#64748B', inverse: '#FFFFFF' },
  positive:   { text: '#047857', background: '#D1FAE5' },
  negative:   { text: '#B91C1C', icon: '#EF4444', background: '#FEE2E2' },
  warning:    { text: '#B45309', background: '#FEF3C7' },
} as const;